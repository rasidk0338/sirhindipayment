import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import ClientDetail from "./pages/ClientDetail";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionForm from "./pages/TransactionForm";
import Profile from "./pages/Profile";
import BrandLogo from "./components/BrandLogo";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-gradient text-[#1F2937]">
        <div className="rounded-2xl border border-[#F1E5EE] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <BrandLogo className="h-20 w-48" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/new" element={<TransactionForm />} />
            <Route
              path="/transactions/:id/edit"
              element={<TransactionForm />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/settings"
              element={
                <div className="glass-panel mx-auto max-w-xl rounded-[28px] p-8 text-center text-[#1F2937]">
                  Settings coming soon.
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>

      <ToastContainer position="top-right" autoClose={2500} theme="light" />
    </>
  );
}

export default App;
