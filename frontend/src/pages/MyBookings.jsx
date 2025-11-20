import { use, useEffect,useState } from "react";
import API from "../api/axios";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    
    useEffect(()=>
    {
   API.get("/booking/my")
      .then((res) => setBookings(res.data))
      .catch(() => console.error("Failed to fetch bookings"));
    }
,[])
return(
    <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">My Bookings</h1>

        {bookings.length === 0 ? (<p className="text-gray-500 text-center">NO bookings found</p>) : (
            <div className="space-y-4">
                {bookings.map((b)=>(
                    <div key={b.id}  className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {b.parking_name} - {b.parking_address}
                        </h2>
                        <p className="text-sm text-gray-500">{b.address}</p>
                        <div className="mt-2 text-gray-700">
                            Vehicle :{b.vehicle_type} | Hours: {b.hours} 
                        </div>
                        <div className="font-semibold text-blue-700">
                       ₹{b.total_amount}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(b.created_at).toLocaleString()}
                        </div>

                    </div>
                ))}
            </div>
        )}

    </div>
)
}