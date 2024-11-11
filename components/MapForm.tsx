'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapProvider } from '@/providers/map-provider';
import { MapComponent } from './map';
import { Card, CardContent} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { states } from '@/types/constants';

interface MapFormProps {
  onLocationChange: (address: string, date: string, time: number) => void;
}
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const MapForm: React.FC<MapFormProps> = ({ onLocationChange }) => {
  const [markerData, setMarkerData] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState<number>(0);

  // State for parsed address fields
  const [addressFields, setAddressFields] = useState({
      lotRoomBuilding: '',
      streetName: '',
      placeName: '',
      postcode: '',
      city: '',
      state: '',
    });


  const apiKey = process.env.GOOGLE_MAP_API;  // Replace with your actual Google API key

  // Callback function to handle the data from MapComponent
  const handleMapData = (lat: number, lng: number, address: string) => {
    setMarkerData({ lat, lng, address });
    parseAddressWithGoogleAPI(lat, lng);
  };

  const parseAddressWithGoogleAPI = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: apiKey,
        },
      });
  
      if (response.data.results.length > 0) {
        const addressComponents: AddressComponent[] = response.data.results[0].address_components;
  
        // Extract address components
        // Map each component from the response to your state fields
        const lotRoomBuilding = addressComponents.find(component => component.types.includes('street_number'))?.long_name || '';
        const streetName = addressComponents.find(component => component.types.includes('route'))?.long_name || '';
        const placeName = addressComponents.find(component => component.types.includes('neighborhood') || component.types.includes('sublocality'))?.long_name || '';
        const postcode = addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '';
        const city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
        const stateFromAPI = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '';

        // Set the state based on the provided states object
        const state = Object.values(states).find(state => stateFromAPI.toLowerCase().includes(state.toLowerCase())) || stateFromAPI;
  
        // Update the addressFields state
        setAddressFields({
          lotRoomBuilding,
          streetName,
          placeName,
          postcode,
          city,
          state,
        });
      } else {
        console.error("No address found for the given coordinates");
      }
    } catch (error) {
      console.error("Error fetching address from Google API:", error);
    }
  };

  useEffect(() => {
    // Only proceed if all required values are available
    if (markerData && date && time !== null) {
      onLocationChange(markerData.address, date, time);
    } else {
      if (!markerData) console.error("No marker data");
      if (!date) console.error("Date is null");
      if (time === null) console.error("Time is null");
    }
  }, [markerData, date, time, onLocationChange]);

    // Update time state when the input value changes
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeValue = e.target.value; // Get the new value from the input
      setTime(Number(timeValue)); // Update the state with the new time value
      console.log('Time selected:', timeValue); // Log the value to the console
    };
    // Update date state when the input value changes
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value; // Get the new value from the input
      setDate(dateValue); // Update the state with the new time value
      console.log('Time selected:', dateValue); // Log the value to the console
    };

  return (
    <div>
      <div className="font-semibold text-2xl max-w-[1200px] text-center text-[300%] p-20">
        Location of Incident
      </div>

      <div className="w-[1120px] h-[450px] rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-5">
        <MapProvider>
          <MapComponent onLocationChange={handleMapData} />
        </MapProvider>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label htmlFor="lotRoomBuilding" className='w-full flex items-start mb-2'>Lot/Room/Office/Building No.</Label>
                <Input
                  id="lotRoomBuilding"
                  placeholder="Enter lot/room/office/building no."
                  value={addressFields.lotRoomBuilding}
                  onChange={(e) => setAddressFields({ ...addressFields, lotRoomBuilding: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="streetName" className='w-full flex items-start mb-2'>Street Name</Label>
                <Input
                  id="streetName"
                  placeholder="Enter street name"
                  value={addressFields.streetName}
                  onChange={(e) => setAddressFields({ ...addressFields, streetName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="placeName" className='w-full flex items-start mb-2'>Park/Place Name</Label>
                <Input
                  id="placeName"
                  placeholder="Enter park/place name"
                  value={addressFields.placeName}
                  onChange={(e) => setAddressFields({ ...addressFields, placeName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="postcode" className='w-full flex items-start mb-2'>Postcode</Label>
                <Input
                  id="postcode"
                  placeholder="Enter postcode"
                  value={addressFields.postcode}
                  onChange={(e) => setAddressFields({ ...addressFields, postcode: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <Label htmlFor="city" className='w-full flex items-start mb-2'>City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={addressFields.city}
                    onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="state" className='w-full flex items-start mb-2'>State</Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    value={addressFields.state}
                    onChange={(e) => setAddressFields({ ...addressFields, state: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="date" className='w-full flex items-start mb-2'>Date</Label>
                  <Input
                    id="date"
                    type="date"
                    placeholder="Enter date of incident"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="mb-4">
                    <Label htmlFor="time" className="w-full flex items-start mb-2">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      placeholder="Enter time of incident"
                      value={time}
                      onChange={handleTimeChange}
                    />
                </div>
              </CardContent>
            </Card>

        </div>
    </div>
  );
};

export default MapForm;


