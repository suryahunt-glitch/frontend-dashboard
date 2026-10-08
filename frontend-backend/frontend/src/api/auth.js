import client, { ensureCsrfCookie, rootClient } from "./client";

// Login email + password (Google OAuth sudah dihapus total).
export async function login({ email, password, remember = false }) {
  await ensureCsrfCookie();
  const { data } = await rootClient.post("/login", {
    email: email?.trim(),
    password,
    remember,
  });
  return data;
}

export async function forgotPassword(email) {
  await ensureCsrfCookie();
  const { data } = await rootClient.post("/forgot-password", { email });
  return data;
}

export async function register({ name, email, password, password_confirmation }) {
  await ensureCsrfCookie();
  const { data } = await rootClient.post("/register", {
    name,
    email,
    password,
    password_confirmation,
  });
  return data;
}

export async function logout() {
  await rootClient.post("/logout");
}

export async function getCurrentUser() {
  const { data } = await client.get("/user");
  return data;
}

// Pesan error Laravel -> string Indonesia yang rapi.
export function toAuthMessage(err, fallback) {
  const res = err?.response?.data;
  if (!res) {
    // Tanpa response = browser tidak bisa mencapai backend sama sekali.
    if (!err?.response) {
      return "Tidak dapat terhubung ke server. Pastikan backend (php artisan serve, port 8000) dan MySQL berjalan.";
    }
    return err?.message || fallback;
  }
  if (typeof res.message === "string" && res.message) return res.message;
  if (res.errors) {
    const first = Object.values(res.errors).flat()[0];
    if (first) return first;
  }
  return fallback;
}
