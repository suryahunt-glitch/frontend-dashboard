import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/ui/ProductCard";
import { fetchProduct, fetchProducts } from "../api/products";
import { formatIDR } from "../utils/format";
import { resolveImageUrl } from "../utils/image";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setAdded(false);
    setError("");
    setQty(1);
    fetchProduct(id)
      .then((p) => {
        if (!alive) return;
        setProduct(p);
        if (p?.store_id) {
          fetchProducts({ storeId: p.store_id })
            .then(({ items }) => {
              if (alive) setRelated(items.filter((x) => String(x.id) !== String(id)).slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(() => alive && setError("Produk tidak ditemukan atau gagal dimuat."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl animate-pulse px-4 py-8">
          <div className="h-4 w-48 rounded bg-sage-100" />
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div className="aspect-square rounded-[28px] bg-sage-100" />
            <div className="space-y-3">
              <div className="h-8 rounded bg-sage-100" />
              <div className="h-6 w-1/2 rounded bg-sage-100" />
              <div className="h-24 rounded bg-sage-100" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-bold text-red-700">{error || "Produk tidak ditemukan."}</p>
            <Link to="/produk" className="mt-4 inline-block rounded-xl bg-sage-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-sage-700">
              ← Kembali ke daftar produk
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const img = resolveImageUrl(product.image_url);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          <Link to="/" className="hover:text-brand">Beranda</Link>
          <span>/</span>
          <Link to="/produk" className="hover:text-brand">Produk</Link>
          <span>/</span>
          <span className="max-w-[40ch] truncate font-semibold text-sage-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 rounded-[28px] border border-sage-200 bg-white p-5 shadow-card sm:grid-cols-2 sm:p-7">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-gradient-to-br from-sage-100 via-white to-amber-50 ring-1 ring-sage-100">
              {img ? (
                <img src={img} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sage-400">
                  <span className="text-7xl">🛍️</span>
                  <span className="text-sm font-semibold">Penjual belum mengunggah foto</span>
                </div>
              )}
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow ${outOfStock ? "bg-slate-900 text-white" : stock <= 5 ? "bg-amber-500 text-white" : "bg-white/95 text-sage-900"}`}>
                {outOfStock ? "Stok habis" : stock <= 5 ? `Sisa ${stock}` : "Ready"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Stok", value: String(stock) },
                { label: "Berat", value: product.weight ? `${product.weight} g` : "—" },
                { label: "SKU", value: product.sku || "—" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-sage-100 bg-sage-100/50 px-2 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{s.label}</p>
                  <p className="mt-1 truncate text-sm font-bold text-sage-900">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {product.store_name && (
              <Link
                to={product.store_id ? `/toko/${product.store_id}` : "/toko"}
                className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-sage-800 transition hover:bg-sage-200"
              >
                🏪 {product.store_name}
              </Link>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-sage-900">{product.name}</h1>
            <p className="mt-3 text-4xl font-black tracking-tight text-sage-900">
              {formatIDR(product.price)}
            </p>
            <p className={`mt-2 text-sm font-semibold ${outOfStock ? "text-red-600" : "text-sage-700"}`}>
              {outOfStock ? "Maaf, stok sedang habis." : `Stok tersedia: ${stock}`}
            </p>

            {product.description ? (
              <div className="mt-5 rounded-2xl border border-sage-100 bg-[#FBFDFB] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-sage-700">Deskripsi</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                  {product.description}
                </p>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-sage-200 bg-white p-4 text-sm text-ink-500">
                Penjual belum menambahkan deskripsi untuk produk ini.
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-2xl border border-sage-200 bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-lg font-bold text-sage-800 hover:bg-sage-100 rounded-l-2xl"
                  aria-label="Kurangi"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
                  className="px-4 py-3 text-lg font-bold text-sage-800 hover:bg-sage-100 rounded-r-2xl"
                  aria-label="Tambah"
                >
                  +
                </button>
              </div>

              <Button
                variant="brand"
                className="flex-1 py-3.5"
                disabled={outOfStock}
                onClick={() => {
                  addItem(product, qty);
                  setAdded(true);
                }}
              >
                {outOfStock ? "Stok Habis" : `Tambah ${qty} ke Keranjang`}
              </Button>
            </div>

            {added && (
              <p className="mt-3 rounded-xl bg-sage-100 px-3 py-2 text-sm font-semibold text-sage-800">
                ✓ Ditambahkan ke keranjang.{" "}
                <Link to="/keranjang" className="text-brand underline">
                  Lihat keranjang
                </Link>
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <Link to="/produk" className="rounded-xl border border-sage-200 px-4 py-2 text-sm font-semibold text-sage-800 hover:bg-sage-100">
                ← Semua produk
              </Link>
              {product.store_id && (
                <Link to={`/toko/${product.store_id}`} className="rounded-xl border border-sage-200 px-4 py-2 text-sm font-semibold text-sage-800 hover:bg-sage-100">
                  Kunjungi toko
                </Link>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-xl font-bold text-sage-900">Produk lain dari toko ini</h2>
              {product.store_id && (
                <Link to={`/toko/${product.store_id}`} className="text-sm font-bold text-brand hover:underline">
                  Lihat toko →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
