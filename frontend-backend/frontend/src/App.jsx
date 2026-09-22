import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import StoreList from "./pages/StoreList";
import StoreDetail from "./pages/StoreDetail";
import MyStore from "./pages/MyStore";
import MyProducts from "./pages/MyProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrdersList from "./pages/OrdersList";
import OrderDetail from "./pages/OrderDetail";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-950 via-purple-800 to-fuchsia-700 px-5">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur-xl">
        <div className="text-7xl font-black text-purple-200">404</div>

        <h1 className="mt-4 text-2xl font-black">
          Halaman tidak ditemukan
        </h1>

        <p className="mt-3 text-purple-100">
          Halaman yang kamu cari mungkin sudah dipindahkan atau dihapus.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-violet-700 transition hover:bg-purple-50"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <div className="min-h-screen bg-[#faf9ff] text-slate-800">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/produk" element={<ProductList />} />
          <Route path="/produk/:id" element={<ProductDetail />} />

          <Route path="/toko" element={<StoreList />} />
          <Route path="/toko/:id" element={<StoreDetail />} />

          <Route path="/toko-saya" element={<MyStore />} />
          <Route path="/toko-saya/produk" element={<MyProducts />} />

          <Route path="/keranjang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pesanan-berhasil" element={<OrderSuccess />} />

          <Route path="/pesanan-saya" element={<OrdersList />} />
          <Route path="/pesanan-saya/:id" element={<OrderDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}