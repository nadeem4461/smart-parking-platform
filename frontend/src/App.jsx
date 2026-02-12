import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddParking from "./pages/AddParking";
import EditParking from "./pages/EditParking";
import TrafficAdvisor from "./pages/TrafficAdvisor";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
        }
      }} />

      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* Navbar only shows on protected pages usually, or wraps them */}
              <div className="flex flex-col h-screen overflow-hidden">
                <Navbar />
                <div className="flex-1 overflow-hidden relative">
                  <Home />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-50">
                <Navbar />
                <MyBookings />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/traffic"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-50">
                <Navbar />
                <TrafficAdvisor />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Protected Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <div className="min-h-screen bg-slate-50">
                <Navbar />
                <OwnerDashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-parking"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <div className="min-h-screen bg-slate-50">
                <Navbar />
                <AddParking />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <div className="min-h-screen bg-slate-50">
                <Navbar />
                <EditParking />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
