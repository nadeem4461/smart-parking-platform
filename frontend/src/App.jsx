import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import MyBookings from "./pages/MyBookings";
import TrafficAdvisor from "./pages/TrafficAdvisor";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddParking from "./pages/AddParking";
import EditParking from "./pages/EditParking";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
  path="/owner/edit/:id"
  element={
    <ProtectedRoute allowedRoles={['owner','admin']}>
      <EditParking />
    </ProtectedRoute>
  }
/>

        <Route path="/signup" element={<Signup />} />
        <Route path="/bookings" element={<MyBookings />} />
       <Route path="/traffic" element={<TrafficAdvisor />} />
    <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner','admin']}><OwnerDashboard/></ProtectedRoute>} />
    <Route
  path="/owner/add-parking"
  element={
    <ProtectedRoute allowedRoles={['owner', 'admin']}>
      <AddParking />
    </ProtectedRoute>
    
  }
/>



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
