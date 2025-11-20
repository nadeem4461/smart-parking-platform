import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});

export default function MapView({ parkingList }) {
  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={12} className="h-[70vh] w-full rounded-lg shadow-md mt-6">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {parkingList.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]} icon={markerIcon}>
          <Popup>
            <b>{p.name}</b><br />
            {p.address}<br />
            2W: {p.two_wheeler_slots} | 4W: {p.four_wheeler_slots}<br />
            Rs {p.price_2w_per_hour}/hr (2W)<br />
            Rs {p.price_4w_per_hour}/hr (4W)
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
