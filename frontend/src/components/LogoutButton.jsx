import { clearAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const nav = useNavigate();
  return (
    <button
      onClick={() => {
        clearAuth();
        nav("/login", { replace: true });
      }}
      className="text-sm text-slate-500 hover:text-slate-700"
    >
      Logout
    </button>
  );
}
