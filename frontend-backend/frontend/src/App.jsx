import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
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
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
