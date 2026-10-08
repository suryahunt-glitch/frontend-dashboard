import axios from "axios";

// API host mengikuti host halaman (window.location.hostname) agar cookie sesi
// selalu same-site: buka frontend via localhost -> API localhost:8000,
// via 127.0.0.1 -> API 127.0.0.1:8000. VITE_API_URL tetap bisa override.
// PENTING: kalau VITE_API_URL diisi host yang beda dari halaman yang dibuka,
// cookie sesi diblokir browser -> refresh selalu kembali ke login.
const API_URL = (
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`
).replace(/\/$/, "");

const client = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: "application/json" },
});

export const rootClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: "application/json" },
});

export async function ensureCsrfCookie() {
  await rootClient.get("/sanctum/csrf-cookie");
}

export default client;
