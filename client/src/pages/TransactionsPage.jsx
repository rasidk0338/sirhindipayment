import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api/axios";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const removeTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      await api.delete(`/transactions/${id}`);
      loadTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
            Ledger
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Transaction history
          </h1>
        </div>
        <Link
          to="/transactions/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <FiPlus />
          Add Transaction
        </Link>
      </div>

      <div className="glass-panel table-scroll overflow-x-auto rounded-[28px] p-4">
        {loading ? (
          <div className="space-y-3 py-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-12 animate-pulse rounded-xl bg-slate-800/80"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-300">
            No transactions yet.
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-800 text-slate-100"
                >
                  <td className="px-4 py-3">
                    {item.clientId?.name || "Client"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(item.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td
                    className={`px-4 py-3 font-medium ${item.type === "Credit" ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {item.type}
                  </td>
                  <td className="px-4 py-3">{currency(item.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/transactions/${item._id}/edit`}
                        className="rounded-lg border border-slate-600 p-2 text-slate-200 hover:border-indigo-400 hover:text-indigo-300"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => removeTransaction(item._id)}
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
        )}
      </div>
    </div>
  );
}
