export function Footer() {
  return (
    <footer className="mt-16 border-t border-sage-200 bg-sage-900">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-sage-200">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-2 font-display text-lg font-bold text-white">
              Marketplace<span className="text-brand">.</span>
            </div>
            <p className="max-w-xs leading-6">Jual beli langsung antar pengguna, gampang dan cepat.</p>
          </div>
          <div>
            <div className="mb-3 font-bold text-white">Bantuan</div>
            <ul className="space-y-1">
              <li>Cara Belanja</li>
              <li>Cara Pembayaran</li>
              <li>Hubungi Kami</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 font-bold text-white">Perusahaan</div>
            <ul className="space-y-1">
              <li>Tentang Kami</li>
              <li>Daftar Toko</li>
              <li>Karir</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-sage-200">
          © {new Date().getFullYear()} Marketplace. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
