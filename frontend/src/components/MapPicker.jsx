import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

export default function MapPicker({ onSelect }) {
  const [marker, setMarker] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        onSelect(lat, lng);
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  return (
    <div className="h-64 rounded overflow-hidden border">
      <MapContainer
        center={[13.02, 77.59]}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
