import { useCallback, useEffect, useState } from "react";
import { fetchAdminUsers, setAdminUser } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: me, refreshUser } = useAuth();
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
      const { items } = await fetchAdminUsers({ search: keyword });
      setItems(items);
    } catch {
      setError("Gagal memuat pengguna.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const t = setTimeout(load, keyword ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, keyword]);

  async function handleToggle(u) {
    try {
      const res = await setAdminUser(u.id, !u.is_admin);
      setNotice(res.message || "Berhasil.");
      // Kalau mencabut/menambah diri sendiri tidak mungkin (dilarang backend),
      // tapi refresh sesi agar aman.
      if (u.id === me?.id) await refreshUser();
      load();
      setTimeout(() => setNotice(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah peran.");
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        🔐 Hanya akun yang <b>is_admin</b> bisa membuka halaman ini dan dashboard Filament
        (<span className="font-mono">/admin</span> backend). Akun baru dibuat admin lewat dashboard backend
        atau tombol di bawah.
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={(e) => { e.preventDefault(); setKeyword(search); }} className="flex w-full max-w-sm gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama/email..."
            className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button type="submit" className="rounded-2xl bg-sage-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-sage-700">
            Cari
          </button>
        </form>
        <span className="text-sm text-ink-500">{items.length} pengguna</span>
      </div>

      {notice && <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}
      {error && <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Memuat...</p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-sage-200 bg-white shadow-card">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="bg-sage-100 text-xs uppercase tracking-wider text-sage-700">
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Toko</th>
                <th className="px-4 py-3">Pesanan</th>
                <th className="px-4 py-3">Peran</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-sage-100/40">
                  <td className="px-4 py-3">
                    <p className="font-bold text-sage-900">{u.name} {u.id === me?.id && <span className="text-xs text-ink-500">(saya)</span>}</p>
                    <p className="text-xs text-ink-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">{u.has_store ? "Punya" : "-"}</td>
                  <td className="px-4 py-3">{u.orders_count}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${u.is_admin ? "bg-brand-light text-brand" : "bg-slate-100 text-slate-600"}`}>
                      {u.is_admin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggle(u)}
                      disabled={u.id === me?.id}
                      title={u.id === me?.id ? "Tidak bisa mencabut admin diri sendiri" : ""}
                      className="rounded-xl border border-sage-200 bg-white px-3 py-1.5 text-xs font-bold text-sage-800 hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {u.is_admin ? "Cabut admin" : "Jadikan admin"}
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
