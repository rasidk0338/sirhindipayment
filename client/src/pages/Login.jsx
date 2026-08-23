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
      <div className="w-full max-w-md rounded-[30px] border border-[#F1E5EE] bg-white/80 p-8 shadow-[0_18px_40px_rgba(201,167,255,0.12)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <BrandLogo className="mx-auto mb-4 h-20 w-48" />
          <h1 className="text-3xl font-bold text-[#1F2937]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Sign in to manage your ledger
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[#1F2937]">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-2xl border border-[#F1E5EE] bg-[#FFF7FB] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#FF8FB3]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#1F2937]">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl border border-[#F1E5EE] bg-[#FFF7FB] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#FF8FB3]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#FF8FB3] to-[#C9A7FF] px-4 py-3 font-semibold text-white shadow-lg shadow-[#C9A7FF]/30 transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#FF8FB3] hover:text-[#E56E9B]"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
