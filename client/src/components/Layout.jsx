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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-slate-700/60 bg-slate-900/70 p-5 shadow-soft lg:flex lg:flex-col">
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
                      ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white ring-1 ring-indigo-400/40"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <Icon className="text-base" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Account
            </div>
            <div className="mt-2 text-base font-medium text-white">
              {user?.name || "User"}
            </div>
            <button
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 transition hover:border-red-400 hover:text-red-300"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between rounded-[24px] border border-slate-700/60 bg-slate-900/70 p-4 shadow-soft lg:hidden">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-12 w-32" />
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-xs text-slate-200"
            >
              Logout
            </button>
          </div>

          <Outlet />
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-700/60 bg-slate-900/90 p-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          {navItems.slice(0, 4).map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${
                  isActive ? "bg-indigo-500/20 text-white" : "text-slate-400"
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
