import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-md rounded-[30px] border border-slate-700/60 bg-slate-900/75 p-8 shadow-soft backdrop-blur-xl">
        <div className="mb-8 text-center">
          <BrandLogo className="mx-auto mb-4 h-20 w-48" />
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to manage your ledger
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
