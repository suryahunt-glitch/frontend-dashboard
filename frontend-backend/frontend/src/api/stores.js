import client from "./client";

// Publik: lihat semua toko / satu toko
export async function fetchStores() {
  const { data } = await client.get("/stores");
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function fetchStore(id) {
  const { data } = await client.get(`/stores/${id}`);
  return data.data ?? data;
}

// Toko milik user yang sedang login (1 user = 1 toko).
// Endpoint ini mengembalikan null/404 kalau user belum punya toko.
export async function fetchMyStore() {
  try {
    const { data } = await client.get("/my-store");
    return data.data ?? data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function createMyStore(payload) {
  const { data } = await client.post("/my-store", payload);
  return data.data ?? data;
}

export async function updateMyStore(payload) {
  const { data } = await client.put("/my-store", payload);
  return data.data ?? data;
}
