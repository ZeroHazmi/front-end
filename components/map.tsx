import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

//const position = [2.9332505811333025, 101.79743014583184];  Feisol Hassan-Halle Coordinate
const position = [2.9346039872926095, 101.79966694910442]; // bilik zal
// const position = [2.93459183339846, 101.79937183017714]; bilik ripin

function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  }
  

function MapComponent() {
  return (
    <MapContainer
      center={position}
      zoom={17} // max zoom 🔞 
      style={{ height: '100%', width: '100%' }}  
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          A popup message on this marker.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
