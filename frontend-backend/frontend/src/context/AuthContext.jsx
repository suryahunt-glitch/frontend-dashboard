import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

function isAuthFailure(err) {
  const status = err?.response?.status;
  // 401/419 = sesi benar-benar tidak valid -> anggap logout.
  // Tanpa response (server mati) = masalah koneksi -> JANGAN anggap logout.
  return status === 401 || status === 419;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // true kalau boot/refresh gagal karena server tidak terjangkau (bukan karena belum login)
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then((u) => {
        setUser(u);
        setConnectionError(false);
      })
      .catch((err) => {
        if (isAuthFailure(err)) {
          setUser(null);
          setConnectionError(false);
        } else {
          // Backend tidak terjangkau — pertahankan status, tampilkan error koneksi.
          setConnectionError(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login({ email, password, remember = false }) {
    const res = await authApi.login({ email, password, remember });
    setConnectionError(false);
    if (res?.user) {
      setUser(res.user);
      return res.user;
    }
    // Backend tidak mengembalikan user — fetch ulang.
    // Jika fetch gagal (mis. cookie sesi tidak tersimpan), beri pesan jelas.
    try {
      const currentUser = await authApi.getCurrentUser();
      if (!currentUser) throw new Error("empty-user");
      setUser(currentUser);
      return currentUser;
    } catch {
      throw new Error(
        "Login di server berhasil tapi sesi tidak terbaca. Pastikan backend (port 8000) dan MySQL berjalan, lalu coba lagi."
      );
    }
  }

  async function register(payload) {
    await authApi.register(payload);
    const currentUser = await authApi.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }

  async function refreshUser() {
    setLoading(true);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      setConnectionError(false);
      return currentUser;
    } catch (err) {
      if (isAuthFailure(err)) {
        setUser(null);
        setConnectionError(false);
      } else {
        setConnectionError(true);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, connectionError, isLoggedIn: Boolean(user), login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
