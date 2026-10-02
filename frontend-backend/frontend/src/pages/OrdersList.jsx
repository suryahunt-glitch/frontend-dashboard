import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Button } from "../components/ui/Button";
import { fetchMyOrders } from "../api/orders";
import { formatIDR } from "../utils/format";

const statusColor = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColor = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  canceled: "bg-slate-100 text-slate-700",
};

const paymentStatusLabel = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  failed: "Pembayaran Gagal",
  canceled: "Dibatalkan",
};

const orderStatusLabel = {
  pending: "Menunggu Konfirmasi",
  processing: "Diproses",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  function payWithMidtrans(token) {
    return new Promise((resolve, reject) => {
      const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
      if (!token || !clientKey) {
        reject(new Error("Payment gateway belum dikonfigurasi. Isi VITE_MIDTRANS_CLIENT_KEY."));
        return;
      }

      const openSnap = () => {
        window.snap.pay(token, {
          onSuccess: () => resolve(true),
          onPending: () => reject(new Error("Pembayaran masih menunggu konfirmasi.")),
          onError: () => reject(new Error("Pembayaran gagal diproses.")),
          onClose: () => reject(new Error("Popup pembayaran ditutup sebelum selesai.")),
        });
      };

      if (window.snap) {
        openSnap();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", clientKey);
      script.onload = openSnap;
      script.onerror = () => reject(new Error("Gagal memuat payment gateway."));
      document.body.appendChild(script);
    });
  }

  async function handlePayNow(order) {
    if (!order?.payment) return;

    try {
      setPayingId(order.id);

      const gatewayResponse = order.payment.gateway_response
        ? JSON.parse(order.payment.gateway_response)
        : null;

      const token = gatewayResponse?.token || gatewayResponse?.snap_token;

      if (!token) {
        throw new Error("Token pembayaran tidak tersedia untuk pesanan ini.");
      }

      await payWithMidtrans(token);
      window.location.reload();
    } catch (err) {
      setError(err.message || "Gagal memulai pembayaran.");
    } finally {
      setPayingId(null);
    }
  }

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError("Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink-500">Memuat...</p>;

  if (error) {
    return <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-500">
        Anda belum memiliki pesanan.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const canPay = order.payment && order.payment.method !== "cod" && order.payment.status === "pending";

        return (
          <div
            key={order.id}
            className="rounded-lg border border-ink-200 bg-white p-4 shadow-card hover:shadow-lg"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Link to={`/pesanan-saya/${order.id}`} className="flex-1">
                <div>
                  <p className="font-mono text-sm font-semibold text-ink-900">
                    {order.order_number || `#${order.id}`}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">{order.store_name}</p>
                </div>
              </Link>

              <div className="flex flex-col items-end gap-2 md:min-w-[200px]">
                <p className="text-sm font-bold text-ink-900">{formatIDR(order.total)}</p>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      statusColor[order.status] || "bg-ink-100 text-ink-700"
                    }`}
                  >
                    {orderStatusLabel[order.status] || order.status || "Status"}
                  </span>
                  {order.payment && (
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        paymentStatusColor[order.payment.status] || "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {paymentStatusLabel[order.payment.status] || order.payment.status || "Status"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {canPay && (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="brand"
                  className="px-4 py-2 text-sm"
                  onClick={() => handlePayNow(order)}
                  disabled={payingId === order.id}
                >
                  {payingId === order.id ? "Memproses..." : "Bayar sekarang"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersList() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="mb-6 text-xl font-bold text-ink-900">Pesanan Saya</h1>
          <OrdersContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
