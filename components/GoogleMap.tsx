// Google Maps loader import removed to avoid dependency constraint during build.
// If you need Maps functionality, reinstall '@googlemaps/js-api-loader' and restore this import.
const Loader = null as any;
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type LatLng = {
  lat: number;
  lng: number;
};

interface GoogleMapProps {
  onLocationChange: (location: LatLng, geocodeObject: any) => void;
}

const GoogleMap = ({ onLocationChange }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const autocompleteService = useRef<any | null>(null);
  const placesService = useRef<any | null>(null);

  // Load Google Maps API with required libraries once
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
      version: 'weekly',
      libraries: ['places'] // Only load the libraries you need
    });

    const initMap = async () => {
      try {
        const { Map } = await loader.importLibrary('maps');
        const { PlacesService, AutocompleteService } = await loader.importLibrary('places') as any;

        const center = { lat: 3.139, lng: 101.6869 };
        let malaysiaBounds: any = null;
        if ((window as any).google && (window as any).google.maps && (window as any).google.maps.LatLngBounds) {
          malaysiaBounds = new (window as any).google.maps.LatLngBounds(
            { lat: 0.8538, lng: 99.6042 },
            { lat: 7.3634, lng: 119.2676 },
          );
        }

        const mapOptions: any = {
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

        autocompleteService.current = new AutocompleteService();
        placesService.current = new PlacesService(mapInstance);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []); // This effect runs only once

  const searchLocation = useCallback(async (placeId: string) => {
    if (placeId && map && placesService.current) {
      const { AdvancedMarkerElement } = (window as any).google?.importLibrary
        ? await (window as any).google.importLibrary('marker')
        : { AdvancedMarkerElement: null };

      try {
        placesService.current.getDetails(
          { placeId: placeId, fields: ['formatted_address', 'geometry.location'] },
          (place: any, status: any) => {
            if ((window as any).google && status === (window as any).google.maps.places.PlacesServiceStatus.OK && place) {
              const location = place.geometry?.location;

              if (location) {
                const latLng = {
                  lat: location.lat(),
                  lng: location.lng(),
                };
                const geocoderResult: any = {
                  formatted_address: place.formatted_address || '',
                  geometry: {
                    location,
                    location_type: (window as any).google?.maps?.GeocoderLocationType?.APPROXIMATE,
                    viewport: null as any,
                  },
                  address_components: place.address_components || [],
                  place_id: place.place_id || '',
                  types: place.types || [],
                };

                map.panTo(latLng);
                map.setZoom(18);

                if (markerRef.current) {
                  markerRef.current.map = null;
                  markerRef.current = null;
                }

                if (AdvancedMarkerElement) {
                  markerRef.current = new AdvancedMarkerElement({
                    map,
                    position: latLng,
                    title: geocoderResult.formatted_address,
                  });
                }

                console.log('Location:', latLng, geocoderResult);
                onLocationChange(latLng, geocoderResult);
                setSearchQuery(geocoderResult.formatted_address);
              }
            } else {
              console.error('Place details not found or invalid');
            }
          }
        );
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
  }, [map, onLocationChange]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = async (e: any) => {
      if (!e?.latLng) {
        console.error('No LatLng found in the click event');
        return;
      }

      const geocoder = (window as any).google ? new (window as any).google.maps.Geocoder() : null;
      const { AdvancedMarkerElement } = (window as any).google?.importLibrary
        ? await (window as any).google.importLibrary('marker')
        : { AdvancedMarkerElement: null };

      try {
        const latLng = e.latLng;
        console.log('Clicked location:', latLng.toJSON());

  const results = geocoder ? await geocoder.geocode({ location: latLng }) : null;
        if (results && results.results && results.results[0]) {
          const clickedAddress = results.results[0].formatted_address;
          console.log('Geocoding results:', results.results[0]);

          if (markerRef.current) {
            markerRef.current.map = null;
            markerRef.current = null;
          }

          markerRef.current = new AdvancedMarkerElement({
            map,
            position: latLng,
            title: clickedAddress,
          });

          // Pass both LatLng and GeocoderResult to the callback
          onLocationChange(
            { lat: latLng.lat(), lng: latLng.lng() },
            results.results[0]
          );
          setSearchQuery(clickedAddress);  // Update the search bar with the clicked address
        } else {
          console.error('No address found for the clicked location');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };

    const clickListener = map.addListener('click', handleMapClick);

    return () => {
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.event) {
        (window as any).google.maps.event.removeListener(clickListener);
      }
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, onLocationChange]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.length > 1 && autocompleteService.current) {
      const request: any = {
        input: value,
        componentRestrictions: { country: 'my' },
      };
      autocompleteService.current.getPlacePredictions(request, (predictions: any, status: any) => {
        if ((window as any).google && status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions.slice(0, 8)); // Show up to 8 suggestions
        }
      });
    } else {
      setPredictions([]);
    }
  }, []);

  return (
    <div className="w-full max-w-[1120px] space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
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
      <div className="w-full h-[450px]" ref={mapRef}></div>
    </div>
  );
};

export default GoogleMap;
