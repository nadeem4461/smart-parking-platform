import { useState } from "react";

export default function FilterChips({ onApply, initial = {} }) {
  const [vehicle, setVehicle] = useState(initial.vehicle_type || "");
  const [sort, setSort] = useState(initial.sort || "distance");
  const [priceMin, setPriceMin] = useState(initial.priceMin || "");
  const [priceMax, setPriceMax] = useState(initial.priceMax || "");

  const Chip = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border transition
        ${active ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Vehicle chips */}
        <div className="flex items-center gap-2">
          <Chip active={vehicle === ""} onClick={() => setVehicle("")}>All</Chip>
          <Chip active={vehicle === "2W"} onClick={() => setVehicle("2W")}>2W</Chip>
          <Chip active={vehicle === "4W"} onClick={() => setVehicle("4W")}>4W</Chip>
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="₹ Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-24 px-3 py-1 border rounded"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            min="0"
            placeholder="₹ Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-24 px-3 py-1 border rounded"
          />
        </div>

        {/* Sort dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            <option value="distance">Nearest</option>
            <option value="cheap">Cheapest</option>
            <option value="max">Max Availability</option>
          </select>

          <button
            onClick={() => onApply({
              vehicle_type: vehicle,
              priceMin: priceMin || undefined,
              priceMax: priceMax || undefined,
              sort
            })}
            className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
