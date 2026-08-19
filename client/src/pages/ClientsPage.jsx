import { useEffect, useState } from "react";
import { FiEdit2, FiEye, FiTrash2, FiUsers, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api/axios";

const balanceFilterOptions = [
  { label: "All", value: "all" },
  { label: "Credit", value: "credit" },
  { label: "Debit", value: "debit" },
  { label: "Settled", value: "settled" },
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      const { data } = await api.get("/clients");
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const removeClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await api.delete(`/clients/${id}`);
      loadClients();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredClients = clients.filter((client) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      client.name.toLowerCase().includes(q) ||
      client.mobile.toLowerCase().includes(q);
    const matchesFilter =
      filter === "all" ||
      (filter === "credit" && client.currentBalance > 0) ||
      (filter === "debit" && client.currentBalance < 0) ||
      (filter === "settled" && client.currentBalance === 0);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
            Customers
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Client directory
          </h1>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          {clients.length} total clients
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-[28px] p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-400"
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
                    ? "bg-indigo-500 text-white"
                    : "border border-slate-600 bg-slate-950/70 text-slate-300 hover:border-indigo-400"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-14 animate-pulse rounded-xl bg-slate-800/80"
              />
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-indigo-500/10 p-4 text-indigo-300">
              <FiUsers className="text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              No clients yet
            </h2>
            <p className="mt-2 max-w-md text-slate-400">
              Start managing your ledger by adding your first client
              transaction.
            </p>
          </div>
        ) : (
          <div className="table-scroll overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-950/60 text-slate-300">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Credit</th>
                  <th className="px-5 py-4">Debit</th>
                  <th className="px-5 py-4">Balance</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="border-b border-slate-800 text-slate-100"
                  >
                    <td className="px-5 py-4 font-medium">{client.name}</td>
                    <td className="px-5 py-4">{client.mobile}</td>
                    <td className="px-5 py-4 text-emerald-400">
                      {currency(client.totalCredit || 0)}
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      {currency(client.totalDebit || 0)}
                    </td>
                    <td
                      className={`px-5 py-4 font-semibold ${client.currentBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {currency(client.currentBalance || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/clients/${client._id}`}
                          className="rounded-lg border border-slate-600 p-2 text-slate-200 hover:border-indigo-400 hover:text-indigo-300"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/clients/${client._id}/edit`}
                          className="rounded-lg border border-slate-600 p-2 text-slate-200 hover:border-indigo-400 hover:text-indigo-300"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => removeClient(client._id)}
                          className="rounded-lg border border-slate-600 p-2 text-slate-200 hover:border-red-400 hover:text-red-300"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
