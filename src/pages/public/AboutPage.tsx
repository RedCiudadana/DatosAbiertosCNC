import { usePortalData } from '@/hooks/usePortalData';
import { Shield, Database, Users, Layers } from 'lucide-react';

export function AboutPage() {
  const { settings, categories } = usePortalData();

  const categoryNames = categories.map((c) => c.name.toLowerCase());
  const categoryList = categories.length > 0
    ? categories.map((c) => c.name).join(', ').toLowerCase()
    : 'individuos, recursos públicos, regulación, extracción de rentas';

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden text-white py-16">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/29269130/pexels-photo-29269130.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Arquitectura colonial de Antigua Guatemala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Acerca del portal</h1>
          <p className="text-lg text-cnc-200 leading-relaxed">
            {settings.about_text || `${settings.portal_name || 'CNC Guatemala'} — ${settings.portal_subtitle || 'Datos Abiertos contra la Corrupción en Guatemala'}.`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Purpose */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cnc-50 text-cnc-700">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Propósito</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {settings.about_purpose_text || `El portal centraliza, clasifica, documenta y facilita el acceso a conjuntos de datos públicos útiles para prevenir, detectar, investigar y analizar riesgos de corrupción en Guatemala. Sirve como herramienta para instituciones públicas, sociedad civil, periodistas, investigadores y ciudadanos interesados en la integridad pública.`}
          </p>
        </section>

        {/* Features */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cnc-50 text-cnc-700">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Qué encontrarás</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <Database className="h-5 w-5 text-cnc-600 mt-0.5 shrink-0" />
              <span><strong className="text-gray-900">Catálogo de conjuntos de datos</strong> con información detallada sobre cada conjunto, su estado de disponibilidad y recursos.</span>
            </li>
            <li className="flex items-start gap-3">
              <Layers className="h-5 w-5 text-cnc-600 mt-0.5 shrink-0" />
              <span><strong className="text-gray-900">Clasificación anticorrupción</strong> por categoría ({categoryList}) y valor (prevención, detección, investigación).</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-cnc-600 mt-0.5 shrink-0" />
              <span><strong className="text-gray-900">Identificación de brechas</strong> en los datos que Guatemala aún no publica o que no son abiertos.</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="h-5 w-5 text-cnc-600 mt-0.5 shrink-0" />
              <span><strong className="text-gray-900">Directorio de instituciones</strong> responsables de publicar datos en Guatemala.</span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="card p-8 bg-gradient-to-br from-cnc-50 to-teal-50 border-cnc-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contacto</h2>
          <p className="text-gray-600 mb-4">
            ¿Tienes preguntas, sugerencias o quieres colaborar? Escríbenos.
          </p>
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="btn-primary">
              {settings.contact_email}
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
