import { useEffect, useState } from "react";
import API from "../api/axios";
import AnalyticsCard from "../components/AnalyticsCard";
import EarningsChart from "../components/EarningsChart";
import BookingTable from "../components/BookingTable";
import ParkingTable from "../components/ParkingTable";
import AddParking from "./AddParking";
export default function OwnerDashboard() {
  const [parkings, setParkings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState({ per_day: [], totals: {} });
  const [loading, setLoading] = useState(true);

  const [showAddParking, setShowAddParking] = useState(false);

  // load data function (needed for refresh after adding)
  const loadData = async () => {
    try {
      setLoading(true);

      const [pRes, bRes, eRes] = await Promise.all([
        API.get("/owner/parkings"),
        API.get("/owner/bookings"),
        API.get("/owner/earnings?days=30"),
      ]);

      setParkings(pRes.data.parkings || []);
      setBookings(bRes.data.bookings || []);
      setEarnings(eRes.data || { per_day: [], totals: {} });
    } catch (err) {
      console.error("owner dashboard load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  async function deleteParking(id){
    if(!confirm("Are you sure you want to delete this parking?")) return;
    
    await API.delete(`/owner/parkings/${id}`);
    setParkings((prev) => prev.filter((p) => p.id !== id));

  }
  function editParking(parking){
    navigate("/owner/edit/" + parking.id, { state: parking });
  }


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
   

        {/* ADD PARKING BUTTON */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Owner Dashboard</h1>

          <a
           href="/owner/add-parking"
           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
         >
          ➕ Add Parking
          </a>
        </div>

  

      {/* SHOW ADD PARKING FORM */}
      {showAddParking && (
        <div className="mt-4">
          <AddParking
            onAdded={() => {
              setShowAddParking(false);
              loadData(); // refresh dashboard
            }}
          />
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Total Earnings"
          value={`₹${earnings.totals?.total_earnings ?? 0}`}
        />
        <AnalyticsCard
          title="Total Bookings"
          value={earnings.totals?.total_bookings ?? 0}
        />
        <AnalyticsCard title="Active Parkings" value={parkings.length} />
      </div>

      {/* Earnings line chart */}
      <div className="bg-white p-4 rounded shadow">
        <EarningsChart data={earnings.per_day} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Latest Bookings</h3>
          <BookingTable bookings={bookings} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Your Parkings</h3>
          <ParkingTable parkings={parkings}
           onDelete={deleteParking}
           onEdit = {editParking}
          />
        </div>
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
    </div>
    
  );
}
