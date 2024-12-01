'use client';

import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef, useState, useCallback } from 'react';

export type LatLng = {
  lat: number;
  lng: number;
};

interface GoogleMapProps {
  onLocationChange: (location: LatLng, geocodeObject: google.maps.GeocoderResult) => void;
}

const GoogleMap = ({ onLocationChange }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Memoize onLocationChange to prevent unnecessary re-renders
  const memoizedOnLocationChange = useCallback(onLocationChange, [onLocationChange]);

  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
        version: 'weekly',
      });

      try {
        const { Map } = await loader.importLibrary('maps');
        console.log('Google Maps loaded successfully');

        const center = { lat: 3.139, lng: 101.6869 };
        const malaysiaBounds = new google.maps.LatLngBounds(
          { lat: 0.8538, lng: 99.6042 },
          { lat: 7.3634, lng: 119.2676 },
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
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Add event listener after the map is initialized
  useEffect(() => {
    if (!map) return;

    // Use a flag to track whether a click has been processed
    let isClickProcessed = false;

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
      // Prevent multiple executions
      if (isClickProcessed) return;
      isClickProcessed = true;

      if (e.latLng) {
        const geocoder = new google.maps.Geocoder();
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
        const latLng = e.latLng;

        try {
          console.log('Map clicked at:', latLng.lat(), latLng.lng());
          const results = await geocoder.geocode({ location: latLng });
          
          if (results.results[0]) {
            const clickedAddress = results.results[0].formatted_address;
            console.log('Geocode Object:', results.results[0]);

            // Remove previous marker if exists
            if (markerRef.current) {
              markerRef.current.map = null;
            }

            // Create a new marker
            markerRef.current = new AdvancedMarkerElement({
              map: map,
              position: {
                lat: latLng.lat(),
                lng: latLng.lng(),
              },
              title: clickedAddress,
            });

            console.log('Clicked address:', clickedAddress);
            memoizedOnLocationChange({ lat: latLng.lat(), lng: latLng.lng() }, results.results[0]);
          } else {
            alert('No address found for this location');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          alert('Failed to get address');
        } finally {
          // Reset the flag after processing
          isClickProcessed = false;
        }
      }
    };

    // Use addListenerOnce to ensure single execution
    const clickListener = google.maps.event.addListenerOnce(map, 'click', handleMapClick);

    // Cleanup function
    return () => {
      // Remove the listener
      google.maps.event.removeListener(clickListener);

      // Clear the marker
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, memoizedOnLocationChange]);

  return (
    <div className="w-[1120px] h-[450px] rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-5">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default GoogleMap;