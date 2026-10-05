import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Database, FileText, FolderTree,
  Tags, CircleDot, ImageIcon, FolderArchive, Settings, LogOut,
  Menu, X, ExternalLink, Shield, Network,
  Gauge, Hash, Lightbulb, Download,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Datos', path: '/admin/datasets', icon: Database },
  { label: 'Mapa de datos', path: '/admin', icon: Network, isLink: true },
  { label: 'Casos de uso', path: '/admin/use-cases', icon: Lightbulb },
  { label: 'Categorías', path: '/admin/categories', icon: FolderTree },
  { label: 'Ejes de integridad', path: '/admin/integrity-domains', icon: Shield },
  { label: 'Identificadores', path: '/admin/identifiers', icon: Hash },
  { label: 'Evaluaciones', path: '/admin/assessments', icon: Gauge },
  { label: 'Recursos', path: '/admin/resources', icon: FileText },
  { label: 'Etiquetas', path: '/admin/tags', icon: Tags },
  { label: 'Estados', path: '/admin/statuses', icon: CircleDot },
  { label: 'Importar', path: '/admin/import', icon: FolderArchive },
  { label: 'Exportar datos', path: '/admin/export', icon: Download },
  { label: 'Configuración', path: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { session, profile, signOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-cnc-900 text-white flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-cnc-800">
          <Link to="/admin" className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src="https://guatemala.gob.gt/wp-content/uploads/2024/09/GOBHorizontal-Blanco_1.png"
              alt="Gobierno de Guatemala"
              className="h-9 w-auto max-w-[160px] object-contain"
            />
          </Link>
          <button className="lg:hidden text-gray-400 shrink-0" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 pb-3 border-b border-cnc-800">
          <div className="text-xs font-semibold text-teal-400">Datos para la Integridad</div>
          <div className="text-[10px] text-cnc-400 mt-0.5">Datos Abiertos contra la Corrupción en Guatemala</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-cnc-700 text-white' : 'text-cnc-300 hover:bg-cnc-800 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-cnc-800 space-y-1">
          <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cnc-300 hover:bg-cnc-800 hover:text-white">
            <ExternalLink className="h-4 w-4" />
            Ver portal
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cnc-300 hover:bg-cnc-800 hover:text-white w-full">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 hidden sm:inline">{profile?.email}</span>
            <span className="chip bg-cnc-50 text-cnc-700 capitalize">{profile?.role.replace('_', ' ')}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
