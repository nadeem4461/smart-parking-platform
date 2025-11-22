// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { getAuth } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const auth = getAuth();
  if (!auth?.token) return <Navigate to="/login" replace />;
  if (allowedRoles.length && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
