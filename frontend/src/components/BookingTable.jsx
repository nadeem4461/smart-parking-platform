// frontend/src/components/BookingTable.jsx
export default function BookingTable({ bookings = [] }) {
  if (!bookings.length) return <div className="text-gray-500">No bookings yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="text-left text-gray-600">
          <tr>
            <th className="py-2">#</th>
            <th>Parking</th>
            <th>User</th>
            <th>Vehicle</th>
            <th>Hours</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id} className="border-t">
              <td className="py-2">{i+1}</td>
              <td>{b.parking_name}</td>
              <td>{b.user_name ?? b.user_id}</td>
              <td>{b.vehicle_type}</td>
              <td>{b.hours}</td>
              <td>₹{b.total_amount}</td>
              <td>{new Date(b.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
