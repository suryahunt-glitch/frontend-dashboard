export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-ink-100">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-500">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-2 text-base font-extrabold text-ink-900">
              Marketplace<span className="text-brand">.</span>
            </div>
            <p>Jual beli langsung antar pengguna, gampang dan cepat.</p>
          </div>
          <div>
            <div className="mb-2 font-semibold text-ink-900">Bantuan</div>
            <ul className="space-y-1">
              <li>Cara Belanja</li>
              <li>Cara Pembayaran</li>
              <li>Hubungi Kami</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-ink-900">Perusahaan</div>
            <ul className="space-y-1">
              <li>Tentang Kami</li>
              <li>Daftar Toko</li>
              <li>Karir</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-ink-200 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Marketplace. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
