import { useCallback, useEffect, useState } from "react";
import { fetchAdminStores, deleteAdminStore } from "../../api/admin";

export default function AdminStores() {
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
      const { items } = await fetchAdminStores({ search: keyword });
      setItems(items);
    } catch {
      setError("Gagal memuat toko.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const t = setTimeout(load, keyword ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, keyword]);

  async function handleDelete(s) {
    if (!confirm(`Hapus toko "${s.name}" beserta semua produknya?`)) return;
    try {
      await deleteAdminStore(s.id);
      setNotice(`Toko "${s.name}" dihapus.`);
      load();
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Gagal menghapus toko.");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={(e) => { e.preventDefault(); setKeyword(search); }} className="flex w-full max-w-sm gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari toko..."
            className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button type="submit" className="rounded-2xl bg-sage-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-sage-700">
            Cari
          </button>
        </form>
        <span className="text-sm text-ink-500">{items.length} toko</span>
      </div>

      {notice && <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}
      {error && <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Memuat...</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sage-200 bg-white p-10 text-center text-sm text-ink-500">
          Belum ada toko. Toko yang dibuat pengguna lewat "Toko Saya" akan muncul di sini.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((s) => (
            <div key={s.id} className="rounded-3xl border border-sage-200 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-sage-900">🏪 {s.name}</p>
                  <p className="mt-1 text-xs text-ink-500">Pemilik: {s.user?.name || "-"} ({s.user?.email || "-"})</p>
                </div>
                <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-bold text-sage-800">
                  {s.products_count ?? 0} produk
                </span>
              </div>
              {s.address && <p className="mt-2 text-sm text-ink-700">{s.address}</p>}
              {s.phone && <p className="mt-1 text-sm text-ink-500">📞 {s.phone}</p>}
              <button
                onClick={() => handleDelete(s)}
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                Hapus toko
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
