import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Button } from "../components/ui/Button";
import { ProductFormModal } from "../components/ui/ProductFormModal";
import { fetchMyStore } from "../api/stores";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { formatIDR } from "../utils/format";

function MyProductsContent() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const myStore = await fetchMyStore();
      setStore(myStore);
      if (myStore) {
        const items = await fetchProducts({ storeId: myStore.id });
        setProducts(items);
      }
    } catch {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(formData) {
    if (modalState.data?.id) {
      await updateProduct(modalState.data.id, formData);
    } else {
      formData.append("store_id", store.id);
      await createProduct(formData);
    }
    setModalState(null);
    load();
  }

  async function handleDelete(product) {
    if (!confirm(`Hapus produk "${product.name}"?`)) return;
    await deleteProduct(product.id);
    load();
  }

  if (loading) return <p className="text-sm text-ink-500">Memuat...</p>;

  if (!store) {
    return (
      <div className="rounded-lg border border-dashed border-ink-200 bg-white p-8 text-center">
        <p className="text-sm text-ink-500">
          Anda belum memiliki toko. Buka toko dulu sebelum menambahkan produk.
        </p>
        <Link to="/toko-saya">
          <Button variant="brand" className="mt-4">
            Buka Toko
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-500">
          Produk untuk toko <span className="font-medium text-ink-900">{store.name}</span>
        </p>
        <Button variant="brand" onClick={() => setModalState({ data: null })}>
          + Tambah Produk
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>
      )}

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-500">
          Belum ada produk. Tambahkan produk pertama Anda.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-100">
                <th className="px-4 py-3 font-medium text-ink-700">Produk</th>
                <th className="px-4 py-3 font-medium text-ink-700">Harga</th>
                <th className="px-4 py-3 font-medium text-ink-700">Stok</th>
                <th className="px-4 py-3 text-right font-medium text-ink-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-ink-200 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink-100">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-ink-200">🛍</span>
                        )}
                      </div>
                      <span className="font-medium text-ink-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatIDR(p.price)}</td>
                  <td className="px-4 py-3">{p.stock ?? "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setModalState({ data: p })}
                      className="mr-3 text-xs font-medium text-brand hover:underline"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalState && (
        <ProductFormModal
          initialData={modalState.data}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default function MyProducts() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="mb-6 text-xl font-bold text-ink-900">Kelola Produk</h1>
          <MyProductsContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
