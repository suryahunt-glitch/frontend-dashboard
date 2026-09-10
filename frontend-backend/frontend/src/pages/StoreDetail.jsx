import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProductCard } from "../components/ui/ProductCard";
import { fetchStore } from "../api/stores";
import { fetchProducts } from "../api/products";

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStore(id), fetchProducts({ storeId: id })])
      .then(([storeData, productData]) => {
        setStore(storeData);
        setProducts(productData);
      })
      .catch(() => setError("Toko tidak ditemukan atau gagal dimuat."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <p className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-500">Memuat toko...</p>
      </SiteLayout>
    );
  }

  if (error || !store) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm text-red-600">{error || "Toko tidak ditemukan."}</p>
          <Link to="/toko" className="mt-3 inline-block text-sm text-brand hover:underline">
            ← Kembali ke daftar toko
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="border-b border-ink-200 bg-ink-100">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold text-ink-900">{store.name}</h1>
          {store.address && <p className="mt-1 text-sm text-ink-500">{store.address}</p>}
          {store.phone && <p className="mt-1 text-sm text-ink-500">{store.phone}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-lg font-semibold text-ink-900">Produk dari toko ini</h2>
        {products.length === 0 ? (
          <p className="text-sm text-ink-500">Toko ini belum menambahkan produk.</p>
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
