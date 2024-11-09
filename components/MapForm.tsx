'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleMaps from './GoogleMap';
import { MapProvider } from '@/providers/map-provider';
import { MapComponent } from './map';

const MapForm = () => {
  const [markerData, setMarkerData] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // State for parsed address fields
  const [addressFields, setAddressFields] = useState({
    lotRoomBuilding: '',  // Separate state for Lot/Room/Office/Building No.
    streetName: '',
    placeName: '',
    postcode: '',
    city: '',
    state: ''
  });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;  // Replace with your actual Google API key

  // Callback function to handle the data from MapComponent
  const handleMapData = (lat: number, lng: number, address: string) => {
    setMarkerData({ lat, lng, address });
    parseAddressWithGoogleAPI(lat, lng);
  };

  // Function to get the address components from Google Geocoding API
  const parseAddressWithGoogleAPI = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: apiKey
        }
      });

      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        
        // Extract address components
        let streetName = addressComponents.find(component => component.types.includes('route'))?.long_name || '';
        let placeName = addressComponents.find(component => component.types.includes('sublocality') || component.types.includes('locality'))?.long_name || '';
        const postcode = addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '';
        const city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
        const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '';

        // Check if placeName starts with a number (likely a building number) and split accordingly
        const placeNameParts = placeName.split(' ');
        if (placeNameParts[0] && !isNaN(placeNameParts[0])) {
          setAddressFields({
            lotRoomBuilding: placeNameParts[0],  // First part is the building number
            streetName: placeNameParts.slice(1).join(' '),  // Remaining part is the street name
            placeName: placeName,
            postcode,
            city,
            state,
          });
        } else {
          // If no building number at the start, assign directly
          setAddressFields({
            lotRoomBuilding: '',
            streetName,
            placeName,
            postcode,
            city,
            state,
          });
        }
      } else {
        console.error("No address found for the given coordinates");
      }
    } catch (error) {
      console.error("Error fetching address from Google API:", error);
    }
  };

  useEffect(() => {
    if (markerData) {
      console.log(markerData);
    } else {
      console.log("No marker data");
    }
  }, [markerData]);

  return (
    <div>
      <div className="font-semibold text-2xl max-w-[1200px] text-center text-[300%] p-20">
        Location of Report
      </div>

      <div className="w-[1120px] h-[450px] rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-5">
        <MapProvider>
          <MapComponent onLocationChange={handleMapData} />
        </MapProvider>
      </div>

      <div className="flex flex-col md:flex-row md:gap-5 justify-between m-[20px] mx-auto gap-5 items-center text-left mt-2">
        {/* LEFT FORM */}
        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-left-custom-blue">
          <div className="flex flex-wrap w-full h-full items-center justify-center mt-1">
            {/* Lot/Room/Office/Building No. */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Lot / Room / Office / Building No.:</label>
              <input
                type="text"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
                value={addressFields.lotRoomBuilding}
                onChange={(e) => setAddressFields({ ...addressFields, lotRoomBuilding: e.target.value })}
              />
            </div>

            {/* Street Name */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Street Name <span className="text-red-500">*</span>:</label>
              <input
                type="text"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
                value={addressFields.streetName}
                onChange={(e) => setAddressFields({ ...addressFields, streetName: e.target.value })}
              />
            </div>

            {/* Park/Place Name */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Park / Place Name <span className="text-red-500">*</span>:</label>
              <input
                type="text"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
                value={addressFields.placeName}
                onChange={(e) => setAddressFields({ ...addressFields, placeName: e.target.value })}
              />
            </div>

            {/* Postcode */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Postcode <span className="text-red-500">*</span>:</label>
              <input
                type="text"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
                value={addressFields.postcode}
                onChange={(e) => setAddressFields({ ...addressFields, postcode: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-right-custom-blue">
          <div className="flex flex-wrap w-full h-full items-center justify-center mt-1">
            {/* City */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">City <span className="text-red-500">*</span>:</label>
              <input
                type="text"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
                value={addressFields.city}
                onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
              />
            </div>

            {/* State */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">State <span className="text-red-500">*</span>:</label>
              <input
                type="text"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
                value={addressFields.state}
                onChange={(e) => setAddressFields({ ...addressFields, state: e.target.value })}
              />
            </div>

            {/* Date */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Date <span className="text-red-500">*</span>:</label>
              <input
                type="date"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
              />
            </div>

            {/* Time */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Time <span className="text-red-500">*</span>:</label>
              <input
                type="time"
                className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapForm;
