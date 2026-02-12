import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet-routing-machine";

// Fix default icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Routing Component to handle path drawing
function Routing({ userLocation, destination }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!userLocation || !destination) {
      // Remove route if no destination
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // Remove existing route before adding new one
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new route
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      addWaypoints: false, // Hide the add waypoint button
      lineOptions: {
        styles: [{ color: '#2563eb', opacity: 0.7, weight: 6 }] // Blue path
      },
      createMarker: function () { return null; } // Don't create default markers on start/end
    }).addTo(map);

    routingControlRef.current = routingControl;

    // Hide the routing container instruction box optionally or clean it up
    // const container = document.querySelector(".leaflet-routing-container");
    // if(container) container.style.display = "none"; 

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, userLocation, destination]);

  return null;
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function ParkingMap({ parkingList, userLocation, selectedId, destination, onStartBooking }) {
  const defaultCenter = [12.9716, 77.5946]; // Bengaluru
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  // Custom Markers
  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3603/3603850.png", // User avatar
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const parkingIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830305.png", // Parking P
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  const selectedIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830305.png",
    iconSize: [45, 45], // Larger
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
    className: "animate-bounce" // Add bounce animation via class
  });

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Update view when selectedId changes (if parking found) */}
      <MapUpdater center={
        selectedId
          ? [parkingList.find(p => p.id === selectedId)?.latitude, parkingList.find(p => p.id === selectedId)?.longitude]
          : center
      } />

      {/* Route Drawing */}
      <Routing userLocation={userLocation} destination={destination} />

      {/* User Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Parking Markers */}
      {parkingList.map((p) => (
        <Marker
          key={p.id}
          position={[p.latitude, p.longitude]}
          icon={selectedId === p.id ? selectedIcon : parkingIcon}
          eventHandlers={{
            click: () => {
              // You can trigger selection logic if passed down
            },
          }}
        >
          <Popup className="custom-popup">
            <div className="p-1">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.address}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onStartBooking(p)}
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded shadow"
                >Book Now</button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border text-blue-600 px-3 py-1 text-xs rounded shadow"
                >Google Maps</a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
