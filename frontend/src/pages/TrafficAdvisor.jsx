import { useState } from "react";
import axios from "axios";
import API from "../api/axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";

const KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

// ------------------- CUSTOM MARKERS -------------------

const startIcon = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  iconSize: [32, 32],
});

const endIcon = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

const parkingIcon = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/orange-dot.png",
  iconSize: [32, 32],
});

// -------------------------------------------------------

export default function TrafficAdvisor() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [coords, setCoords] = useState({ from: null, to: null });

  const [routeData, setRouteData] = useState(null);

  // ------------------------ AUTOCOMPLETE ------------------------
  const searchLocation = async (query, type) => {
    try {
      if (query.length < 3) return;

      const url = `https://api.locationiq.com/v1/autocomplete.php?key=${KEY}&q=${encodeURIComponent(
        query
      )}&limit=5`;

      const res = await axios.get(url);

      if (type === "from") setFromSuggestions(res.data);
      else setToSuggestions(res.data);
    } catch (err) {
      console.error("Autocomplete Error:", err);
    }
  };

  // ------------------------ SELECT LOCATION ------------------------
  const selectLocation = (item, type) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    if (type === "from") {
      setFrom(item.display_name);
      setFromSuggestions([]);
      setCoords((prev) => ({ ...prev, from: [lat, lon] }));
    } else {
      setTo(item.display_name);
      setToSuggestions([]);
      setCoords((prev) => ({ ...prev, to: [lat, lon] }));
    }
  };

  // ------------------------ FETCH ROUTE ------------------------
  const getRoute = async () => {
    try {
      if (!coords.from || !coords.to) {
        alert("Please select valid locations");
        return;
      }

      const url = `/traffic/route?from=${coords.from}&to=${coords.to}`;
      const res = await API.get(url);

      const decoded = polyline.decode(res.data.route);

      setRouteData({
        ...res.data,
        points: decoded.map(([lat, lng]) => [lat, lng]),
      });
    } catch (err) {
      console.error("Route Fetch Error:", err);
      alert("Failed to load route");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">🚦 Smart Traffic Advisor</h2>

      {/* FROM INPUT */}
      <input
        className="border p-2 rounded w-1/3"
        value={from}
        onChange={(e) => {
          setFrom(e.target.value);
          searchLocation(e.target.value, "from");
        }}
        placeholder="From: e.g., Yeshwanthpur"
      />

      {fromSuggestions.length > 0 && (
        <div className="bg-white border p-2 w-1/3 rounded shadow">
          {fromSuggestions.map((item, i) => (
            <p
              key={i}
              className="p-1 hover:bg-gray-200 cursor-pointer"
              onClick={() => selectLocation(item, "from")}
            >
              {item.display_name}
            </p>
          ))}
        </div>
      )}

      {/* TO INPUT */}
      <input
        className="border p-2 rounded w-1/3 ml-2"
        value={to}
        onChange={(e) => {
          setTo(e.target.value);
          searchLocation(e.target.value, "to");
        }}
        placeholder="To: e.g., Yelahanka"
      />

      {toSuggestions.length > 0 && (
        <div className="bg-white border p-2 w-1/3 rounded shadow">
          {toSuggestions.map((item, i) => (
            <p
              key={i}
              className="p-1 hover:bg-gray-200 cursor-pointer"
              onClick={() => selectLocation(item, "to")}
            >
              {item.display_name}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={getRoute}
        className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
      >
        Find Route
      </button>

      {/* ------------------------ MAP ------------------------ */}
      {routeData && (
        <>
          <div className="text-lg mt-4">
            Traffic:{" "}
            <span className="font-bold text-red-500">{routeData.status}</span>{" "}
            ({routeData.trafficDelay})
          </div>

          <p>{routeData.suggestion}</p>

          <MapContainer
            center={coords.from}
            zoom={13}
            className="h-[450px] mt-4 rounded-lg shadow"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Route Polyline */}
            <Polyline
              positions={routeData.points}
              color={routeData.status === "heavy" ? "red" : "green"}
              weight={5}
            />

            {/* START MARKER */}
            <Marker position={coords.from} icon={startIcon}>
              <Popup>Start Point</Popup>
            </Marker>

            {/* END MARKER */}
            <Marker position={coords.to} icon={endIcon}>
              <Popup>Destination</Popup>
            </Marker>

            {/* PARKING MARKERS */}
            {routeData.parking.map((p, i) => (
              <Marker
                key={i}
                position={[p.latitude, p.longitude]}
                icon={parkingIcon}
              >
                <Popup>
                  <b>{p.name}</b> <br />
                  ₹{p.price_2w_per_hour}/hr
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </div>
  );
}
