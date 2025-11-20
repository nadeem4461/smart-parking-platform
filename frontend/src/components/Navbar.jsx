import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left section - logo + main links */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-blue-700">SmartPark+</h1>

          <Link
            to="/"
            className={`font-medium ${
              location.pathname === "/" ? "text-blue-700" : "text-gray-600"
            } hover:text-blue-700`}
          >
            Home
          </Link>

          <Link
            to="/bookings"
            className={`font-medium ${
              location.pathname === "/bookings"
                ? "text-blue-700"
                : "text-gray-600"
            } hover:text-blue-700`}
          >
            My Bookings
          </Link>
        </div>
        <Link to="/traffic" className="hover:text-blue-700">
  Traffic Advisor
</Link>
        {/* Right section - logout */}
        <div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/"; // redirect to home after logout
            }}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
