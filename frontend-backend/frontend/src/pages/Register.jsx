import { Link } from "react-router-dom";

// Pendaftaran publik ditutup: akun hanya dibuat admin lewat dashboard (/admin → Users).
export default function Register() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sage-900 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <div className="font-display text-3xl font-bold text-white">
            KelontongKu<span className="text-brand">.</span>
          </div>
          <p className="mt-2 text-sm text-sage-200">Pendaftaran akun</p>
        </div>

        <div className="relative space-y-4 rounded-2xl border border-white/50 bg-white p-7 shadow-2xl">
          <div className="text-5xl">🏪</div>
          <h1 className="font-display text-xl font-bold text-sage-900">Daftar lewat admin</h1>
          <p className="text-sm leading-6 text-ink-500">
            Pendaftaran mandiri ditutup. Akun login dibuat oleh admin melalui
            dashboard (<span className="font-mono font-bold">/admin → Users</span>).
            Hubungi admin untuk dibuatkan akun, lalu masuk di bawah.
          </p>
          <Link
            to="/login"
            className="block w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
