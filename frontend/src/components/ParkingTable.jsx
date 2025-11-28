import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function ParkingTable({ parkings, onDelete, onEdit }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th>Image</th>
          <th>Name</th>
          <th>Slots</th>
          <th>Location</th>
          <th>Map</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {parkings.map((p) => (
          <tr key={p.id} className="border-b">
            {/* Image */}
            <td>
              <img
                src={p.image_url}
                className="h-16 w-24 object-cover rounded"
              />
            </td>

            {/* Name */}
            <td>{p.name}</td>

            {/* Slots */}
            <td>
              2W: {p.two_wheeler_slots} <br />
              4W: {p.four_wheeler_slots}
            </td>

            {/* Address */}
            <td>{p.address}</td>

            {/* MAP PREVIEW */}
            <td>
              <div className="h-20 w-32 rounded overflow-hidden shadow">
                <MapContainer
                  center={[p.latitude, p.longitude]}
                  zoom={14}
                  scrollWheelZoom={false}
                  dragging={false}
                  zoomControl={false}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[p.latitude, p.longitude]} />
                </MapContainer>
              </div>
            </td>

            {/* Buttons */}
            <td className="space-y-2">
              <button onClick={() => onEdit(p)} className="text-blue-600">
                Edit
              </button>
              <br />
              <button onClick={() => onDelete(p.id)} className="text-red-600">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
