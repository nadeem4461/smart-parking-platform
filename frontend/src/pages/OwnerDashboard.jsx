import { Link, useLocation } from "react-router-dom";
import { getAuth } from "../utils/auth";

export default function Navbar() {
  const location = useLocation();
  const auth = getAuth();              // { token, name, role }
  const role = auth?.role;             // "user", "owner", "admin"
  const isLoggedIn = !!auth?.token;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* -------------------------- LEFT SECTION -------------------------- */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xl font-bold text-blue-700 hover:text-blue-800"
          >
            SmartPark+
          </Link>

          {/* HOME */}
          <Link
            to="/"
            className={`font-medium ${
              location.pathname === "/" ? "text-blue-700" : "text-gray-600"
            } hover:text-blue-700`}
          >
            Home
          </Link>

          {/* MY BOOKINGS (only for logged-in users) */}
          {isLoggedIn && (
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
          )}

          {/* OWNER DASHBOARD (only visible for role = owner / admin) */}
          {(role === "owner" || role === "admin") && (
            <Link
              to="/owner/dashboard"
              className={`font-medium ${
                location.pathname === "/owner/dashboard"
                  ? "text-blue-700"
                  : "text-gray-600"
              } hover:text-blue-700`}
            >
              Owner Dashboard
            </Link>
          )}

          {/* TRAFFIC ADVISOR (visible for all) */}
          <Link
            to="/traffic"
            className={`font-medium ${
              location.pathname === "/traffic"
                ? "text-blue-700"
                : "text-gray-600"
            } hover:text-blue-700`}
          >
            Traffic Advisor
          </Link>
        </div>

        {/* -------------------------- RIGHT SECTION -------------------------- */}
        <div>
          {/* If logged in → show logout */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("auth");
                window.location.href = "/login";
              }}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          ) : (
            // If NOT logged in → show Login & Signup
            <div className="flex gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-gray-600 hover:text-blue-700"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
