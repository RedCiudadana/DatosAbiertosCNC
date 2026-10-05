import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Search, Shield, Instagram, Globe } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const navLinks = [
  { label: 'Inicio', path: '/' },
  { label: 'Explorar datos', path: '/explorar' },
  { label: 'Casos de uso', path: '/casos-de-uso' },
  { label: 'Acerca del portal', path: '/acerca' },
];

export function Header() {
  const { settings } = usePortalData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-cnc-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="h-3.5 w-3.5 text-teal-300" />
            <span className="font-medium">{settings.portal_name || 'CNC Guatemala'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/CNCguatemala/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram CNC Guatemala"
                className="text-cnc-200 hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/CNCguatemala"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) CNC Guatemala"
                className="text-cnc-200 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://cnc.gob.gt/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sitio web CNC Guatemala"
                className="text-cnc-200 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 bg-cnc-900 rounded-lg px-3 py-1.5 hover:bg-cnc-800 transition-colors">
            <img
              src="/gob-guatemala-blanco.svg"
              alt="Gobierno de Guatemala"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-cnc-700 bg-cnc-50'
                    : 'text-gray-600 hover:text-cnc-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-44 rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 text-sm focus:border-cnc-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cnc-500 transition-all"
              />
            </form>
            <Link to="/explorar" className="btn-primary">
              <Search className="h-4 w-4" />
              Explorar datos
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar datos..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:border-cnc-500 focus:bg-white focus:outline-none"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg ${
                  isActive(link.path)
                    ? 'text-cnc-700 bg-cnc-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/explorar" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-2">
              Explorar datos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
