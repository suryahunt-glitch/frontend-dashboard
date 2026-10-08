import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TextInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { toAuthMessage } from "../../api/auth";

// Pintu masuk khusus admin. Akun biasa ditolak walau password benar.
export default function AdminLogin() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user?.is_admin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email.trim()) return setError("Email wajib diisi.");
    if (!form.password) return setError("Password wajib diisi.");

    setSubmitting(true);
    try {
      const loggedIn = await login({ email: form.email.trim(), password: form.password });
      if (!loggedIn?.is_admin) {
        await logout();
        setError("Akun ini bukan admin. Halaman ini khusus akun admin.");
        return;
      }
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(toAuthMessage(err, "Email atau password salah."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sage-900 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-3xl font-bold text-white">
            KelontongKu<span className="text-brand">.</span>
          </div>
          <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            🔐 Login Admin
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="relative space-y-4 rounded-3xl bg-white p-7 shadow-2xl">
          <TextInput
            label="Email admin"
            type="email"
            autoComplete="username"
            placeholder="admin@kelontongku.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div>
            <TextInput
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password akun admin"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="mt-2 text-xs font-semibold text-sage-700 hover:underline"
            >
              {showPassword ? "Sembunyikan" : "Tampilkan"} password
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" variant="brand" className="w-full py-3" disabled={submitting}>
            {submitting ? "Memproses..." : "Masuk sebagai Admin"}
          </Button>

          <p className="text-center text-sm text-ink-500">
            Bukan admin?{" "}
            <Link to="/login" className="font-bold text-brand hover:underline">
              Login pengguna
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
