// frontend/src/pages/OwnerDashboard.jsx
import { useEffect, useState } from 'react';
import API from '../api/axios';
import AnalyticsCard from '../components/AnalyticsCard';
import EarningsChart from '../components/EarningsChart';
import BookingTable from '../components/BookingTable';
import ParkingTable from '../components/ParkingTable';

export default function OwnerDashboard() {
  const [parkings, setParkings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState({ per_day: [], totals: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [pRes, bRes, eRes] = await Promise.all([
          API.get('/owner/parkings'),
          API.get('/owner/bookings'),
          API.get('/owner/earnings?days=30')
        ]);
        setParkings(pRes.data.parkings || []);
        setBookings(bRes.data.bookings || []);
        setEarnings(eRes.data || { per_day: [], totals: {} });
      } catch (err) {
        console.error('owner dashboard load error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard title="Total Earnings" value={`₹${earnings.totals?.total_earnings ?? 0}`} />
        <AnalyticsCard title="Total Bookings" value={earnings.totals?.total_bookings ?? 0} />
        <AnalyticsCard title="Active Parkings" value={parkings.length} />
      </div>

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
          <ParkingTable parkings={parkings} />
        </div>
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
    </div>
  );
}
