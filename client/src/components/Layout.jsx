import { NavLink, Outlet } from "react-router-dom";
import {
  FiBarChart2,
  FiUsers,
  FiPlusCircle,
  FiFileText,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";

const navItems = [
  { label: "Dashboard", to: "/", icon: FiBarChart2 },
  { label: "Clients", to: "/clients", icon: FiUsers },
  { label: "Add Transaction", to: "/transactions/new", icon: FiPlusCircle },
  { label: "History", to: "/transactions", icon: FiFileText },
  { label: "Profile", to: "/profile", icon: FiUser },
  { label: "Settings", to: "/settings", icon: FiSettings },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FFF9F0_0%,#FFD6E7_40%,#E8D6FF_100%)] text-[#1F2937]">
      <div className="mx-auto flex w-full max-w-7xl gap-4 p-3 sm:p-4 md:gap-6 md:p-6">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(255,214,231,0.4),rgba(232,214,255,0.46))] p-5 shadow-[0_12px_32px_rgba(201,167,255,0.08)] lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <BrandLogo className="h-16 w-full" />
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF8FB3]/15 to-[#C9A7FF]/15 text-[#1F2937] ring-1 ring-[#FF8FB3]/25"
                      : "text-[#64748B] hover:bg-[#FFF7FB] hover:text-[#1F2937]"
                  }`
                }
              >
                <Icon className="text-base" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#F1E5EE] bg-[#FFF7FB] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#64748B]">
              Account
            </div>
            <div className="mt-2 text-base font-medium text-[#1F2937]">
              {user?.name || "User"}
            </div>
            <button
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(255,214,231,0.32),rgba(232,214,255,0.28))] px-3 py-2 text-sm text-[#1F2937] transition hover:border-[#F87171] hover:text-[#F87171]"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-[28px] border border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,249,240,0.72),rgba(255,214,231,0.82),rgba(232,214,255,0.8))] p-3 shadow-[0_16px_40px_rgba(201,167,255,0.10)] md:p-5">
          <div className="mb-4 flex items-center justify-between rounded-[24px] border border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(255,214,231,0.42),rgba(232,214,255,0.38))] p-4 shadow-[0_12px_32px_rgba(201,167,255,0.08)] lg:hidden">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-12 w-32" />
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-[#F1E5EE] bg-[#FFF7FB] px-3 py-2 text-xs text-[#1F2937]"
            >
              Logout
            </button>
          </div>

          <Outlet />
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.76),rgba(255,214,231,0.35),rgba(232,214,255,0.35))] p-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-1 sm:gap-2">
          {navItems.slice(0, 4).map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${
                  isActive ? "bg-[#FF8FB3]/15 text-[#1F2937]" : "text-[#64748B]"
                }`
              }
            >
              <Icon className="mb-1 text-base" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
