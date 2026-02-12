import { useState, useEffect } from "react";
import { X, Calendar, Clock, Car, Bike, Zap, CreditCard } from "lucide-react";
import API from "../api/axios";
import { toast } from "react-hot-toast";

export default function BookingModal({ open, parking, onClose }) {
  const [qty, setQty] = useState(1);
  const [vehicleType, setVehicleType] = useState("4W");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Set default times on open
  useEffect(() => {
    if (open) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10); // Start 10 mins from now
      setStartTime(now.toISOString().slice(0, 16));

      const end = new Date(now);
      end.setHours(end.getHours() + 2); // Default 2 hours
      setEndTime(end.toISOString().slice(0, 16));
    }
  }, [open]);

  if (!open || !parking) return null;

  const getPrice = () => {
    if (vehicleType === "2W") return parking.price_2w_per_hour;
    if (vehicleType === "4W") return parking.price_4w_per_hour;
    if (vehicleType === "EV") return parking.price_ev_per_hour;
    return 0;
  };

  const calculateTotal = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    if (hours <= 0) return 0;
    return Math.round(hours * getPrice() * qty);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data } = await API.post("/booking/create", {
        parking_id: parking.id,
        vehicle_type: vehicleType,
        qty: parseInt(qty),
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });

      if (data.success) {
        toast.success("Booking Confirmed!");
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Book Parking</h2>
            <p className="text-xs text-slate-500">{parking.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Vehicle Selection */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: '2W', icon: Bike, label: '2 Wheeler' },
              { id: '4W', icon: Car, label: '4 Wheeler' },
              { id: 'EV', icon: Zap, label: 'EV Spot' }
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setVehicleType(type.id)}
                className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all
                    ${vehicleType === type.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Time Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Start Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-sm font-medium text-slate-700">Number of vehicles</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-full bg-white border shadow text-slate-600 font-bold hover:bg-slate-100"
              >-</button>
              <span className="font-bold text-slate-800">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-full bg-white border shadow text-slate-600 font-bold hover:bg-slate-100"
              >+</button>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-400">Total Amount</p>
              <p className="text-3xl font-bold text-slate-900">₹{total}</p>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 transition active:scale-95 flex items-center gap-2"
            >
              {isProcessing ? "Processing..." : (
                <>
                  <span>Pay Now</span>
                  <CreditCard className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
