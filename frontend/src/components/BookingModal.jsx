import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function BookingModal({ open, parking, onClose }) {
  if (!open || !parking) return null;

  const [vehicleType, setVehicleType] = useState("2W");
  const [hours, setHours] = useState(1);

  const calcTotal =
    vehicleType === "2W"
      ? parking.price_2w_per_hour * hours
      : parking.price_4w_per_hour * hours;

  const handleBook = async () => {
    try {
      await API.post("/booking/create", {
        parking_id: parking.id,
        vehicle_type: vehicleType,
        hours,
      });
      toast.success("Slot booked successfully ✅");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/90 backdrop-blur-xl p-6 w-[350px] rounded-2xl shadow-2xl space-y-4 border border-white/50">
        <h2 className="text-xl font-bold text-blue-700">{parking.name}</h2>

        {/* vehicle chips */}
        <div className="flex gap-2">
          {["2W", "4W"].map((v) => (
            <button
              key={v}
              onClick={() => setVehicleType(v)}
              className={`px-3 py-1 rounded-full border 
              ${
                vehicleType === v
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* hours quick chips + custom input */}
        <div className="flex gap-2 items-center flex-wrap">
          {[1, 2, 3, 4].map((h) => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-3 py-1 rounded-full border
              ${
                hours === h
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {h} hr
            </button>
          ))}

          {/* custom input */}
          <input
            type="number"
            min="1"
            placeholder="Custom"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded-md"
          />
        </div>

        <div className="text-lg font-semibold text-gray-900">
          Total: <span className="text-blue-700">₹{calcTotal}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBook}
            className="flex-1 bg-green-600 text-white py-2 rounded-xl shadow hover:bg-green-700"
          >
            Confirm Booking
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded-xl hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
