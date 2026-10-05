import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Database, AlertTriangle, Building2, CheckCircle2,
  Lightbulb, Shield,
  Eye,
} from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { DatasetCard } from '@/components/DatasetCard';
import { isOpennessOpen, isOpennessGap } from '@/lib/constants';

export function HomePage() {
  const { settings, integrityDomains, researchPaths, datasets } = usePortalData();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const published = datasets.filter((d) => d.published);
  const featured = published.filter((d) => d.featured).slice(0, 6);

  const institutionIds = new Set(published.map((d) => d.institution_id).filter(Boolean));
  const openCount = published.filter((d) => isOpennessOpen(d.openness_level)).length;
  const gapCount = published.filter((d) => isOpennessGap(d.openness_level)).length;
  const partialCount = published.filter((d) => d.openness_level > 0 && d.openness_level < 4).length;
  const availableCount = published.filter((d) => d.openness_level === 3).length;

  const statusMap = new Map<string, { color: string; count: number }>();
  published.forEach((d) => {
    if (d.status) {
      const ex = statusMap.get(d.status.name) || { color: d.status.color, count: 0 };
      ex.count++;
      statusMap.set(d.status.name, ex);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const indicatorCards = [
    { label: 'Fuentes estratégicas', value: published.length, icon: Database, color: 'text-cnc-700 bg-cnc-50' },
    { label: 'Datos abiertos', value: openCount, icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
    { label: 'Consulta pública', value: availableCount, icon: Eye, color: 'text-blue-700 bg-blue-50' },
    { label: 'Datos parciales', value: partialCount, icon: AlertTriangle, color: 'text-amber-700 bg-amber-50' },
    { label: 'Brechas identificadas', value: gapCount, icon: AlertTriangle, color: 'text-red-700 bg-red-50' },
    { label: 'Instituciones conectadas', value: institutionIds.size, icon: Building2, color: 'text-teal-700 bg-teal-50' },
  ];

  return (
    <div className="animate-fade-in">
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-cnc-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11818244/pexels-photo-11818244.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Vista aérea de Ciudad de Guatemala al atardecer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 via-cnc-900/80 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cnc-800/50 border border-cnc-700 px-4 py-1.5 text-sm text-cnc-200 mb-6">
              <Shield className="h-4 w-4 text-teal-400" />
              {settings.portal_subtitle || 'Plataforma Nacional de Datos para la Integridad'}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {settings.hero_title || 'Datos para fortalecer la integridad pública'}
            </h1>
            <p className="text-lg text-cnc-200 leading-relaxed mb-8 max-w-2xl">
              {settings.hero_text || 'Explora datos públicos de Guatemala que permiten analizar cómo se toman decisiones, cómo se utilizan los recursos públicos, quiénes participan en ellos y qué mecanismos de control existen.'}
            </p>

            {/* 3. BUSCADOR */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={settings.hero_search_placeholder || 'Buscar contratos, empresas, funcionarios, presupuesto, auditorías, proyectos...'}
                className="w-full rounded-xl border-0 bg-white pl-12 pr-32 py-4 text-base text-gray-900 shadow-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-cnc-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cnc-800"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. ¿QUÉ QUIERES ANALIZAR? — Accesos rápidos */}
      {researchPaths.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Qué quieres analizar?</h2>
          <p className="text-sm text-gray-500 mb-6">Accesos rápidos para iniciar tu investigación</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {researchPaths.map((rp) => (
              <Link
                key={rp.id}
                to={rp.destination_url || '/explorar'}
                className="card group p-4 hover:border-cnc-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cnc-50 text-cnc-700 group-hover:bg-cnc-100 transition-colors shrink-0">
                    <DynamicIcon name={rp.icon_name} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{rp.title}</div>
                    {rp.description && <div className="text-xs text-gray-500 line-clamp-2">{rp.description}</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. INDICADORES NACIONALES */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Indicadores nacionales</h2>
          <p className="text-sm text-gray-500 mb-6">Estado de los datos públicos para la integridad en Guatemala</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {indicatorCards.map((card) => (
              <div key={card.label} className="card p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-xs text-gray-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EJES DE INTEGRIDAD */}
      {integrityDomains.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Ejes de integridad</h2>
              <p className="text-gray-500 mt-2">Organiza los datos según la pregunta que quieres responder</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrityDomains
              .filter((domain) => !['Decisiones públicas', 'Control y consecuencias', 'Territorio'].includes(domain.name))
              .map((domain) => (
              <Link
                key={domain.id}
                to={`/explorar?domain=${domain.slug}`}
                className="card group p-5 hover:border-cnc-300 hover:shadow-md transition-all"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${domain.color}15`, color: domain.color }}
                >
                  <DynamicIcon name={domain.icon_name} className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{domain.name}</h3>
                {domain.question && (
                  <p className="text-xs font-medium text-cnc-700 mb-2">{domain.question}</p>
                )}
                {domain.description && (
                  <p className="text-xs text-gray-500 line-clamp-3">{domain.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. DATOS DESTACADOS */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">Datos destacados</h2>
                <p className="text-gray-500 mt-2">Los conjuntos más relevantes del portal</p>
              </div>
              <Link to="/explorar" className="text-sm font-medium text-cnc-700 hover:text-cnc-800 inline-flex items-center gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((ds) => (
                <DatasetCard key={ds.id} dataset={ds} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. ESTÁNDARES INTERNACIONALES (preview) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Estándares internacionales</h2>
            <p className="text-gray-500 mt-2">Marcos globales que guían la publicación de datos para la integridad</p>
          </div>
          <Link to="/estandares" className="text-sm font-medium text-cnc-700 hover:text-cnc-800 inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Open Data Charter', logo: 'https://opendatacharter.org/wp-content/themes/open-data-theme/images/svg/ODC_Logo.svg' },
            { name: 'PIDA', logo: '' },
            { name: 'CoST Transparency', logo: 'https://infrastructuretransparency.org/wp-content/themes/cost/images/logo.png' },
            { name: 'Open Contracting', logo: 'https://dobt-screendoor.s3.amazonaws.com/uploads/45e5b3913c0a278f1bc598b6bdcb2fee/thumb_OC_logo_RGB_grey__1_.png' },
            { name: 'Open Ownership', logo: 'https://eiti.org/sites/default/files/styles/logo/public/supporter_logo/opo_rgb_logo_purple.png?itok=0IxWe1wQ' },
            { name: 'Fiscal Transparency', logo: '' },
          ].map((std) => (
            <Link
              key={std.name}
              to="/estandares"
              title={std.name}
              className="card group flex items-center justify-center aspect-square p-4 hover:border-cnc-300 hover:shadow-md transition-all"
            >
              {std.logo ? (
                <img
                  src={std.logo}
                  alt={std.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    img.nextElementSibling && (img.nextElementSibling as HTMLElement).style.removeProperty('display');
                  }}
                />
              ) : null}
              {!std.logo && (
                <span className="text-2xl font-bold text-cnc-700">{std.name.charAt(0)}</span>
              )}
              {std.logo && (
                <span className="text-2xl font-bold text-cnc-700" style={{ display: 'none' }}>{std.name.charAt(0)}</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 9. CASOS DE USO (preview) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Casos de uso</h2>
            <p className="text-gray-500 mt-2">Ejemplos de cómo utilizar los datos en la práctica</p>
          </div>
          <Link to="/casos-de-uso" className="text-sm font-medium text-cnc-700 hover:text-cnc-800 inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Link to="/casos-de-uso" className="card p-8 text-center group hover:border-cnc-300 hover:shadow-md transition-all">
          <Lightbulb className="h-12 w-12 text-cnc-300 mx-auto mb-4 group-hover:text-cnc-500 transition-colors" />
          <p className="text-sm text-gray-500">Descubre cómo combinar datasets para responder preguntas concretas sobre la gestión pública.</p>
        </Link>
      </section>
    </div>
  );
}
