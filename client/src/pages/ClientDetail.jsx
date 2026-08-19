import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { FiDownload, FiPlus } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const pdfCurrency = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data } = await api.get(`/clients/${id}`);
        setClient(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const downloadTransactionsPdf = () => {
    const document = new jsPDF();
    const transactions = client.transactions || [];
    const pageWidth = document.internal.pageSize.getWidth();
    const pageHeight = document.internal.pageSize.getHeight();
    const leftMargin = 16;
    let y = 20;

    const addPageFooter = () => {
      document.setFontSize(9);
      document.setTextColor(120);
      document.text(
        `Page ${document.internal.getNumberOfPages()}`,
        pageWidth - 16,
        pageHeight - 10,
        { align: "right" },
      );
    };

    const addTableHeader = () => {
      document.setFillColor(30, 41, 59);
      document.rect(leftMargin, y - 5, pageWidth - 32, 9, "F");
      document.setFontSize(9);
      document.setTextColor(255);
      document.text("Date", leftMargin + 3, y + 1);
      document.text("Description", leftMargin + 29, y + 1);
      document.text("Type", pageWidth - 65, y + 1);
      document.text("Amount", pageWidth - 37, y + 1);
      y += 10;
    };

    document.setFontSize(20);
    document.setTextColor(15, 23, 42);
    document.text("Transaction History", leftMargin, y);
    y += 10;
    document.setFontSize(12);
    document.text(client.name, leftMargin, y);
    document.setFontSize(10);
    document.setTextColor(80);
    document.text(`Mobile: ${client.mobile}`, leftMargin, y + 6);
    document.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth - 16,
      y + 6,
      { align: "right" },
    );
    y += 20;

    document.setTextColor(15, 23, 42);
    document.setFontSize(10);
    document.text(
      `Total Credit: ${pdfCurrency(client.totalCredit)}`,
      leftMargin,
      y,
    );
    document.text(
      `Total Debit: ${pdfCurrency(client.totalDebit)}`,
      leftMargin + 62,
      y,
    );
    document.text(
      `Balance: ${pdfCurrency(client.currentBalance)}`,
      leftMargin + 124,
      y,
    );
    y += 12;
    addTableHeader();

    transactions.forEach((transaction) => {
      const descriptionLines = document.splitTextToSize(
        transaction.description,
        74,
      );
      if (y + Math.max(10, descriptionLines.length * 5) > pageHeight - 18) {
        addPageFooter();
        document.addPage();
        y = 20;
        addTableHeader();
      }

      document.setFontSize(9);
      document.setTextColor(45);
      document.text(
        new Date(transaction.transactionDate).toLocaleDateString(),
        leftMargin + 3,
        y,
      );
      document.text(descriptionLines, leftMargin + 29, y);
      document.setTextColor(
        transaction.type === "Credit" ? 22 : 190,
        transaction.type === "Credit" ? 130 : 45,
        70,
      );
      document.text(transaction.type, pageWidth - 65, y);
      document.text(pdfCurrency(transaction.amount), pageWidth - 37, y);
      document.setDrawColor(220);
      document.line(
        leftMargin,
        y + descriptionLines.length * 5 + 2,
        pageWidth - 16,
        y + descriptionLines.length * 5 + 2,
      );
      y += Math.max(10, descriptionLines.length * 5 + 5);
    });

    addPageFooter();
    const safeClientName = client.name
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "");
    document.save(`${safeClientName || "client"}-transactions.pdf`);
  };

  if (loading) {
    return <div className="p-6 text-slate-200">Loading client details...</div>;
  }

  if (!client) {
    return <div className="p-6 text-slate-200">Client not found.</div>;
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
              Client profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              {client.name}
            </h1>
            <p className="mt-2 text-slate-300">{client.mobile}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadTransactionsPdf}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-100 hover:border-cyan-400 hover:text-cyan-300"
              title="Download transaction history as PDF"
            >
              <FiDownload />
              Download PDF
            </button>
            <Link
              to={`/transactions/new?clientId=${client._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
            >
              <FiPlus />
              Add Transaction
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-card p-5">
          <div className="text-sm text-slate-300">Total Credit</div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            {currency(client.totalCredit || 0)}
          </div>
        </div>
        <div className="metric-card p-5">
          <div className="text-sm text-slate-300">Total Debit</div>
          <div className="mt-2 text-2xl font-bold text-rose-400">
            {currency(client.totalDebit || 0)}
          </div>
        </div>
        <div className="metric-card p-5">
          <div className="text-sm text-slate-300">Current Balance</div>
          <div
            className={`mt-2 text-2xl font-bold ${client.currentBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
          >
            {currency(client.currentBalance || 0)}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[28px] p-5">
        <h2 className="mb-5 text-xl font-semibold text-white">
          Transaction history
        </h2>
        <div className="space-y-3">
          {client.transactions?.length ? (
            client.transactions.map((tx) => (
              <div
                key={tx._id}
                className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium text-white">
                      {tx.description}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-emerald-400">
                      {tx.type === "Credit" ? currency(tx.amount) : "₹0"}
                    </span>
                    <span className="text-rose-400">
                      {tx.type === "Debit" ? currency(tx.amount) : "₹0"}
                    </span>
                    <span className="font-medium text-slate-200">
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-950/40 p-8 text-center text-slate-400">
              No transactions for this client yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
