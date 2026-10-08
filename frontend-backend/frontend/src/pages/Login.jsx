import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TextInput } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { toAuthMessage } from "../api/auth";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errors = {};
    if (!form.email.trim()) errors.email = "Email wajib diisi.";
    else if (!isValidEmail(form.email)) errors.email = "Format email tidak valid.";
    if (!form.password) errors.password = "Password wajib diisi.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      const resErrors = err.response?.data?.errors;
      if (resErrors) {
        const mapped = {};
        for (const [key, val] of Object.entries(resErrors)) {
          mapped[key] = Array.isArray(val) ? val[0] : val;
        }
        setFieldErrors(mapped);
      }
      setError(toAuthMessage(err, "Email atau password salah. Coba lagi."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sage-900 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-sage-900 p-8 text-white md:flex">
          <div className="font-display text-2xl font-bold">
            KelontongKu<span className="text-brand">.</span>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">
              Warung digital tetangga Anda.
            </h2>
            <p className="mt-3 text-sm leading-6 text-sage-200">
              Masuk dengan akun dari admin untuk belanja sembako, mengelola
              toko kelontong, dan memantau pesanan dalam satu tempat.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-sage-100">
              <li>✓ Upload foto produk (JPG/PNG/WebP, maks 2MB)</li>
              <li>✓ Kelola stok & harga dari halaman Toko Saya</li>
              <li>✓ Checkout aman ke keranjang</li>
            </ul>
          </div>
          <p className="text-xs text-sage-200/70">Login aman dengan sesi terenkripsi Sanctum.</p>
        </div>

        <div className="p-7 sm:p-8">
          <div className="mb-6 md:hidden">
            <div className="font-display text-2xl font-bold text-sage-900">
              KelontongKu<span className="text-brand">.</span>
            </div>
            <p className="mt-1 text-sm text-ink-500">Masuk ke akun Anda</p>
          </div>

          <h1 className="hidden font-display text-2xl font-bold text-sage-900 md:block">
            Selamat datang kembali
          </h1>
          <p className="mt-1 hidden text-sm text-ink-500 md:block">
            Masukkan email dan password untuk lanjut.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
              value={form.email}
              error={fieldErrors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div>
              <TextInput
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password Anda"
                required
                value={form.password}
                error={fieldErrors.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="font-semibold text-sage-700 hover:underline"
                >
                  {showPassword ? "Sembunyikan" : "Tampilkan"} password
                </button>
                <Link to="/lupa-password" className="font-bold text-brand hover:underline">
                  Lupa password?
                </Link>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="h-4 w-4 rounded border-sage-200 accent-[#EA580C]"
              />
              Ingat saya di perangkat ini
            </label>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" variant="brand" className="w-full py-3" disabled={submitting}>
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </Button>

            <p className="text-center text-sm text-ink-500">
              Belum punya akun? Minta dibuatkan admin di dashboard.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
