import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // wajib untuk Sanctum (cookie session)
  headers: { Accept: "application/json" },
});

export const rootClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function ensureCsrfCookie() {
  await rootClient.get("/sanctum/csrf-cookie");
}

export default client;
