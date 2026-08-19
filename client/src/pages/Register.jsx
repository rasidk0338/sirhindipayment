import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-lg rounded-[30px] border border-slate-700/60 bg-slate-900/75 p-8 shadow-soft backdrop-blur-xl">
        <div className="mb-8 text-center">
          <BrandLogo className="mx-auto mb-4 h-20 w-48" />
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm text-slate-300">
            Start tracking your task with confidence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-200">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-200">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-200">
                Mobile
              </label>
              <input
                type="tel"
                required
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
