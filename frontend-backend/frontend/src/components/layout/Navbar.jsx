import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/produk?search=${encodeURIComponent(q)}`);
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="shrink-0 font-display text-xl font-bold tracking-tight text-sage-900">
          Marketplace<span className="text-brand">.</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 sm:block">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk..."
            className="w-full max-w-md rounded-full border border-sage-200 bg-sage-100/70 px-4 py-2.5 text-sm outline-none transition placeholder:text-ink-500 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm font-semibold text-ink-700">
          <Link to="/produk" className="hidden transition hover:text-brand sm:inline">
            Produk
          </Link>
          <Link to="/toko" className="hidden transition hover:text-brand sm:inline">
            Toko
          </Link>

          {user && (
            <>
              <Link to="/toko-saya" className="hidden transition hover:text-brand sm:inline">
                Toko Saya
              </Link>
              <Link to="/pesanan-saya" className="hidden transition hover:text-brand sm:inline">
                Pesanan Saya
              </Link>
            </>
          )}

          <Link to="/keranjang" className="relative flex items-center gap-1.5 hover:text-ink-900">
            <span className="text-lg">🛒</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white shadow-sm">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <button onClick={handleLogout} className="text-ink-500 transition hover:text-brand">
              Keluar
            </button>
          ) : (
            <Link to="/login" className="rounded-full bg-sage-900 px-4 py-2 text-white shadow-sm transition hover:bg-sage-700">
              Masuk
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
