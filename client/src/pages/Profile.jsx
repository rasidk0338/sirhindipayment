import { FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl pb-24 lg:pb-6">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl font-bold text-white">
            <FiUser />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              {user?.name || "User"}
            </h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Email</div>
            <div className="mt-2 font-medium text-white">
              {user?.email || "-"}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Mobile</div>
            <div className="mt-2 font-medium text-white">
              {user?.mobile || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
