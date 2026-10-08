import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Button } from "../components/ui/Button";
import { fetchOrder, fetchPayment } from "../api/orders";
import { payWithMidtrans, extractSnapToken } from "../utils/midtrans";
import { formatIDR } from "../utils/format";

const paymentMethodMap = {
  transfer: "Transfer Bank",
  qris: "QRIS",
  dana: "DANA",
  cod: "Cash on Delivery",
};

const paymentStatusMap = {
  pending: {
    label: "Menunggu Pembayaran",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  paid: {
    label: "Sudah Dibayar",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  failed: {
    label: "Pembayaran Gagal",
    classes: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
  canceled: {
    label: "Dibatalkan",
    classes: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  },
};

const orderStatusMap = {
  pending: {
    label: "Menunggu Konfirmasi",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  processing: {
    label: "Diproses",
    classes: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  shipped: {
    label: "Dikirim",
    classes: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  },
  completed: {
    label: "Selesai",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  cancelled: {
    label: "Dibatalkan",
    classes: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  },
};

function getStatusBadge(status, type = "order") {
  const map = type === "payment" ? paymentStatusMap : orderStatusMap;
  const config = map[status] || {
    label: status || "Tidak diketahui",
    classes: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.classes}`}>{config.label}</span>;
}

function OrderDetailContent() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOrder(id)
      .then(setOrder)
      .catch(() => setError("Pesanan tidak ditemukan."))
      .finally(() => setLoading(false));

    fetchPayment(id)
      .then(setPayment)
      .catch(() => {
        /* wajar kalau belum ada data pembayaran */
      });
  }, [id]);

  async function handlePayNow() {
    if (!payment) return;

    try {
      setPaying(true);
      setError("");
      const token = extractSnapToken(payment);

      if (!token) {
        throw new Error("Token pembayaran tidak tersedia untuk pesanan ini (mungkin sudah kedaluwarsa).");
      }

      await payWithMidtrans(token);
      window.location.reload();
    } catch (err) {
      setError(err.message || "Gagal memulai pembayaran.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-sage-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm text-ink-500">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-card">
        <p className="text-sm text-red-700">{error || "Pesanan tidak ditemukan."}</p>
        <Link to="/pesanan-saya" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          ← Kembali ke pesanan saya
        </Link>
      </div>
    );
  }

  const totalAmount = payment?.amount ?? order.total ?? 0;
  const orderStatus = order.status || "pending";
  const paymentStatus = payment?.status || "pending";

  return (
    <div>
      <Link to="/pesanan-saya" className="mb-5 inline-flex items-center text-sm font-semibold text-brand hover:underline">
        ← Kembali ke pesanan saya
      </Link>

      <div className="mb-6 rounded-3xl border border-sage-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Pesanan</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-sage-900">
              {order.order_number || `#${order.id}`}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(orderStatus, "order")}
            {payment && getStatusBadge(paymentStatus, "payment")}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-sage-100/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Toko</p>
            <p className="mt-2 text-sm font-semibold text-sage-900">{order.store_name || "-"}</p>
          </div>
          <div className="rounded-2xl bg-sage-100/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Alamat</p>
            <p className="mt-2 text-sm font-medium text-sage-900 line-clamp-3">{order.address || "-"}</p>
          </div>
          <div className="rounded-2xl bg-sage-100/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Total</p>
            <p className="mt-2 text-lg font-bold text-sage-900">{formatIDR(totalAmount)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-3xl border border-sage-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-sage-900">Detail Pesanan</h2>

          {order.items && order.items.length > 0 ? (
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 rounded-2xl bg-sage-50/80 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-sage-900">
                      {item.product_name || item.name || "Produk"}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-sage-900">
                    {formatIDR((item.price ?? item.unit_price ?? 0) * (item.quantity ?? 1))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">Tidak ada item dalam pesanan ini.</p>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-sage-200 pt-4">
            <span className="text-sm font-semibold text-ink-600">Total Pembayaran</span>
            <span className="text-xl font-black text-sage-900">{formatIDR(totalAmount)}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-sage-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-sage-900">Status Pembayaran</h2>

          {payment ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-sage-50 px-3 py-2.5">
                <span className="text-ink-500">Metode</span>
                <span className="font-semibold text-sage-900">
                  {paymentMethodMap[payment.method] || payment.method || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-sage-50 px-3 py-2.5">
                <span className="text-ink-500">Status</span>
                {getStatusBadge(paymentStatus, "payment")}
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-sage-50 px-3 py-2.5">
                <span className="text-ink-500">Jumlah</span>
                <span className="font-semibold text-sage-900">{formatIDR(payment.amount || totalAmount)}</span>
              </div>

              {payment.paid_at && (
                <div className="flex items-center justify-between rounded-2xl bg-sage-50 px-3 py-2.5">
                  <span className="text-ink-500">Dibayar pada</span>
                  <span className="font-semibold text-sage-900">
                    {new Date(payment.paid_at).toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              {payment.gateway_transaction_id && (
                <div className="flex items-center justify-between rounded-2xl bg-sage-50 px-3 py-2.5">
                  <span className="text-ink-500">ID Transaksi</span>
                  <span className="font-semibold text-sage-900">{payment.gateway_transaction_id}</span>
                </div>
              )}

              {payment.method !== "cod" && paymentStatus === "pending" && (
                <Button
                  type="button"
                  variant="brand"
                  className="w-full"
                  onClick={handlePayNow}
                  disabled={paying}
                >
                  {paying ? "Memproses..." : "Bayar sekarang"}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-sage-200 bg-sage-50 p-4 text-sm text-ink-500">
              Belum ada data pembayaran untuk pesanan ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <OrderDetailContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
