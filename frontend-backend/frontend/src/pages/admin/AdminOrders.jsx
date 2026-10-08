import { useCallback, useEffect, useState } from "react";
import { fetchAdminOrders, updateAdminOrderStatus } from "../../api/admin";
import { formatIDR } from "../../utils/format";

const STATUSES = ["", "pending", "processing", "shipped", "completed", "cancelled"];
const STATUS_LABEL = {
  pending: "Pending",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { items } = await fetchAdminOrders({ status });
      setItems(items);
    } catch {
      setError("Gagal memuat pesanan.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  async function handleStatus(order, next) {
    setUpdating(order.id);
    try {
      await updateAdminOrderStatus(order.id, next);
      setNotice(`Pesanan #${order.id} → ${STATUS_LABEL[next]}.`);
      load();
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setError("Gagal mengubah status.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-sage-900">Filter status:</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-2xl border border-sage-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s ? STATUS_LABEL[s] : "Semua"}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-ink-500">{items.length} pesanan</span>
      </div>

      {notice && <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}
      {error && <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Memuat...</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sage-200 bg-white p-10 text-center text-sm text-ink-500">
          Tidak ada pesanan.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((o) => {
            const total = o.payment?.amount ?? o.details?.reduce((s, d) => s + (d.unit_price || d.price || 0) * d.quantity, 0) ?? 0;
            return (
              <div key={o.id} className="rounded-3xl border border-sage-200 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-bold text-sage-900">#{o.id}</span>
                  <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-bold text-sage-800">
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                  {o.payment && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                      Bayar: {o.payment.status}
                    </span>
                  )}
                  <span className="ml-auto font-black text-sage-900">{formatIDR(total)}</span>
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  {o.user?.name || o.user?.email || "Pembeli"} • {o.store?.name || "Toko"} • {o.payment?.method || o.payment_method || "-"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.keys(STATUS_LABEL).filter((s) => s !== o.status).map((s) => (
                    <button
                      key={s}
                      disabled={updating === o.id}
                      onClick={() => handleStatus(o, s)}
                      className="rounded-xl border border-sage-200 bg-white px-3 py-1.5 text-xs font-bold text-sage-800 hover:bg-sage-100 disabled:opacity-50"
                    >
                      → {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
