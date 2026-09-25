import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { formatIDR } from "../utils/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="text-5xl">🛒</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-sage-900">Keranjang Anda kosong</h1>
          <p className="mt-1 text-sm text-ink-500">Yuk mulai belanja produk favorit Anda.</p>
          <Link to="/produk">
            <Button variant="brand" className="mt-5">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Ringkasan belanja</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-sage-900">Keranjang Belanja</h1>
          <p className="mt-2 text-sm text-ink-500">Periksa kembali produk sebelum melanjutkan pembayaran.</p>
        </div>

        <div className="divide-y divide-sage-200 overflow-hidden rounded-2xl border border-sage-200 bg-white shadow-card">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sage-100">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl text-ink-200">
                    🛍
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Link to={`/produk/${product.id}`} className="text-sm font-bold text-sage-900 hover:text-brand">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-sage-900">{formatIDR(product.price)}</p>
              </div>

                <div className="flex items-center rounded-lg border border-sage-200">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-2.5 py-1.5 text-sage-700 hover:bg-sage-100"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-2.5 py-1.5 text-sage-700 hover:bg-sage-100"
                >
                  +
                </button>
              </div>

              <p className="w-28 text-right text-sm font-bold text-sage-900">
                {formatIDR(product.price * quantity)}
              </p>

              <button
                onClick={() => removeItem(product.id)}
                className="text-sm text-ink-500 hover:text-red-600"
                aria-label="Hapus dari keranjang"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-sage-200 bg-sage-100 p-5">
          <span className="text-sm font-bold text-sage-700">Total Belanja</span>
          <span className="font-display text-2xl font-bold text-sage-900">{formatIDR(total)}</span>
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="brand" onClick={() => navigate("/checkout")}>
            Lanjut ke Checkout
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
