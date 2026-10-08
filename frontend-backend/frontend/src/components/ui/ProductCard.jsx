import { Link } from "react-router-dom";
import { formatIDR } from "../../utils/format";
import { resolveImageUrl } from "../../utils/image";
import { useCart } from "../../context/CartContext";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;
  const img = resolveImageUrl(product.image_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sage-200/70 bg-white shadow-[0_12px_32px_rgba(23,63,53,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(23,63,53,0.14)]">
      <Link
        to={`/produk/${product.id}`}
        className="relative block aspect-[4/3.4] overflow-hidden bg-gradient-to-br from-sage-100 via-white to-amber-50"
      >
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#EEF6F1,transparent),linear-gradient(135deg,#EEF6F1,#D6E7DF)] text-sage-700">
            <span className="text-5xl">🛍️</span>
            <span className="text-xs font-semibold">Tanpa foto</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] shadow-md ${
              outOfStock
                ? "bg-slate-900/85 text-white"
                : lowStock
                  ? "bg-amber-500 text-white"
                  : "bg-white/95 text-sage-900"
            }`}
          >
            {outOfStock ? "Sold out" : lowStock ? `Sisa ${stock}` : "Ready"}
          </span>
          {product.store_name && (
            <span className="max-w-[55%] truncate rounded-full bg-sage-900/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
              {product.store_name}
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Stok habis
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/produk/${product.id}`} className="line-clamp-2 min-h-[2.6rem] text-sm font-bold leading-snug text-sage-900 transition group-hover:text-brand">
          {product.name}
        </Link>
        {product.store_name && (
          <Link
            to={product.store_id ? `/toko/${product.store_id}` : "/toko"}
            className="mt-1 truncate text-xs text-ink-500 transition hover:text-brand"
          >
            {product.store_name}
          </Link>
        )}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Harga</p>
            <p className="text-lg font-black text-sage-900">{formatIDR(product.price)}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${outOfStock ? "bg-slate-100 text-slate-500" : "bg-sage-100 text-sage-700"}`}>
            Stok {stock}
          </span>
        </div>

        <button
          onClick={() => !outOfStock && addItem(product, 1)}
          disabled={outOfStock}
          className="mt-4 w-full rounded-2xl bg-sage-900 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-sage-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {outOfStock ? "Stok Habis" : "＋ Keranjang"}
        </button>
      </div>
    </article>
  );
}
