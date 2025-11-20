import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import ParkingMap from "../components/ParkingMap";
import FilterChips from "../components/FilterChips";
import BookingModal from "../components/BookingModal";

function Home() {
  const [parkingList, setParkingList] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingParking, setBookingParking] = useState(null);

  const coordsRef = useRef({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
        coordsRef.current = { lat: latitude, lng: longitude };
        const res = await API.get(`/parking/nearby?lat=${latitude}&lng=${longitude}`);
        setParkingList(res.data);
      });
    } else {
      alert("Geolocation not supported by this browser.");
    }
  }, []);

  const applyFilters = async ({ vehicle_type, priceMin, priceMax, sort }) => {
    const { lat, lng } = coordsRef.current;
    if (!lat || !lng) return;
    const params = new URLSearchParams({
      lat, lng,
      vehicle_type: vehicle_type || "",
      sort: sort || "distance",
    });
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);

    const res = await API.get(`/parking/filter?${params.toString()}`);
    setParkingList(res.data);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterChips onApply={applyFilters} />
    

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-800 text-center">🅿️ Smart Parking – Bengaluru</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parkingList.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`text-left border p-4 rounded-xl bg-white shadow hover:shadow-lg transition ${
                selectedId === p.id ? "ring-2 ring-blue-600" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                {p.distance_km && <span className="text-xs text-gray-500">{p.distance_km.toFixed(1)} km</span>}
              </div>
              <p className="text-gray-600 text-sm">{p.address}</p>
              <div className="mt-2 text-sm text-gray-700">2W: {p.two_wheeler_slots} | 4W: {p.four_wheeler_slots}</div>

              <div className="text-blue-700 font-medium mt-1">₹{p.price_2w_per_hour}/hr (2W) · ₹{p.price_4w_per_hour}/hr (4W)</div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  📍 Navigate
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBookingParking(p);
                    setShowBookingModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                >
                  ⏱ Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-[70vh] w-full rounded-xl overflow-hidden shadow-lg">
          <ParkingMap
            parkingList={parkingList}
            userLocation={userLoc}
            selectedId={selectedId}
            onStartBooking={(park) => { setBookingParking(park); setShowBookingModal(true); }}
          />
        </div>

        <BookingModal open={showBookingModal} parking={bookingParking} onClose={() => setShowBookingModal(false)} />
      </div>
    </div>
  );
}

export default Home;
