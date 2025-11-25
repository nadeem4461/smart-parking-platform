import { useState } from "react";
import API from "../api/axios";
import MapPicker from "../components/MapPicker"; // We'll add this too

export default function AddParking({ onAdded }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    capacity_2w: "",
    capacity_4w: "",
    price_2w_per_hour: "",
    price_4w_per_hour: "",
    image: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        fd.append(key, val);
      });

      const res = await API.post("/owner/parkings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Parking Added Successfully!");

      onAdded(); // refresh dashboard

    } catch (err) {
      console.error("Add parking error:", err);
      alert("Failed to add parking");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Add New Parking</h2>

      <form onSubmit={submitForm} className="space-y-4">
        
        {/* Parking Name */}
        <input
          type="text"
          name="name"
          placeholder="Parking Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        ></textarea>

        {/* Map Picker Section */}
        <MapPicker
          onSelect={(lat, lng) =>
            setForm({ ...form, latitude: lat, longitude: lng })
          }
        />

        <div className="flex gap-3">
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            className="border p-2 rounded w-1/2"
            value={form.latitude}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            className="border p-2 rounded w-1/2"
            value={form.longitude}
            onChange={handleChange}
            required
          />
        </div>

        {/* Slots */}
        <div className="flex gap-3">
          <input
            type="number"
            name="capacity_2w"
            placeholder="2W Slots"
            className="border p-2 rounded w-1/2"
            value={form.capacity_2w}
            onChange={handleChange}
          />

          <input
            type="number"
            name="capacity_4w"
            placeholder="4W Slots"
            className="border p-2 rounded w-1/2"
            value={form.capacity_4w}
            onChange={handleChange}
          />
        </div>

        {/* Prices */}
        <div className="flex gap-3">
          <input
            type="number"
            name="price_2w_per_hour"
            placeholder="₹ per hour (2W)"
            className="border p-2 rounded w-1/2"
            value={form.price_2w_per_hour}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price_4w_per_hour"
            placeholder="₹ per hour (4W)"
            className="border p-2 rounded w-1/2"
            value={form.price_4w_per_hour}
            onChange={handleChange}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-medium">Parking Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border p-2 rounded"
          />

          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Parking
        </button>
      </form>
    </div>
  );
}
