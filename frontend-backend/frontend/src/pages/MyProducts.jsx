import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Button } from "../components/ui/Button";
import { ProductFormModal } from "../components/ui/ProductFormModal";
import { fetchMyStore } from "../api/stores";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { formatIDR } from "../utils/format";
import { resolveImageUrl } from "../utils/image";

function MyProductsContent() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const myStore = await fetchMyStore();
      setStore(myStore);
      if (myStore) {
        const { items } = await fetchProducts({ storeId: myStore.id });
        setProducts(items);
      }
    } catch {
      setError("Gagal memuat data toko/produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.sku || ""}`.toLowerCase().includes(q));
  }, [products, keyword]);

  const totalStock = useMemo(() => products.reduce((s, p) => s + (Number(p.stock) || 0), 0), [products]);

  async function handleSubmit(formData) {
    try {
      if (modalState.data?.id) {
        await updateProduct(modalState.data.id, formData);
        setNotice("Perubahan produk disimpan.");
      } else {
        await createProduct(formData);
        setNotice("Produk baru ditambahkan dengan foto Anda.");
      }
      setModalState(null);
      load();
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      throw err;
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteProduct(product.id);
      setNotice(`"${product.name}" dihapus.`);
      load();
      setTimeout(() => setNotice(""), 3500);
    } catch {
      setError("Gagal menghapus produk.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-[28px] bg-sage-100" />
        <div className="h-64 animate-pulse rounded-[24px] bg-sage-100" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="rounded-[28px] border border-dashed border-sage-200 bg-white p-10 text-center shadow-card">
        <div className="text-5xl">🏪</div>
        <h2 className="mt-3 font-display text-xl font-bold text-sage-900">Anda belum memiliki toko</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
          Buka toko dulu sebelum menambahkan produk dengan foto sendiri. Kelola produk cukup dari
          halaman ini — tanpa perlu masuk dashboard admin.
        </p>
        <Link to="/toko-saya">
          <Button variant="brand" className="mt-5">Buka Toko Sekarang</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 overflow-hidden rounded-[28px] border border-sage-200 bg-sage-900 p-5 text-white shadow-card sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Toko Saya • Kelola Produk</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{store.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1">{products.length} produk</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Total stok {totalStock}</span>
            </div>
          </div>
          <Button variant="brand" onClick={() => setModalState({ data: null })} className="shrink-0">
            ＋ Tambah Produk
          </Button>
        </div>
      </div>

      {notice && (
        <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>
      )}
      {error && (
        <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari produk saya..."
          className="w-full max-w-sm rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
        <span className="text-sm text-ink-500">{filtered.length} ditampilkan</span>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-sage-200 bg-white p-12 text-center shadow-card">
          <div className="text-5xl">🖼️</div>
          <p className="mt-3 font-bold text-sage-900">Belum ada produk</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
            Tambahkan produk pertama dengan foto sendiri (JPG/PNG/WebP, maks 2MB). Foto tampil
            otomatis di katalog, detail, dan keranjang.
          </p>
          <Button variant="brand" className="mt-5" onClick={() => setModalState({ data: null })}>
            Tambah Produk Pertama
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-sage-200 bg-white p-10 text-center text-sm text-ink-500">
          Tidak ada produk yang cocok dengan “{keyword}”.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-sage-200 bg-white shadow-card">
          <div className="hidden grid-cols-[1.6fr_0.8fr_0.6fr_0.9fr] gap-px bg-sage-200 md:grid">
            {["Produk", "Harga", "Stok", ""].map((h, i) => (
              <div key={i} className="bg-sage-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sage-700">{h}</div>
            ))}
          </div>
          {filtered.map((p) => {
            const img = resolveImageUrl(p.image_url);
            return (
              <Fragment key={p.id}>
                <div className="grid gap-3 border-b border-sage-100 bg-white px-4 py-4 md:grid-cols-[1.6fr_0.8fr_0.6fr_0.9fr] md:items-center md:gap-px">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sage-100 ring-1 ring-sage-200">
                      {img ? (
                        <img src={img} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xl">🛍️</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-sage-900">{p.name}</p>
                      <p className="mt-0.5 truncate text-xs text-ink-500">
                        {img ? "Ada foto" : "Belum ada foto"} {p.sku ? `• ${p.sku}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-sage-900">{formatIDR(p.price)}</div>
                  <div>
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${Number(p.stock) <= 0 ? "bg-slate-100 text-slate-500" : Number(p.stock) <= 5 ? "bg-amber-100 text-amber-800" : "bg-sage-100 text-sage-800"}`}>
                      {p.stock ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <button
                      onClick={() => setModalState({ data: p })}
                      className="rounded-xl border border-brand/20 bg-brand-light px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </Fragment>
            );
          })}
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
          <h1 className="mb-6 font-display text-xl font-bold text-sage-900">Kelola Produk Toko Saya</h1>
          <MyProductsContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
