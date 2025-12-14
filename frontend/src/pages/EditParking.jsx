import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import MapPicker from "../components/MapPicker";

export default function EditParking() {
  const { state: parking } = useLocation();
  const navigate = useNavigate();

  if (!parking) {
    return <div className="p-6">Parking not found</div>;
  }

  const [form, setForm] = useState({
    name: parking.name,
    address: parking.address,
    latitude: parking.latitude,
    longitude: parking.longitude,
    two_wheeler_slots: parking.two_wheeler_slots,
    four_wheeler_slots: parking.four_wheeler_slots,
    price_2w_per_hour: parking.price_2w_per_hour,
    price_4w_per_hour: parking.price_4w_per_hour,
    image_url: parking.image_url
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true); 

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));

      if (image) fd.append("image", image);

      await API.put(`/owner/parkings/${parking.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });

      alert("Parking updated!");
      navigate("/owner/dashboard");

    } catch (err) {
      console.error("Edit parking error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function setCoords(lat, lng) {
    setForm({ ...form, latitude: lat, longitude: lng });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Edit Parking</h1>

      <form onSubmit={submitForm} className="space-y-4">
        <input name="name" className="w-full border p-2" value={form.name} onChange={handleChange} />

        <textarea name="address" className="w-full border p-2" value={form.address} onChange={handleChange} />

        <MapPicker
          onSelect={setCoords}
          initial={[form.latitude, form.longitude]}
        />

        <div className="grid grid-cols-2 gap-4">
          <input name="latitude" className="border p-2" value={form.latitude} onChange={handleChange} />
          <input name="longitude" className="border p-2" value={form.longitude} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="two_wheeler_slots" className="border p-2" value={form.two_wheeler_slots} onChange={handleChange} />
          <input name="four_wheeler_slots" className="border p-2" value={form.four_wheeler_slots} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="price_2w_per_hour" className="border p-2" value={form.price_2w_per_hour} onChange={handleChange} />
          <input name="price_4w_per_hour" className="border p-2" value={form.price_4w_per_hour} onChange={handleChange} />
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Current Image:</p>
          {form.image_url && (
            <img src={form.image_url} className="h-32 rounded mb-2" />
          )}

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-2"
          />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
