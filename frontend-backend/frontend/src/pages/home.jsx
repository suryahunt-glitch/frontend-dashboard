import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProductCard } from "../components/ui/ProductCard";
import { fetchProducts } from "../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.slice(0, 8)))
      .catch(() => setError("Gagal memuat produk dari API."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-sage-900">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:grid-cols-2 sm:items-center sm:py-24">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Belanja lokal, tumbuh bersama
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
              Jual dan beli langsung antar pengguna.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-sage-100">
              Buka toko sendiri dan mulai jual produk, atau jelajahi ribuan
              toko lain di sini.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/produk"
                className="inline-block rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-brand-dark"
              >
                Jelajahi Produk
              </Link>
              <Link
                to="/toko-saya"
                className="inline-block rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Buka Toko
              </Link>
            </div>
          </div>

          <div className="hidden justify-self-end sm:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-5xl shadow-lg backdrop-blur">
                🛍️
              </div>
              <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-5xl shadow-lg backdrop-blur">
                🥬
              </div>
              <div className="-mt-8 flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-5xl shadow-lg backdrop-blur">
                👕
              </div>
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-5xl shadow-lg backdrop-blur">
                📦
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-sage-900">Produk Terbaru</h2>
          <Link to="/produk" className="text-sm font-bold text-brand transition hover:text-brand-dark">
            Lihat semua →
          </Link>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-ink-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ink-500">Belum ada produk. Jadilah yang pertama berjualan!</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
