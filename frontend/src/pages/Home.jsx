import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import ParkingMap from "../components/ParkingMap";
import FilterChips from "../components/FilterChips";
import BookingModal from "../components/BookingModal";
import { MapPin, Navigation, Clock, Zap, Car, Bike, Search } from "lucide-react";

function Home() {
  const [parkingList, setParkingList] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingParking, setBookingParking] = useState(null);

  // New state for in-app navigation route
  const [destination, setDestination] = useState(null);

  const coordsRef = useRef({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
        coordsRef.current = { lat: latitude, lng: longitude };
        try {
          const res = await API.get(`/parking/nearby?lat=${latitude}&lng=${longitude}`);
          setParkingList(res.data);
        } catch (error) {
          console.error("Failed to fetch parking", error);
        }
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

  const handleNavigate = (p) => {
    // Set destination for the map to draw the route
    setDestination({ lat: p.latitude, lng: p.longitude });
    // Also select the card
    setSelectedId(p.id);
    // Scroll to map
    document.getElementById('parking-map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Sidebar / List View */}
      <div className="md:w-1/3 lg:w-1/4 h-[50vh] md:h-screen overflow-y-auto bg-white border-r border-slate-200 shadow-xl z-20">
        <div className="p-4 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100">
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="font-bold text-lg">P</span>
            </div>
            SmartPark+
          </h1>
          <p className="text-xs text-slate-500 mt-1">Find the best spot in Bengaluru</p>

          <div className="mt-4">
            <FilterChips onApply={applyFilters} />
          </div>
        </div>

        <div className="p-3 space-y-3">
          {parkingList.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No parking found nearby</p>
            </div>
          )}

          {parkingList.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setDestination({ lat: p.latitude, lng: p.longitude });
              }}
              className={`
                group relative p-4 rounded-xl border transition-all cursor-pointer
                ${selectedId === p.id
                  ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500"
                  : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg"
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-slate-800 text-lg leading-tight w-3/4">{p.name}</h2>
                {p.distance_km && (
                  <span className="flex items-center text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    <Navigation className="w-3 h-3 mr-1" />
                    {p.distance_km.toFixed(1)} km
                  </span>
                )}
              </div>

              <p className="text-slate-500 text-sm mb-3 line-clamp-2 px-1 border-l-2 border-slate-200 pl-2">
                {p.address}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-orange-50 border border-orange-100">
                  <Bike className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                  <span className="block text-xs font-bold text-slate-700">{p.two_wheeler_slots}</span>
                  <span className="text-[10px] text-slate-400">₹{p.price_2w_per_hour}/h</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <Car className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                  <span className="block text-xs font-bold text-slate-700">{p.four_wheeler_slots}</span>
                  <span className="text-[10px] text-slate-400">₹{p.price_4w_per_hour}/h</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-green-50 border border-green-100">
                  <Zap className="w-4 h-4 mx-auto text-green-500 mb-1" />
                  <span className="block text-xs font-bold text-slate-700">{p.ev_slots}</span>
                  <span className="text-[10px] text-slate-400">₹{p.price_ev_per_hour}/h</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(p);
                  }}
                  className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium text-sm flex items-center justify-center gap-1 transition"
                >
                  <MapPin className="w-4 h-4" />
                  Show Route
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBookingParking(p);
                    setShowBookingModal(true);
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-1 shadow-lg shadow-blue-500/30 transition"
                >
                  <Clock className="w-4 h-4" />
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div id="parking-map-section" className="flex-1 h-[50vh] md:h-screen relative bg-slate-100">
        <ParkingMap
          parkingList={parkingList}
          userLocation={userLoc}
          selectedId={selectedId}
          destination={destination}
          onStartBooking={(park) => { setBookingParking(park); setShowBookingModal(true); }}
        />

        {/* Mobile floating action button if needed */}
      </div>

      <BookingModal open={showBookingModal} parking={bookingParking} onClose={() => setShowBookingModal(false)} />
    </div>
  );
}

export default Home;
