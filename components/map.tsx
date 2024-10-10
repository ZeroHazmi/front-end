// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// const initialPosition: [number, number] = [2.9346039872926095, 101.79966694910442]; // Default to bilik zal

// interface ChangeViewProps {
//   center: [number, number];
//   zoom: number;
// }

// function ChangeView({ center, zoom }: ChangeViewProps) {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, zoom);
//     }
//   }, [center, zoom, map]);
//   return null;
// }

// function MapComponent() {
//   const [center, setCenter] = useState<[number, number]>(initialPosition);
//   const zoom = 17;

//   // Simulate a dynamic change in position (for example, after an API call or user action)
//   useEffect(() => {
//     setTimeout(() => {
//       setCenter([2.93459183339846, 101.79937183017714]); // Move to bilik ripin after 3 seconds
//     }, 3000);
//   }, []);

//   return (
//     <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
//       <ChangeView center={center} zoom={zoom} />
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={center}>
//         <Popup>A popup message on this marker.</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }

// export default MapComponent;