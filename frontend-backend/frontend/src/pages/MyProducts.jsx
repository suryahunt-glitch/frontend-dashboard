import { Fragment, useEffect, useState, useCallback } from "react";
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
      <div className="mb-6 rounded-[28px] border border-sage-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Toko Saya</p>
            <h2 className="mt-2 text-2xl font-bold text-sage-900">{store.name}</h2>
          </div>
          <Button variant="brand" onClick={() => setModalState({ data: null })}>
            + Tambah Produk
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
      )}

      {products.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-sage-200 bg-white p-12 text-center shadow-card">
          <p className="text-sm text-ink-500">Belum ada produk. Tambahkan produk pertama Anda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-sage-200 bg-white shadow-card">
          <div className="grid gap-px bg-sage-200 md:grid-cols-[1.5fr_0.8fr_0.7fr_0.9fr]">
            <div className="bg-sage-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sage-700">Produk</div>
            <div className="bg-sage-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sage-700">Harga</div>
            <div className="bg-sage-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sage-700">Stok</div>
            <div className="bg-sage-100 px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-sage-700">Aksi</div>

            {products.map((p) => (
              <Fragment key={p.id}>
                <div className="bg-white px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sage-100 ring-1 ring-sage-200">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-lg text-sage-400">🛍</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-sage-900">{p.name}</p>
                      <p className="mt-1 text-[11px] text-ink-500">Produk aktif</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center bg-white px-4 py-4 text-sm font-semibold text-sage-900">
                  {formatIDR(p.price)}
                </div>
                <div className="flex items-center bg-white px-4 py-4 text-sm text-sage-800">
                  {p.stock ?? "-"}
                </div>
                <div className="flex items-center justify-end gap-2 bg-white px-4 py-4">
                  <button
                    onClick={() => setModalState({ data: p })}
                    className="rounded-md border border-brand/20 bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </Fragment>
            ))}
          </div>
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
