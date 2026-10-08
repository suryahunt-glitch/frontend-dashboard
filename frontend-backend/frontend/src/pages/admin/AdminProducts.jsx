import { useCallback, useEffect, useState } from "react";
import { fetchAdminProducts, deleteAdminProduct } from "../../api/admin";
import { formatIDR } from "../../utils/format";
import { resolveImageUrl } from "../../utils/image";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { items } = await fetchAdminProducts({ search: keyword });
      setItems(items);
    } catch {
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const t = setTimeout(load, keyword ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, keyword]);

  async function handleDelete(p) {
    if (!confirm(`Hapus produk "${p.name}" milik ${p.store_name || "toko"}?`)) return;
    try {
      await deleteAdminProduct(p.id);
      setNotice(`"${p.name}" dihapus.`);
      load();
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Gagal menghapus produk.");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          onSubmit={(e) => { e.preventDefault(); setKeyword(search); }}
          className="flex w-full max-w-sm gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button type="submit" className="rounded-2xl bg-sage-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-sage-700">
            Cari
          </button>
        </form>
        <span className="text-sm text-ink-500">{items.length} produk</span>
      </div>

      {notice && <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}
      {error && <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Memuat...</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sage-200 bg-white p-10 text-center text-sm text-ink-500">
          Tidak ada produk.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-sage-200 bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-sage-100 text-xs uppercase tracking-wider text-sage-700">
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Toko</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-sage-100/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sage-100">
                        {resolveImageUrl(p.image_url) ? (
                          <img src={resolveImageUrl(p.image_url)} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <span>🛍️</span>
                        )}
                      </div>
                      <span className="font-bold text-sage-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{p.store_name || "-"}</td>
                  <td className="px-4 py-3 font-semibold">{formatIDR(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(p)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
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
    </div>
  );
}
