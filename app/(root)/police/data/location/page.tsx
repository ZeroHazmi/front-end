"use client"

import React, { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
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
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAP_API!, // Replace with your Google Maps API Key
    libraries: ['visualization'], // Required for HeatmapLayer
  });

  const [incidentData, setIncidentData] = useState([
    { location: { lat: 3.1391, lng: 101.6869 }, weight: 2, type: 'Theft', severity: 'High' },
    { location: { lat: 3.1445, lng: 101.6901 }, weight: 1, type: 'Assault', severity: 'Low' },
    { location: { lat: 3.1307, lng: 101.6823 }, weight: 3, type: 'Theft', severity: 'Critical' },
    { location: { lat: 3.1374, lng: 101.6880 }, weight: 4, type: 'Burglary', severity: 'Medium' },
    { location: { lat: 3.1450, lng: 101.6940 }, weight: 5, type: 'Vandalism', severity: 'High' },
    { location: { lat: 3.1399, lng: 101.7056 }, weight: 2, type: 'Theft', severity: 'Low' },
    { location: { lat: 3.1283, lng: 101.6729 }, weight: 6, type: 'Assault', severity: 'High' },
    { location: { lat: 3.1334, lng: 101.6845 }, weight: 3, type: 'Robbery', severity: 'Medium' },
    { location: { lat: 3.1492, lng: 101.6907 }, weight: 1, type: 'Burglary', severity: 'Low' },
    { location: { lat: 3.1329, lng: 101.6821 }, weight: 4, type: 'Theft', severity: 'Critical' },
    { location: { lat: 3.1421, lng: 101.6786 }, weight: 5, type: 'Vandalism', severity: 'Medium' },
  ]);

  const [selectedType, setSelectedType] = useState('Incident Type');
  const [selectedSeverity, setSelectedSeverity] = useState('Severity');

  // Filter incident data based on selected type and severity
  const filteredData = useMemo(() => {
    return incidentData
      .filter(
        (incident) =>
          (selectedType === 'All' || incident.type === selectedType) &&
          (selectedSeverity === 'All' || incident.severity === selectedSeverity)
      )
      .map((incident) => {
        if (window.google) {
          return {
            location: new window.google.maps.LatLng(incident.location.lat, incident.location.lng),
            weight: incident.weight,
          };
        }
        return null; // Prevent errors if google.maps is not available
      })
      .filter((incident) => incident !== null); // Remove any null values in case google.maps is not available
  }, [selectedType, selectedSeverity, incidentData]);

  interface Incident {
    location: { lat: number; lng: number };
    weight: number;
    type: string;
    severity: string;
  }

  interface LatLng {
    lat: number;
    lng: number;
  }

  interface FilteredIncident {
    location: google.maps.LatLng;
    weight: number;
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    // Optional: you can adjust map bounds based on the data
    const bounds = new window.google.maps.LatLngBounds();
    filteredData.forEach((incident: FilteredIncident) => bounds.extend(incident.location));
    map.fitBounds(bounds);
  }, [filteredData]);

  const onUnmount = useCallback(() => {
    // Cleanup when the map is unmounted
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

            {isLoaded ? (
                <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                >
                <HeatmapLayer
                    data={filteredData}
                    options={{
                    radius: 20, // Size of each "hot" spot
                    opacity: 0.6,
                    gradient: [
                        'rgba(102, 255, 0, 0)',
                        'rgba(102, 255, 0, 1)',
                        'rgba(147, 255, 0, 1)',
                        'rgba(193, 255, 0, 1)',
                        'rgba(238, 255, 0, 1)',
                        'rgba(255, 238, 0, 1)',
                        'rgba(255, 193, 0, 1)',
                        'rgba(255, 147, 0, 1)',
                        'rgba(255, 102, 0, 1)',
                        'rgba(255, 57, 0, 1)',
                        'rgba(255, 0, 0, 1)',
                    ],
                    }}
                />
                </GoogleMap>
            ) : (
                <div>Loading...</div>
            )}
         </div>
    )


}

export default IncidentHeatmap;
