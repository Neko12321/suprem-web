import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#060609] border-t border-purple-900/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-lg">
                SR
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-wider">SUPREM</span>
                <span className="text-purple-400 text-[10px] tracking-[0.3em] -mt-1">RECORD</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Müzikte sınırları zorlayan sanatçılar için yaratıcı prodüksiyon çözümleri.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm">HIZLI LİNKLER</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/hakkimizda" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Hakkımızda</Link></li>
              <li><Link href="/hizmetler" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Hizmetler</Link></li>
              <li><Link href="/fiyatlar" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">Fiyatlar</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm">HİZMETLER</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-500 text-sm">Profesyonel Prodüksiyon</span></li>
              <li><span className="text-gray-500 text-sm">Mix & Mastering</span></li>
              <li><span className="text-gray-500 text-sm">Dağıtım</span></li>
              <li><span className="text-gray-500 text-sm">Sanatçı Yönetimi</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm">İLETİŞİM</h3>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm">info@supremrecord.com</li>
              <li className="text-gray-500 text-sm">+90 555 123 4567</li>
              <li className="text-gray-500 text-sm">İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="gradient-purple-line mt-8 mb-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <p>© 2025 Suprem Record. Tüm hakları saklıdır.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/randevu" className="hover:text-purple-400 transition-colors">Randevu Al</Link>
            <Link href="/blog" className="hover:text-purple-400 transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
