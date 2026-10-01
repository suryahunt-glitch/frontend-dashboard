import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import { TextInput } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      await forgotPassword(email);
      setMessage("Link reset password sudah dikirim. Periksa inbox atau folder spam Anda.");
    } catch (err) {
      const validationError = err.response?.data?.errors?.email?.[0];
      setError(validationError || "Email tidak ditemukan atau gagal mengirim link reset.");
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
          <p className="mt-2 text-sm text-sage-200">Pulihkan akses akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5 rounded-2xl border border-white/50 bg-white p-7 shadow-2xl">
          <div>
            <h1 className="font-display text-xl font-bold text-sage-900">Lupa password?</h1>
            <p className="mt-1 text-sm leading-6 text-ink-500">
              Masukkan email akun Anda. Kami akan mengirimkan link untuk membuat password baru.
            </p>
          </div>

          <TextInput
            label="Email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="brand" className="w-full" disabled={submitting}>
            {submitting ? "Mengirim..." : "Kirim Link Reset"}
          </Button>

          <p className="text-center text-sm text-ink-500">
            Ingat password?{" "}
            <Link to="/login" className="font-bold text-brand hover:underline">
              Kembali masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
