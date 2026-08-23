import { FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl pb-24 lg:pb-6">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FB3] to-[#C9A7FF] text-2xl font-bold text-white">
            <FiUser />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#FF8FB3]">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">
              {user?.name || "User"}
            </h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#F1E5EE] bg-[#FFF7FB] p-4">
            <div className="text-sm text-[#64748B]">Email</div>
            <div className="mt-2 font-medium text-[#1F2937]">
              {user?.email || "-"}
            </div>
          </div>
          <div className="rounded-2xl border border-[#F1E5EE] bg-[#FFF7FB] p-4">
            <div className="text-sm text-[#64748B]">Mobile</div>
            <div className="mt-2 font-medium text-[#1F2937]">
              {user?.mobile || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
