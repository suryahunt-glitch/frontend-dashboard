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
    <div className="flex min-h-screen items-center justify-center bg-ink-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-2xl font-extrabold text-ink-900">
            Marketplace<span className="text-brand">.</span>
          </div>
          <p className="mt-1 text-sm text-ink-500">Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-card">
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
