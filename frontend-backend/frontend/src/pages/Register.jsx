import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TextInput } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const laravelErrors = err.response?.data?.errors;
      setError(
        laravelErrors
          ? Object.values(laravelErrors).flat().join(" ")
          : "Gagal mendaftar. Coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sage-900 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-3xl font-bold text-white">
            Marketplace<span className="text-brand">.</span>
          </div>
          <p className="mt-2 text-sm text-sage-200">Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4 rounded-2xl border border-white/50 bg-white p-7 shadow-2xl">
          <TextInput
            label="Nama Lengkap"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextInput
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextInput
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <TextInput
            label="Konfirmasi Password"
            type="password"
            required
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
          />

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" variant="brand" className="w-full" disabled={submitting}>
            {submitting ? "Memproses..." : "Daftar"}
          </Button>

          <p className="text-center text-sm text-ink-500">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-brand hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
