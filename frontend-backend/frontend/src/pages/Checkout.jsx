import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import { formatIDR } from "../utils/format";

function CheckoutContent() {
  const { groupedByStore, total, clearCart } = useCart();
  const navigate = useNavigate();
  const groups = groupedByStore();

  const [form, setForm] = useState({ address: "", payment_method: "transfer" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    {
      value: "transfer",
      label: "Transfer Bank",
      detail: "BCA, BNI, BRI, Mandiri",
      icon: "🏦",
    },
    {
      value: "qris",
      label: "QRIS",
      detail: "Scan dengan aplikasi pembayaran",
      icon: "▦",
    },
    {
      value: "dana",
      label: "DANA",
      detail: "Bayar cepat dari saldo DANA",
      icon: "D",
    },
    {
      value: "cod",
      label: "Bayar di Tempat",
      detail: "Bayar saat pesanan tiba",
      icon: "📦",
    },
  ];

  if (groups.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-ink-500">Keranjang Anda kosong.</p>
        <Link to="/produk" className="mt-3 inline-block text-sm text-brand hover:underline">
          Mulai belanja
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // 1 toko = 1 order, karena tiap toko dimiliki penjual berbeda.
      const orders = [];
      for (const group of groups) {
        const order = await createOrder({
          store_id: group.storeId,
          address: form.address,
          payment_method: form.payment_method,
          items: group.items.map(({ product, quantity }) => ({
            product_id: product.id,
            quantity,
          })),
        });
        orders.push(order);
      }
      clearCart();
      navigate("/pesanan-berhasil", { state: { orders } });
    } catch (err) {
      const laravelErrors = err.response?.data?.errors;
      setError(
        laravelErrors
          ? Object.values(laravelErrors).flat().join(" ")
          : "Gagal membuat pesanan. Pastikan endpoint /api/orders menerima payload ini."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Pesanan Anda</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-sage-900">Checkout</h1>
        <p className="mt-2 text-sm text-ink-500">Lengkapi alamat dan pilih cara pembayaran.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-4 sm:col-span-3">
          <div className="rounded-2xl border border-sage-200 bg-white p-5 shadow-card">
            <label className="mb-2 block text-sm font-bold text-sage-900">
              Alamat Pengiriman
            </label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Nama penerima, jalan, kota, kode pos"
              className="w-full rounded-lg border border-sage-200 bg-sage-100/40 px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-500 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </div>

          <div className="rounded-2xl border border-sage-200 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-bold text-sage-900">Metode Pembayaran</label>
              <span className="text-xs font-semibold text-ink-500">Aman & terenkripsi</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    form.payment_method === method.value
                      ? "border-brand bg-brand-light ring-2 ring-brand/10"
                      : "border-sage-200 hover:border-brand/50 hover:bg-sage-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={form.payment_method === method.value}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-lg font-bold text-sage-900">
                    {method.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-sage-900">{method.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-ink-500">{method.detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {groups.length > 1 && (
            <p className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-amber-900">
              Belanjaan Anda dari {groups.length} toko berbeda akan dibuat sebagai{" "}
              {groups.length} pesanan terpisah.
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" variant="brand" className="w-full" disabled={submitting}>
            {submitting ? "Memproses..." : `Buat Pesanan — ${formatIDR(total)}`}
          </Button>
        </form>

        <div className="space-y-4 sm:col-span-2">
          {groups.map((group) => (
            <div key={group.storeId} className="rounded-2xl border border-sage-200 bg-sage-100/60 p-4">
              <h2 className="mb-3 text-sm font-bold text-sage-900">{group.storeName}</h2>
              {group.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm text-ink-700">
                  <span className="line-clamp-1 pr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatIDR(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div className="flex justify-between rounded-2xl border border-sage-200 bg-white p-4 text-sm font-bold text-sage-900 shadow-card">
            <span>Total Semua</span>
            <span>{formatIDR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <CheckoutContent />
      </SiteLayout>
    </ProtectedRoute>
  );
}
