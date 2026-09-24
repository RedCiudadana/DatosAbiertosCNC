import { Link } from 'react-router-dom';
import { Database, Mail, Shield, AlertCircle } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

export function Footer() {
  const { settings } = usePortalData();

  return (
    <footer className="bg-cnc-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cnc-700 text-white">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{settings.portal_name || 'CNC Guatemala'}</div>
                <div className="text-xs text-gray-400">{settings.portal_subtitle || 'Plataforma Nacional de Datos para la Integridad'}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {settings.footer_text || 'Datos para la Integridad es una iniciativa para facilitar el acceso, análisis y aprovechamiento de información pública estratégica para fortalecer la integridad en Guatemala.'}
            </p>
            {settings.footer_responsible_institution && (
              <p className="text-xs text-gray-500 mt-3">
                {settings.footer_responsible_institution}
                {settings.footer_technical_partner && ` · ${settings.footer_technical_partner}`}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Portal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explorar" className="hover:text-white transition-colors">Explorar datos</Link></li>
              <li><Link to="/mapa-datos" className="hover:text-white transition-colors">Mapa de datos</Link></li>
              <li><Link to="/casos-de-uso" className="hover:text-white transition-colors">Casos de uso</Link></li>
              <li><Link to="/historias" className="hover:text-white transition-colors">Historias con datos</Link></li>
              <li><Link to="/metodologia" className="hover:text-white transition-colors">Metodología</Link></li>
              <li><Link to="/acerca" className="hover:text-white transition-colors">Acerca del portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              {settings.contact_email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-400" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">{settings.contact_email}</a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-400" />
                <Link to="/admin" className="hover:text-white transition-colors">Acceso administrativo</Link>
              </li>
            </ul>
          </div>
        </div>

        {settings.integrity_disclaimer && (
          <div className="mt-8 pt-6 border-t border-cnc-800">
            <div className="flex items-start gap-2.5 rounded-lg bg-cnc-800/50 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">{settings.integrity_disclaimer}</p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-cnc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {settings.portal_name || 'CNC Guatemala'}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="h-3.5 w-3.5 text-teal-400" />
            {settings.portal_subtitle || 'Plataforma Nacional de Datos para la Integridad'}
          </div>
        </div>
      </div>
    </footer>
  );
}
