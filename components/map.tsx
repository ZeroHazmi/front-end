'use client';

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useRef, useCallback } from "react";

// Styling constants
const defaultMapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0px 0px 0px 0px',
};

const defaultMapCenter = {
  lat: 3.139,    // Latitude for Kuala Lumpur
  lng: 101.6869  // Longitude for Kuala Lumpur
}

const defaultMapZoom = 18;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: 'auto',
  mapTypeId: 'roadmap',
};

const MapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState<string>("");
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Initialize autocomplete on map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (autocompleteRef.current) {
      const autocompleteInstance = new google.maps.places.Autocomplete(autocompleteRef.current);
      setAutocomplete(autocompleteInstance);

      // Bias the autocomplete to the map bounds
      map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) {
          autocompleteInstance.setBounds(bounds);
        }
      });

      // Add event listener for place changes
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry?.location) {
          setMarkerPosition({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          setAddress(place.formatted_address || "");
          map.setCenter(place.geometry.location);
        }
      });
    }
  }, []);

  // Handler for map click to add marker and get address
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng ? event.latLng.lat() : defaultMapCenter.lat;
    const lng = event.latLng ? event.latLng.lng() : defaultMapCenter.lng;

    // Set marker position
    setMarkerPosition({ lat, lng });

    // Geocode the lat and lng to get the address
    const fetchedAddress = await fetchAddressFromCoordinates(lat, lng);
    setAddress(fetchedAddress); // Update address state
  };

  // Geocoder function to fetch address from coordinates
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        return response.results[0].formatted_address;
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error("Geocoder failed:", error);
      return "Failed to get address";
    }
  };

  return (
    <div className="w-[1120px] h-[400px]">
      {/* Search input for autocomplete */}
      <input
        ref={autocompleteRef}
        type="text"
        placeholder="Search for a location"
        className="p-2 w-full rounded border"
      />

      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onLoad={onMapLoad}
        onClick={handleMapClick}  // Handle map clicks
      >
        {/* Render the marker if we have a position */}
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>

      {/* Display the address */}
      {address && (
        <div className="mt-4">
          <strong>Address:</strong> {address}
        </div>
      )}
    </div>
  );
};

export { MapComponent };
