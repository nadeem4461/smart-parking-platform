import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function BookingModal({ open, parking, onClose }) {
  if (!open || !parking) return null;

  const [vehicleType, setVehicleType] = useState("2W");
  const [qty, setQty] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  // calculate price preview
  const calcTotal = () => {
    if (!startTime || !endTime) return 0;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    if (isNaN(diffMs) || diffMs <= 0) return 0;

    const hours = diffMs / (1000 * 60 * 60);
    const rate =
      vehicleType === "2W"
        ? parking.price_2w_per_hour
        : parking.price_4w_per_hour;

    return Math.round(rate * hours * qty);
  };

  const total = calcTotal();

  const handleBook = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select start and end time");
      return;
    }
    if (qty <= 0) {
      toast.error("Please select at least 1 vehicle");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/booking/create", {
        parking_id: parking.id,
        vehicle_type: vehicleType, // "2W" or "4W"
        qty,
        start_time: startTime,
        end_time: endTime,
      });
      toast.success("Slot(s) booked successfully ✅");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/90 backdrop-blur-xl p-6 w-[380px] rounded-2xl shadow-2xl space-y-4 border border-white/50">
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

        {/* quantity */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Number of vehicles
          </label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* time range */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* total */}
        <div className="text-lg font-semibold text-gray-900">
          Total:{" "}
          <span className="text-blue-700">
            {total > 0 ? `₹${total}` : "--"}
          </span>
        </div>

        {/* actions */}
        <div className="flex gap-2">
          <button
            onClick={handleBook}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-xl shadow hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Booking..." : "Confirm Booking"}
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
