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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-ink-900">
            {search ? `Hasil untuk "${search}"` : "Semua Produk"}
          </h1>
          <input
            type="text"
            defaultValue={search}
            placeholder="Cari produk..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }
            }}
            className="w-full max-w-xs rounded-full border border-ink-200 bg-ink-100 px-4 py-2 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 sm:w-auto"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-ink-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ink-500">Tidak ada produk yang cocok.</p>
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
