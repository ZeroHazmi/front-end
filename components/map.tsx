import { useState, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const defaultMapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0px 0px 0px 0px',
};

const defaultMapCenter = { lat: 3.139, lng: 101.6869 };
const defaultMapZoom = 18;
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: 'auto',
  mapTypeId: 'roadmap',
};

const MapComponent = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number, address: string) => void }) => {
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState<string>("");
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (autocomplete || !autocompleteRef.current) return; 

    const autocompleteInstance = new google.maps.places.Autocomplete(autocompleteRef.current);
    setAutocomplete(autocompleteInstance);

    if (autocompleteRef.current) {
      map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) {
          autocompleteInstance.setBounds(bounds);
        }
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMarkerPosition({ lat, lng });
          setAddress(place.formatted_address || "");
          map.setCenter(place.geometry.location);

          // Pass data back to the parent component
          onLocationChange(lat, lng, place.formatted_address || "");
        } else {
          setAddress("Place not found");
        }
      });
    }
  }, [autocomplete, onLocationChange]);

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng ? event.latLng.lat() : defaultMapCenter.lat;
    const lng = event.latLng ? event.latLng.lng() : defaultMapCenter.lng;
    setMarkerPosition({ lat, lng });
    const fetchedAddress = await fetchAddressFromCoordinates(lat, lng);
    setAddress(fetchedAddress);

    // Pass data back to the parent component
    onLocationChange(lat, lng, fetchedAddress);
  };

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
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
