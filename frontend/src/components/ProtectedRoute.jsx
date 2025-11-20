import { Navigate } from "react-router-dom";
import { isAuthed } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const loggedIn = isAuthed();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
