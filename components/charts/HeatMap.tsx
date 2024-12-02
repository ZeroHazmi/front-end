'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface HeatmapDataPoint {
  lat: number;
  lng: number;
  weight?: number;
}

function IncidentHeatmap() {
  const [heatMapData, setHeatMapData] = useState<HeatmapDataPoint[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedType, setSelectedType] = useState('Incident Type');
  const [selectedSeverity, setSelectedSeverity] = useState('Severity');
  const [searchQuery, setSearchQuery] = useState('');
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Fetch the heatmap data from the API
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedSeverity !== 'Severity') params.append("priority", selectedSeverity);
        if (selectedType !== 'Incident Type') params.append("reportTypeId", selectedType);

        const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}incident/heatmap?${params.toString()}`);
        const data = await response.json();
        console.log('Fetched Heatmap Data:', data);
        setHeatMapData(data);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchHeatmapData();
  }, [selectedSeverity, selectedType]);

  // Initialize map once and set heatmap layer
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
        version: 'weekly',
        libraries: ['places', 'visualization']
      });

      const { Map } = await loader.importLibrary('maps');
      const { HeatmapLayer } = await loader.importLibrary('visualization') as google.maps.VisualizationLibrary;
      const { PlacesService, AutocompleteService } = await loader.importLibrary('places') as google.maps.PlacesLibrary;

      const center = { lat: 3.139, lng: 101.6869 };
      const malaysiaBounds = new google.maps.LatLngBounds(
        { lat: 0.8538, lng: 99.6042 },
        { lat: 7.3634, lng: 119.2676 }
      );

      const mapOptions: google.maps.MapOptions = {
        zoom: 10,
        center,
        mapId: 'PRAS_MAP',
        mapTypeControl: false,
        restriction: {
          latLngBounds: malaysiaBounds,
          strictBounds: true,
        },
      };

      const mapInstance = new Map(mapRef.current as HTMLDivElement, mapOptions);
      setMap(mapInstance);

      autocompleteService.current = new AutocompleteService();
      placesService.current = new PlacesService(mapInstance);

      const newHeatmapLayer = new HeatmapLayer({
        map: mapInstance,
        data: heatMapData
          .filter(point => !isNaN(point.lat) && !isNaN(point.lng) && typeof point.lat === 'number' && typeof point.lng === 'number')
          .map((point) => new google.maps.LatLng(point.lat, point.lng)),
      });
      setHeatmapLayer(newHeatmapLayer);
    };

    if (!map) {
      initMap();
    }
  }, [map, heatMapData]);

  // Update heatmap layer when heatmap data changes
  useEffect(() => {
    if (heatmapLayer && heatMapData.length > 0) {
      const validData = heatMapData.filter(point =>
        !isNaN(point.lat) && !isNaN(point.lng) && typeof point.lat === 'number' && typeof point.lng === 'number'
      );
      
      heatmapLayer.setData(
        validData.map((point) => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          weight: point.weight ?? 0  // Default to 0 if weight is undefined
        }))
      );
    }
  }, [heatMapData, heatmapLayer]);

  const searchLocation = useCallback(async (placeId: string) => {
    if (placeId && map && placesService.current) {
      try {
        placesService.current.getDetails(
          { placeId: placeId, fields: ['geometry', 'formatted_address'] },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
              const location = place.geometry.location;
              map.panTo(location);
              map.setZoom(14);
            } else {
              console.error('Place details not found or invalid');
            }
          }
        );
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
  }, [map]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.length > 1 && autocompleteService.current) {
      const request: google.maps.places.AutocompletionRequest = {
        input: value,
        componentRestrictions: { country: 'my' },
      };
      autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions.slice(0, 5));
        }
      });
    } else {
      setPredictions([]);
    }
  }, []);

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex gap-4 mb-4">
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Incident Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Incident Type">Incident Type</SelectItem>
            <SelectItem value="Theft">Theft</SelectItem>
            <SelectItem value="Assault">Assault</SelectItem>
            <SelectItem value="Burglary">Burglary</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSeverity} onValueChange={(value) => setSelectedSeverity(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Severity">Severity</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {predictions.length > 0 && (
          <Command className="absolute z-50 w-full mt-1 border rounded-md shadow-md">
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.place_id}
                    onSelect={() => {
                      if (prediction && prediction.description) {
                        setSearchQuery(prediction.description);
                        setPredictions([]);
                        if (prediction.place_id) {
                          searchLocation(prediction.place_id);
                        }
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        searchQuery === prediction.description ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {prediction.description}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>

      <div className="w-full h-[450px] rounded-lg shadow-lg border-2 border-sky-500 mb-5">
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}

export default IncidentHeatmap;

