// Helper Snap Midtrans terpusat (dipakai Checkout + OrderDetail).
// Sandbox vs Production ditentukan env: VITE_MIDTRANS_IS_PRODUCTION=true
// berarti memakai https://app.midtrans.com, selain itu sandbox.

export function isMidtransProduction() {
  return String(import.meta.env.VITE_MIDTRANS_IS_PRODUCTION || "").toLowerCase() === "true";
}

export function snapScriptUrl() {
  return isMidtransProduction()
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
}

function loadSnapScript(clientKey) {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const existing = document.querySelector('script[data-midtrans-snap="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Gagal memuat payment gateway.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = snapScriptUrl();
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-midtrans-snap", "1");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat payment gateway."));
    document.body.appendChild(script);
  });
}

// Buka popup Snap. Resolve true jika success, reject dengan pesan jika pending/gagal/ditutup.
export async function payWithMidtrans(snapToken) {
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  if (!snapToken) throw new Error("Token pembayaran tidak tersedia.");
  if (!clientKey) {
    throw new Error("Payment gateway belum dikonfigurasi. Isi VITE_MIDTRANS_CLIENT_KEY di file .env frontend lalu restart npm run dev.");
  }
  await loadSnapScript(clientKey);
  return new Promise((resolve, reject) => {
    window.snap.pay(snapToken, {
      onSuccess: () => resolve(true),
      onPending: () => reject(new Error("Pembayaran masih menunggu konfirmasi (cek status di halaman pesanan).")),
      onError: () => reject(new Error("Pembayaran gagal diproses.")),
      onClose: () => reject(new Error("Popup pembayaran ditutup sebelum selesai.")),
    });
  });
}

// Ambil snap token dari gateway_response yang disimpan backend.
export function extractSnapToken(payment) {
  if (!payment?.gateway_response) return null;
  try {
    const parsed = JSON.parse(payment.gateway_response);
    return parsed?.token || parsed?.snap_token || null;
  } catch {
    return null;
  }
}
