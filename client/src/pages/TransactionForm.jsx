import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

const initialState = {
  clientName: "",
  mobile: "",
  description: "",
  type: "Credit",
  amount: "",
  transactionDate: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [clientSuggestions, setClientSuggestions] = useState([]);

  useEffect(() => {
    const prefillClient = async () => {
      const clientId = searchParams.get("clientId");
      if (!clientId) return;

      try {
        const { data } = await api.get(`/clients/${clientId}`);
        setForm((prev) => ({
          ...prev,
          clientName: data.name || "",
          mobile: data.mobile || "",
        }));
      } catch (error) {
        toast.error("Unable to load client information");
      }
    };

    if (!id) {
      prefillClient();
    }

    const fetchTransaction = async () => {
      if (!id) return;

      try {
        const { data } = await api.get(`/transactions/${id}`);
        setForm({
          clientName: data.clientId?.name || "",
          mobile: data.clientId?.mobile || "",
          description: data.description,
          type: data.type,
          amount: String(data.amount),
          transactionDate: new Date(data.transactionDate)
            .toISOString()
            .slice(0, 10),
        });
      } catch (error) {
        toast.error("Unable to load this transaction");
      }
    };

    fetchTransaction();
  }, [id, searchParams]);

  useEffect(() => {
    const query = form.clientName.trim();

    if (!query) {
      setClientSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/clients/search", {
          params: { q: query, filter: "all" },
        });
        setClientSuggestions(data.slice(0, 5));
      } catch (error) {
        setClientSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [form.clientName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/transactions/${id}`, form);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", form);
        toast.success("Transaction added");
      }
      navigate("/transactions");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-6">
      <div className="glass-panel rounded-[30px] p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
            Quick entry
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            {id ? "Edit transaction" : "Add transaction"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="relative md:col-span-1">
            <label className="mb-2 block text-sm text-slate-200">
              Client Name
            </label>
            <input
              type="text"
              required
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />

            {clientSuggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-xl">
                {clientSuggestions.map((client) => (
                  <button
                    key={client._id}
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        clientName: client.name,
                        mobile: client.mobile,
                      });
                      setClientSuggestions([]);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    <span>{client.name}</span>
                    <span className="text-slate-400">{client.mobile}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <label className="mb-2 block text-sm text-slate-200">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-200">
              Description
            </label>
            <textarea
              rows="4"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">
              Transaction Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400"
            >
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-200">
              Transaction Date
            </label>
            <input
              type="date"
              value={form.transactionDate}
              onChange={(e) =>
                setForm({ ...form, transactionDate: e.target.value })
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-70"
            >
              {loading
                ? "Saving..."
                : id
                  ? "Update Transaction"
                  : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
