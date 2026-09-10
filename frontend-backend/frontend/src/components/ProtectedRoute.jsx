import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-ink-500">
        Memuat...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
