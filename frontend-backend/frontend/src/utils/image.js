// Resolve URL gambar produk: backend bisa mengembalikan URL absolut
// atau path relatif /storage/... — samakan ke origin backend.
// Ikuti host halaman yang sedang dibuka (konsisten dengan api/client.js),
// agar URL gambar seorigin dengan API. VITE_API_URL bisa override manual.
const API_BASE = (
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`
).replace(/\/$/, "");

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return `${API_BASE}${imageUrl}`;
  return `${API_BASE}/${imageUrl}`;
}

export function formatStockLabel(stock) {
  const n = Number(stock) || 0;
  if (n <= 0) return "Stok habis";
  if (n <= 5) return `Sisa ${n}`;
  return `${n} tersedia`;
}
