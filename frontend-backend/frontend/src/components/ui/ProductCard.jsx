import { Link } from "react-router-dom";
import { formatIDR } from "../../utils/format";
import { useCart } from "../../context/CartContext";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/produk/${product.id}`} className="relative block aspect-square overflow-hidden bg-ink-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-ink-200">
            🛍
          </div>
        )}

        {lowStock && (
          <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            Sisa {stock}
          </span>
        )}

        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink-900/80 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
            Stok Habis
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <Link to={`/produk/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-ink-900 hover:text-brand">
            {product.name}
          </h3>
        </Link>
        {product.store_name && (
          <Link
            to={`/toko/${product.store_id}`}
            className="text-xs text-ink-500 hover:text-brand"
          >
            {product.store_name}
          </Link>
        )}
        <p className="text-base font-bold text-ink-900">{formatIDR(product.price)}</p>
        <button
          onClick={() => addItem(product, 1)}
          disabled={outOfStock}
          className="mt-auto rounded-md border border-ink-900 py-1.5 text-xs font-semibold text-ink-900 transition hover:bg-ink-900 hover:text-white disabled:cursor-not-allowed disabled:border-ink-200 disabled:text-ink-500 disabled:hover:bg-transparent"
        >
          {outOfStock ? "Stok Habis" : "+ Keranjang"}
        </button>
      </div>
    </div>
  );
}
