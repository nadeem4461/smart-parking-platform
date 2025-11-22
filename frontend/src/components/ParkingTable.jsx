// frontend/src/components/ParkingTable.jsx
export default function ParkingTable({ parkings = [] }) {
  if (!parkings.length) return <div className="text-gray-500">No parkings found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-600">
          <tr>
            <th className="py-2">#</th>
            <th>Name</th>
            <th>Address</th>
            <th>2W</th>
            <th>4W</th>
            <th>Price 2W</th>
            <th>Price 4W</th>
          </tr>
        </thead>
        <tbody>
          {parkings.map((p, i) => (
            <tr key={p.id} className="border-t">
              <td className="py-2">{i+1}</td>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.two_wheeler_slots}</td>
              <td>{p.four_wheeler_slots}</td>
              <td>₹{p.price_2w_per_hour}</td>
              <td>₹{p.price_4w_per_hour}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
