import client from "./client";

// Membuat order (butuh login). Payload umum:
// { store_id, items: [{product_id, quantity}], address, payment_method }
export async function createOrder(payload) {
  const { data } = await client.post("/orders", payload);
  return data.data ?? data;
}

// Daftar order milik user yang login (sebagai pembeli)
export async function fetchMyOrders() {
  const { data } = await client.get("/orders");
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function fetchOrder(id) {
  const { data } = await client.get(`/orders/${id}`);
  return data.data ?? data;
}

// Info pembayaran untuk satu order
export async function fetchPayment(orderId) {
  const { data } = await client.get(`/orders/${orderId}/payment`);
  return data.data ?? data;
}
