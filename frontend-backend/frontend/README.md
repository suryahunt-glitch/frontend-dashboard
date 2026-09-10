# Marketplace — React + Laravel

Frontend React untuk marketplace multi-penjual: user register/login,
1 user boleh punya 1 toko, tambah produk ke tokonya, user lain yang login
bisa lihat toko & produk itu lalu membeli (order + payment).

Modul Employee **sengaja dilewati** di versi ini.

## 1. Jalankan

```bash
cp .env.example .env
# isi VITE_API_URL sesuai URL Laravel Anda

npm install
npm run dev
```

Buka `http://localhost:5175`.

## 2. Endpoint Laravel yang DIBUTUHKAN

Skema ini lebih kompleks dari sekadar CRUD biasa, karena ada aturan
"1 user = 1 toko" dan "hanya pemilik toko yang boleh kelola produknya
sendiri". Berikut daftar endpoint yang diasumsikan frontend ini —
sesuaikan dengan yang sudah ada di `routes/api.php`/`routes/web.php`
Anda, atau beri tahu saya struktur yang sudah ada supaya saya sesuaikan
kode di `src/api/`.

### Auth (route web, Sanctum SPA)
```
POST /register   { name, email, password, password_confirmation }
POST /login       { email, password }
POST /logout
GET  /api/user    -> user yang sedang login
```

### Toko (publik untuk lihat, auth untuk kelola toko sendiri)
```
GET  /api/stores            -> semua toko (publik)
GET  /api/stores/{id}       -> detail 1 toko (publik)
GET  /api/my-store          -> toko milik user login (404 kalau belum punya)
POST /api/my-store          -> buat toko (tolak kalau user sudah punya toko)
PUT  /api/my-store          -> ubah toko milik sendiri
```

Validasi "1 user 1 toko" sebaiknya dicek di `StoreController` Laravel,
misalnya:
```php
public function store(Request $request) {
    if ($request->user()->store()->exists()) {
        return response()->json(['message' => 'Anda sudah memiliki toko.'], 422);
    }
    // ...
}
```

### Produk (publik untuk lihat, auth + harus pemilik toko untuk kelola)
```
GET    /api/products?store_id=   -> semua produk, bisa difilter per toko (publik)
GET    /api/products/{id}         -> detail 1 produk (publik)
POST   /api/products               -> tambah produk (auth, harus attach ke toko milik sendiri)
PUT    /api/products/{id}           -> ubah produk (auth, harus produk milik toko sendiri)
DELETE /api/products/{id}            -> hapus produk (auth, sama seperti di atas)
```
Response produk idealnya menyertakan `store_id` dan `store_name` (via
eager load relasi `store`), supaya frontend bisa tampilkan nama toko
penjual di kartu produk.

### Order & Payment (auth)
```
POST /api/orders              -> buat order { store_id, address, payment_method, items: [{product_id, quantity}] }
GET  /api/orders               -> daftar order milik user login (sebagai pembeli)
GET  /api/orders/{id}           -> detail 1 order (termasuk items)
GET  /api/orders/{id}/payment    -> data pembayaran untuk order tsb
```

Catatan: karena 1 toko = 1 penjual, saat checkout dengan produk dari
beberapa toko sekaligus, frontend ini otomatis mengirim **satu request
order terpisah per toko** (lihat `src/pages/Checkout.jsx`).

### CORS & Sanctum
Sama seperti proyek dashboard sebelumnya:
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5175'],
```
```
# .env Laravel
SANCTUM_STATEFUL_DOMAINS=localhost:5175
SESSION_DOMAIN=localhost
```

## 3. Struktur proyek

```
src/
  api/
    client.js     -> axios + Sanctum CSRF
    auth.js         -> register, login, logout, getCurrentUser
    stores.js         -> fetchStores, fetchStore, fetchMyStore, createMyStore, updateMyStore
    products.js         -> fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct
    orders.js             -> createOrder, fetchMyOrders, fetchOrder, fetchPayment
  context/
    AuthContext.jsx  -> status login
    CartContext.jsx    -> keranjang, dikelompokkan per toko saat checkout
  components/
    layout/            -> Navbar, Footer, SiteLayout
    ui/                 -> ProductCard, Field, Button, ProductFormModal
    ProtectedRoute.jsx   -> redirect ke /login kalau belum login
  pages/
    Home.jsx
    Login.jsx / Register.jsx
    ProductList.jsx / ProductDetail.jsx
    StoreList.jsx / StoreDetail.jsx     -> lihat toko orang lain
    MyStore.jsx                          -> buka/ubah toko sendiri
    MyProducts.jsx                        -> kelola produk toko sendiri
    Cart.jsx / Checkout.jsx
    OrdersList.jsx / OrderDetail.jsx       -> pesanan saya + info pembayaran
```

## 4. Alur penggunaan

1. User **Register/Login**
2. Klik **"Buka Toko"** di beranda / navbar → isi nama toko (kalau sudah
   punya toko, akan langsung diarahkan ke info toko, bukan form buat baru)
3. Di halaman **Toko Saya → Kelola Produk**, tambahkan produk
4. User lain browsing di **/produk** atau **/toko/{id}**, tambah ke
   keranjang, checkout (wajib login)
5. Setelah checkout, cek **Pesanan Saya** untuk lihat status & pembayaran

## 5. Build produksi

```bash
npm run build
```
