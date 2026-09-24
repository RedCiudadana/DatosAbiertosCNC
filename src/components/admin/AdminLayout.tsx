import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Database, Building2, FileText, FolderTree,
  Tags, CircleDot, ImageIcon, FolderArchive, Settings, LogOut,
  Menu, X, ExternalLink, Shield, Network, BookOpen,
  MessageSquare, Gauge, Hash, Flag, Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePortalData } from '@/hooks/usePortalData';
import { RESOURCE_TYPES } from '@/lib/constants';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Datos', path: '/admin/datasets', icon: Database },
  { label: 'Mapa de datos', path: '/admin', icon: Network, isLink: true },
  { label: 'Casos de uso', path: '/admin/use-cases', icon: Lightbulb },
  { label: 'Historias', path: '/admin/data-stories', icon: BookOpen },
  { label: 'Brechas', path: '/admin', icon: Flag, isLink: true },
  { label: 'Agenda de apertura', path: '/admin/opening-agenda', icon: Flag },
  { label: 'Instituciones', path: '/admin/institutions', icon: Building2 },
  { label: 'Categorías', path: '/admin/categories', icon: FolderTree },
  { label: 'Ejes de integridad', path: '/admin/integrity-domains', icon: Shield },
  { label: 'Identificadores', path: '/admin/identifiers', icon: Hash },
  { label: 'Evaluaciones', path: '/admin/assessments', icon: Gauge },
  { label: 'Comentarios', path: '/admin/feedback', icon: MessageSquare },
  { label: 'Recursos', path: '/admin/resources', icon: FileText },
  { label: 'Etiquetas', path: '/admin/tags', icon: Tags },
  { label: 'Estados', path: '/admin/statuses', icon: CircleDot },
  { label: 'Importar', path: '/admin/import', icon: FolderArchive },
  { label: 'Configuración', path: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { session, profile, signOut, loading } = useAuth();
  const { settings } = usePortalData();
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
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cnc-700">
              <Shield className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <div className="text-sm font-bold">{settings.portal_name || 'CNC Admin'}</div>
              <div className="text-xs text-cnc-300">{settings.portal_subtitle || 'Datos para la Integridad'}</div>
            </div>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
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
