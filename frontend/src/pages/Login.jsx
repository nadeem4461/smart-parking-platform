import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ParkingCircle, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import API from "../api/axios";
import toast from "react-hot-toast";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", form);
      // { token, name, role }
      saveAuth(data);
      toast.success("Welcome back, " + (data.name || "user") + " 👋");
      nav("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <ParkingCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">SmartPark+</h1>
          <p className="text-slate-500">Welcome back! Please login to continue</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-6"
        >
          {/* email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={onChange}
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <div className="text-right">
            <button type="button" className="text-blue-600 hover:text-blue-700">
              Forgot password?
            </button>
          </div>

          <Button
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30"
          >
            {loading ? "Logging in…" : "Login"}
          </Button>

          {/* divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-slate-400">or</span>
            </div>
          </div>

          {/* google (placeholder) */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50"
            onClick={() => toast("Google sign-in coming soon")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-600">
            Dont have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
