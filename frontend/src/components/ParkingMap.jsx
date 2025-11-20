
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1008/1008010.png",
  iconSize: [40, 40],
});

function FlyToSelected({ selected, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const { latitude, longitude } = selected;
    map.flyTo([latitude, longitude], zoom, { duration: 0.8 });
  }, [selected, map, zoom]);
  return null;
}

export default function ParkingMap({ parkingList, userLocation, selectedId, onStartBooking }) {
  const center = useMemo(
    () => (userLocation ? [userLocation.lat, userLocation.lng] : [12.9716, 77.5946]),
    [userLocation]
  );

  const popupRefs = useRef({});
  const selected = useMemo(() => parkingList.find((p) => p.id === selectedId), [parkingList, selectedId]);

  useEffect(() => {
    if (selected && popupRefs.current[selected.id]) {
      const t = setTimeout(() => {
        try { popupRefs.current[selected.id].openOn(popupRefs.current[selected.id]._map); } catch {}
      }, 850);
      return () => clearTimeout(t);
    }
  }, [selected]);

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full rounded-xl shadow">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      <FlyToSelected selected={selected} />

      {parkingList.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]} icon={icon}>
          <Popup ref={(ref) => (popupRefs.current[p.id] = ref)}>
            <div className="space-y-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">{p.address}</div>
              <div className="text-sm">2W: {p.two_wheeler_slots} | 4W: {p.four_wheeler_slots}</div>
              <div className="text-sm text-blue-700">₹{p.price_2w_per_hour}/hr (2W) | ₹{p.price_4w_per_hour}/hr (4W)</div>
              {p.distance_km && <div className="text-xs text-gray-500">📍 {p.distance_km.toFixed(2)} km</div>}

              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`)}
                className="mt-2 w-full flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                📍 Navigate
              </button>

              <button
                onClick={() => onStartBooking?.(p)}
                className="mt-2 w-full flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow hover:bg-emerald-700"
              >
                🕒 Book Slot
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
