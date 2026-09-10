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
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="shrink-0 text-lg font-extrabold tracking-tight text-ink-900">
          Marketplace<span className="text-brand">.</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 sm:block">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk..."
            className="w-full max-w-md rounded-full border border-ink-200 bg-ink-100 px-4 py-2 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
          />
        </form>

        <nav className="ml-auto flex items-center gap-5 text-sm font-medium text-ink-700">
          <Link to="/produk" className="hidden hover:text-ink-900 sm:inline">
            Produk
          </Link>
          <Link to="/toko" className="hidden hover:text-ink-900 sm:inline">
            Toko
          </Link>

          {user && (
            <>
              <Link to="/toko-saya" className="hidden hover:text-ink-900 sm:inline">
                Toko Saya
              </Link>
              <Link to="/pesanan-saya" className="hidden hover:text-ink-900 sm:inline">
                Pesanan Saya
              </Link>
            </>
          )}

          <Link to="/keranjang" className="relative flex items-center gap-1.5 hover:text-ink-900">
            <span className="text-lg">🛒</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <button onClick={handleLogout} className="text-ink-500 hover:text-ink-900">
              Keluar
            </button>
          ) : (
            <Link to="/login" className="rounded-md bg-ink-900 px-3.5 py-1.5 text-white hover:bg-black">
              Masuk
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
