import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ParkingCircle, Mail, Lock, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import API from "../api/axios";
import toast from "react-hot-toast";
import { saveAuth } from "../utils/auth";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      // role defaults to "user"
      const { data } = await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "user",
      });
      // On your backend /signup already returns id,name,email,role (no token).
      // So login immediately after signup to get token:
      const login = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      saveAuth(login.data);
      toast.success("Account created 🎉");
      nav("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <ParkingCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">SmartPark+</h1>
          <p className="text-slate-500">Create your account to get started</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-6"
        >
          {/* name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={onChange}
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
              />
            </div>
          </div>

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
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* confirm */}
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-slate-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Confirm your password"
                value={form.confirm}
                onChange={onChange}
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <Button
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30"
          >
            {loading ? "Creating…" : "Create Account"}
          </Button>

          <p className="text-center text-slate-500">
            By signing up, you agree to our{" "}
            <span className="text-blue-600">Terms</span> and{" "}
            <span className="text-blue-600">Privacy Policy</span>
          </p>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
 