import { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiArrowUpRight,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api/axios";

const balanceFilterOptions = [
  { label: "All", value: "all" },
  { label: "Credit Balance", value: "credit" },
  { label: "Debit Balance", value: "debit" },
  { label: "Settled", value: "settled" },
];

const summaryConfig = [
  {
    label: "Total Clients",
    key: "totalClients",
    icon: FiUsers,
    tone: "from-[#FF8FB3] to-[#C9A7FF]",
  },
  {
    label: "Total Credit",
    key: "totalCredit",
    icon: FiTrendingUp,
    tone: "from-[#84CC16] to-[#A3E635]",
  },
  {
    label: "Total Debit",
    key: "totalDebit",
    icon: FiTrendingDown,
    tone: "from-[#F87171] to-[#FCA5A5]",
  },
  {
    label: "Net Balance",
    key: "netBalance",
    icon: FiDollarSign,
    tone: "from-[#60A5FA] to-[#93C5FD]",
  },
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCredit: 0,
    totalDebit: 0,
    netBalance: 0,
    transactionsCount: 0,
    recentTransactions: [],
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, clientsRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/clients"),
        ]);

        setStats(dashboardRes.data);
        setClients(clientsRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClients = clients.filter((client) => {
    const q = search.toLowerCase();
    const matchesQuery =
      !q ||
      client.name.toLowerCase().includes(q) ||
      client.mobile.toLowerCase().includes(q);

    const matchesFilter =
      filter === "all" ||
      (filter === "credit" && client.currentBalance > 0) ||
      (filter === "debit" && client.currentBalance < 0) ||
      (filter === "settled" && client.currentBalance === 0);

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#FF8FB3]">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1F2937] md:text-4xl">
            Financial dashboard
          </h1>
        </div>
        <Link
          to="/transactions/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF8FB3] to-[#C9A7FF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C9A7FF]/20"
        >
          <FiPlus />
          Add Transaction
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryConfig.map(({ label, key, icon: Icon, tone }) => (
          <div key={key} className="metric-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748B]">{label}</p>
                <p className="mt-3 text-2xl font-bold text-[#1F2937]">
                  {key.includes("Total") || key === "transactionsCount"
                    ? currency(stats[key])
                    : stats[key]}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}
              >
                <Icon className="text-xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-[28px] p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-[#1F2937]">Clients</h2>
          <div className="flex w-full flex-col gap-3 md:max-w-xl md:flex-row md:items-center">
            <div className="relative w-full md:flex-1">
              <FiSearch className="pointer-events-none absolute left-3 top-3 text-[#64748B]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#F1E5EE] bg-[#FFF7FB] py-2.5 pl-9 pr-3 text-sm text-[#1F2937] outline-none focus:border-[#FF8FB3]"
                placeholder="Search by name or mobile"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {balanceFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                    filter === option.value
                      ? "bg-gradient-to-r from-[#FF8FB3] to-[#C9A7FF] text-white"
                      : "border border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(255,214,231,0.26),rgba(232,214,255,0.28))] text-[#64748B] hover:border-[#FF8FB3]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-16 animate-pulse rounded-2xl bg-[#FDF2F8]"
                />
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,214,231,0.18),rgba(232,214,255,0.2))] px-6 py-12 text-center">
              <div className="text-lg font-medium text-[#1F2937]">
                No clients found
              </div>
              <p className="mt-2 text-sm text-[#64748B]">
                Start managing your ledger by adding your first client
                transaction.
              </p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <Link
                key={client._id}
                to={`/clients/${client._id}`}
                className="flex items-center justify-between rounded-2xl border border-[#F1E5EE] bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,214,231,0.18),rgba(232,214,255,0.2))] p-4 transition hover:border-[#FF8FB3]/60 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,214,231,0.22),rgba(232,214,255,0.24))]"
              >
                <div>
                  <div className="font-medium text-[#1F2937]">
                    {client.name}
                  </div>
                  <div className="mt-1 text-sm text-[#64748B]">
                    {client.mobile}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${client.currentBalance >= 0 ? "text-[#84CC16]" : "text-[#F87171]"}`}
                  >
                    {currency(client.currentBalance)}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs text-[#64748B]">
                    <FiArrowUpRight />
                    {client.currentBalance >= 0
                      ? "Credit Balance"
                      : "Debit Balance"}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
