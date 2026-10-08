import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ConnectionBlocked({ onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-900 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="text-5xl">🔌</div>
        <h1 className="mt-3 font-display text-xl font-bold text-sage-900">Server tidak terjangkau</h1>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          Tidak dapat menghubungi backend. Pastikan <b>MySQL</b> dan{" "}
          <b>php artisan serve</b> (port 8000) berjalan, lalu coba lagi.
        </p>
        <button
          onClick={onRetry}
          className="mt-5 w-full rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { user, loading, connectionError, refreshUser } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-ink-500">
        Memuat...
      </div>
    );
  }

  if (connectionError && !user) return <ConnectionBlocked onRetry={refreshUser} />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Khusus admin (user.is_admin). Belum login -> pintu admin, bukan-admin -> ditolak.
export function AdminRoute({ children }) {
  const { user, loading, connectionError, refreshUser } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-ink-500">
        Memuat...
      </div>
    );
  }

  if (connectionError && !user) return <ConnectionBlocked onRetry={refreshUser} />;
  if (!user || !user.is_admin) return <Navigate to="/admin/login" replace />;
  return children;
}
