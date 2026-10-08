import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProductCard } from "../components/ui/ProductCard";
import { fetchProducts } from "../api/products";

const SORTS = [
  { id: "newest", label: "Terbaru" },
  { id: "price-asc", label: "Harga termurah" },
  { id: "price-desc", label: "Harga termahal" },
  { id: "name", label: "Nama A–Z" },
  { id: "stock", label: "Stok terbanyak" },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [keyword, setKeyword] = useState(urlSearch);
  const [sort, setSort] = useState("newest");
  const [onlyReady, setOnlyReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => setKeyword(urlSearch), [urlSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const t = setTimeout(() => {
      fetchProducts({ search: urlSearch })
        .then(({ items }) => {
          if (!cancelled) setProducts(items);
        })
        .catch(() => !cancelled && setError("Gagal memuat produk dari API. Periksa koneksi atau backend Laravel."))
        .finally(() => !cancelled && setLoading(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [urlSearch]);

  const visible = useMemo(() => {
    let list = [...products];
    if (onlyReady) list = list.filter((p) => Number(p.stock) > 0);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name": list.sort((a, b) => String(a.name).localeCompare(String(b.name))); break;
      case "stock": list.sort((a, b) => b.stock - a.stock); break;
      default: break;
    }
    return list;
  }, [products, sort, onlyReady]);

  function submitSearch(e) {
    e.preventDefault();
    setSearchParams(keyword.trim() ? { search: keyword.trim() } : {});
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="relative overflow-hidden rounded-[28px] border border-sage-200 bg-sage-900 p-6 text-white shadow-[0_18px_45px_rgba(23,63,53,0.25)] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Toko Kelontong</p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
                {urlSearch ? `Hasil untuk “${urlSearch}”` : "Jelajahi Semua Produk"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-sage-100">
                {products.length > 0
                  ? `${products.length} produk ditemukan. Foto produk diunggah langsung oleh pemilik toko.`
                  : "Cari produk lokal dari berbagai toko. Gunakan pencarian dan filter di bawah."}
              </p>
            </div>

            <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-1 backdrop-blur-sm focus-within:border-white/40">
                <span aria-hidden>🔍</span>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Cari nama produk atau deskripsi... (Enter)"
                  className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-sage-200"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => { setKeyword(""); setSearchParams({}); }}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs hover:bg-white/20"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                Cari
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-sage-900">Urutkan:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sage-200 bg-white px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={onlyReady}
              onChange={(e) => setOnlyReady(e.target.checked)}
              className="h-4 w-4 accent-[#EA580C]"
            />
            Hanya stok tersedia
          </label>
          <span className="ml-auto text-sm text-ink-500">{visible.length} produk</span>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </p>
        )}

        <div className="mt-5">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-sage-100 bg-white">
                  <div className="aspect-[4/3.4] animate-pulse bg-sage-100" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 animate-pulse rounded bg-sage-100" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-sage-100" />
                    <div className="h-9 animate-pulse rounded-2xl bg-sage-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-sage-200 bg-white p-12 text-center shadow-card">
              <div className="text-5xl">📦</div>
              <p className="mt-3 font-bold text-sage-900">Tidak ada produk yang cocok</p>
              <p className="mt-1 text-sm text-ink-500">
                Coba kata kunci lain atau matikan filter stok.
              </p>
              {(urlSearch || onlyReady) && (
                <button
                  onClick={() => { setKeyword(""); setSearchParams({}); setOnlyReady(false); }}
                  className="mt-4 rounded-xl bg-sage-900 px-4 py-2 text-sm font-bold text-white hover:bg-sage-700"
                >
                  Reset filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
