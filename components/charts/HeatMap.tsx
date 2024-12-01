'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 3.139,  // Kuala Lumpur latitude
  lng: 101.6869,  // Kuala Lumpur longitude
};

function IncidentHeatmap() {
  const [heatMapData, setHeatMapData] = useState<any[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedType, setSelectedType] = useState('Incident Type');
  const [selectedSeverity, setSelectedSeverity] = useState('Severity');
  const [searchQuery, setSearchQuery] = useState('');
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Fetch the heatmap data from the API
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {

        const params = new URLSearchParams();
        if (selectedSeverity) params.append("priority", selectedSeverity);
        if (selectedType) params.append("reportTypeId", selectedType);

        const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}incident/heatmap?${params.toString()}`);
        const data = await response.json();
        console.log(data);
        setHeatMapData(data); // Assuming the data is in the expected format
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
        version: 'weekly'
      });

      const { Map } = await loader.importLibrary('maps');
      const geocoder = new google.maps.Geocoder();
      const malaysiaBounds = new google.maps.LatLngBounds(
        { lat: 0.8538, lng: 99.6042 },
        { lat: 7.3634, lng: 119.2676 }
      );

      const mapOptions: google.maps.MapOptions = {
        zoom: 18,
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

      // Create or update the heatmap layer when data is fetched
      if (heatMapData.length > 0) {
        const newHeatmapLayer = new google.maps.visualization.HeatmapLayer({
          data: heatMapData.map((incident: any) => new google.maps.LatLng(incident.lat, incident.lng)),
        });
        newHeatmapLayer.setMap(mapInstance);
        setHeatmapLayer(newHeatmapLayer);
      }
    };

    if (!map) {
      initMap();
    }
  }, [heatMapData, map]);

  // Update heatmap layer when heatmap data changes
  useEffect(() => {
    if (heatmapLayer && heatMapData.length > 0) {
      heatmapLayer.setData(heatMapData.map((incident: any) => new google.maps.LatLng(incident.lat, incident.lng)));
    }
  }, [heatMapData, heatmapLayer]);

  // Function to search for a location
  const searchLocation = async (query: string) => {
    if (query && map) {
      const geocoder = new google.maps.Geocoder();
      try {
        const results = await geocoder.geocode({ address: query });
        if (results.results[0]) {
          const location = results.results[0].geometry.location;
          map.panTo(location);
          map.setZoom(18);
        } else {
          alert('No results found for this location');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        alert('Failed to get location');
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    searchLocation(searchQuery);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex gap-4 mb-4">
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Incident Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Incident Type</SelectItem>
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

      <div className="mb-4 flex items-center">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          onClick={handleSearchClick}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      <div className="w-[1120px] h-[450px] rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-5">
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}

export default IncidentHeatmap;
