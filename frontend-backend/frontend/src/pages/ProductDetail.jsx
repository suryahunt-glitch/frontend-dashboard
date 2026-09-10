import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { Button } from "../components/ui/Button";
import { fetchProduct } from "../api/products";
import { formatIDR } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError("Produk tidak ditemukan atau gagal dimuat."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <p className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-500">Memuat produk...</p>
      </SiteLayout>
    );
  }

  if (error || !product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm text-red-600">{error || "Produk tidak ditemukan."}</p>
          <Link to="/produk" className="mt-3 inline-block text-sm text-brand hover:underline">
            ← Kembali ke daftar produk
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const outOfStock = Number(product.stock) <= 0;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-ink-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl text-ink-200">
                🛍
              </div>
            )}
          </div>

          <div>
            {product.store_name && (
              <Link
                to={`/toko/${product.store_id}`}
                className="text-sm font-medium text-brand hover:underline"
              >
                {product.store_name}
              </Link>
            )}
            <h1 className="mt-1 text-2xl font-bold text-ink-900">{product.name}</h1>
            {product.sku && <p className="mt-1 text-xs text-ink-500">SKU: {product.sku}</p>}
            <p className="mt-4 text-3xl font-extrabold text-ink-900">
              {formatIDR(product.price)}
            </p>

            <p className="mt-2 text-sm text-ink-500">
              {outOfStock ? "Stok habis" : `Stok tersedia: ${product.stock ?? "-"}`}
            </p>

            {product.description && (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {product.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-ink-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-ink-700 hover:bg-ink-100"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 text-ink-700 hover:bg-ink-100"
                >
                  +
                </button>
              </div>

              <Button
                variant="brand"
                disabled={outOfStock}
                onClick={() => {
                  addItem(product, qty);
                  setAdded(true);
                }}
              >
                {outOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
              </Button>
            </div>

            {added && (
              <p className="mt-3 text-sm text-accent">
                Ditambahkan ke keranjang.{" "}
                <Link to="/keranjang" className="font-medium underline">
                  Lihat keranjang
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
