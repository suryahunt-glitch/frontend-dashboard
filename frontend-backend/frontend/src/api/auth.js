import client, { ensureCsrfCookie, rootClient } from "./client";

// Route web Sanctum SPA standar. Sesuaikan kalau berbeda di Laravel Anda.
export async function login({ email, password }) {
  await ensureCsrfCookie();
  const { data } = await rootClient.post("/login", { email, password });
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
