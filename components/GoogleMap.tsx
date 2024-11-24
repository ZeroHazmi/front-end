'use client';

import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
      const geocoder = new google.maps.Geocoder();

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

      mapInstance.addListener('click', async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const latLng = e.latLng;

          try {
            const results = await geocoder.geocode({ location: latLng });
            if (results.results[0]) {
              const clickedAddress = results.results[0].formatted_address;
              console.log('Geocode Object:', results.results[0]);

              if (markerRef.current) {
                markerRef.current.map = null;
              }

              // Create a new marker
              markerRef.current = new AdvancedMarkerElement({
                map: mapInstance,
                position: {
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                },
                title: clickedAddress,
              });

              console.log('Clicked address:', clickedAddress);
              onLocationChange({ lat: latLng.lat(), lng: latLng.lng() }, results.results[0]);
            } else {
              alert('No address found for this location');
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            alert('Failed to get address');
          }
        }
      });
    };

    initMap();

  }, [onLocationChange]);

  return (
    <div className="w-[1120px] h-[450px] rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-5" >
        <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
};

export default GoogleMap;
