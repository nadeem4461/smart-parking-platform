import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import MyBookings from "./pages/MyBookings";
import TrafficAdvisor from "./pages/TrafficAdvisor";
import OwnerDashboard from "./pages/OwnerDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookings" element={<MyBookings />} />
       <Route path="/traffic" element={<TrafficAdvisor />} />
    <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner','admin']}><OwnerDashboard/></ProtectedRoute>} />


        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
