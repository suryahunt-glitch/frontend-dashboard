import { Link } from "react-router-dom";
import { formatIDR } from "../../utils/format";
import { useCart } from "../../context/CartContext";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-sage-200/70 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(33,47,58,0.12)]">
      <Link to={`/produk/${product.id}`} className="relative block aspect-[4/4.2] overflow-hidden bg-gradient-to-br from-sage-100 via-white to-amber-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sage-100 to-sage-200 text-4xl text-sage-400">
            🛍
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          {lowStock && (
            <span className="rounded-full bg-amber-500/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-md">
              Sisa {stock}
            </span>
          )}
          {!lowStock && !outOfStock && (
            <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-sage-800 shadow-sm">
              Ready
            </span>
          )}
          {!lowStock && outOfStock && (
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-md">
              Sold out
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            Stok Habis
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <Link to={`/produk/${product.id}`}>
            <h3 className="line-clamp-2 text-sm font-bold text-sage-900 transition group-hover:text-brand">
              {product.name}
            </h3>
          </Link>
          {product.store_name && (
            <Link
              to={`/toko/${product.store_id}`}
              className="block text-xs text-ink-500 transition hover:text-brand"
            >
              {product.store_name}
            </Link>
          )}
        </div>

        <div className="mt-auto pt-1">
          <p className="text-lg font-black text-sage-900">{formatIDR(product.price)}</p>
          <button
            onClick={() => addItem(product, 1)}
            disabled={outOfStock}
            className="mt-3 w-full rounded-xl bg-sage-900 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-sage-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {outOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
          </button>
        </div>
      </div>
    </div>
  );
}
