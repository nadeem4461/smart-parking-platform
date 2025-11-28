import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";

export default function AddParking() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    two_wheeler_slots: "",
    four_wheeler_slots: "",
    price_2w_per_hour: "",
    price_4w_per_hour: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleMapSelect(lat, lng) {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  }

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      if (image) fd.append("image", image);

      await API.post("/owner/parkings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Parking added!");
      navigate("/owner/dashboard");

    } catch (err) {
      console.error("Add parking error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Dashboard
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">Add New Parking</h1>

      <form onSubmit={submitForm} className="space-y-4">

        {/* NAME */}
        <input
          name="name"
          placeholder="Parking Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        {/* ADDRESS */}
        <textarea
          name="address"
          placeholder="Address"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        {/* MAP PICKER */}
        <div>
          <label className="font-medium">Select Location on Map</label>
          <MapPicker onSelect={handleMapSelect} />

          <p className="text-sm text-gray-600 mt-2">
            📍 Lat: <b>{form.latitude}</b> | Lng: <b>{form.longitude}</b>
          </p>
        </div>

        {/* SLOTS */}
        <div className="grid grid-cols-2 gap-4">
          <input name="two_wheeler_slots" placeholder="2W Slots" className="border p-2 rounded" onChange={handleChange}/>
          <input name="four_wheeler_slots" placeholder="4W Slots" className="border p-2 rounded" onChange={handleChange}/>
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-2 gap-4">
          <input name="price_2w_per_hour" placeholder="₹ per hour (2W)" className="border p-2 rounded" onChange={handleChange}/>
          <input name="price_4w_per_hour" placeholder="₹ per hour (4W)" className="border p-2 rounded" onChange={handleChange}/>
        </div>

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded w-full"
        />

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Parking"}
        </button>
      </form>
    </div>
  );
}
