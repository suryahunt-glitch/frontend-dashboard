import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProductCard } from "../components/ui/ProductCard";
import { fetchProducts } from "../api/products";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProducts({ search })
      .then(setProducts)
      .catch(() => setError("Gagal memuat produk dari API."))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-7 overflow-hidden rounded-[28px] border border-sage-200 bg-gradient-to-r from-sage-900 via-sage-800 to-emerald-900 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-200">Marketplace</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-white">
                {search ? `Hasil untuk "${search}"` : "Semua Produk"}
              </h1>
            </div>

            <div className="w-full max-w-md rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-sm">
              <input
                type="text"
                defaultValue={search}
                placeholder="Cari produk..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchParams(e.target.value ? { search: e.target.value } : {});
                  }
                }}
                className="w-full bg-transparent text-sm text-white placeholder:text-sage-200 outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[320px] animate-pulse rounded-[22px] bg-sage-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-sage-200 bg-white p-12 text-center text-sm text-ink-500 shadow-card">
            Tidak ada produk yang cocok.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
