import { SlidersHorizontal, Car, Bike, Zap, X } from "lucide-react";
import { useState } from "react";

export default function FilterChips({ onApply }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vehicle_type: "",
    priceMin: "",
    priceMax: "",
    sort: "distance",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApply(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const reset = { vehicle_type: "", priceMin: "", priceMax: "", sort: "distance" };
    setFilters(reset);
    onApply(reset);
    setShowFilters(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {showFilters && (
        <div className="absolute top-12 left-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Filter Parking</h3>
            <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Vehicle Type */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Vehicle Type</label>
              <div className="flex gap-2 mt-1">
                {['2W', '4W', 'EV'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters({ ...filters, vehicle_type: filters.vehicle_type === type ? "" : type })}
                    className={`flex-1 py-1.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-1 transition
                      ${filters.vehicle_type === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {type === '2W' && <Bike className="w-3 h-3" />}
                    {type === '4W' && <Car className="w-3 h-3" />}
                    {type === 'EV' && <Zap className="w-3 h-3" />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Hourly Price (₹)</label>
              <div className="flex gap-2 mt-1">
                <input
                  name="priceMin"
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  name="priceMax"
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Sort By</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="distance">Distance (Nearest)</option>
                <option value="cheap">Price (Low to High)</option>
                <option value="max">Availability (Most Slots)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button onClick={clearFilters} className="flex-1 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg">
                Reset
              </button>
              <button onClick={handleApply} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
