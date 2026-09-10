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
      <section className="bg-ink-900">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Jual dan beli langsung antar pengguna.
            </h1>
            <p className="mt-3 max-w-md text-ink-200">
              Buka toko sendiri dan mulai jual produk, atau jelajahi ribuan
              toko lain di sini.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/produk"
                className="inline-block rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Jelajahi Produk
              </Link>
              <Link
                to="/toko-saya"
                className="inline-block rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Buka Toko
              </Link>
            </div>
          </div>
          <div className="hidden justify-self-end text-8xl sm:block">🛍️</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-900">Produk Terbaru</h2>
          <Link to="/produk" className="text-sm font-medium text-brand hover:underline">
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
