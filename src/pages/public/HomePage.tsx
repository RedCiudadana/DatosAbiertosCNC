import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Database, AlertTriangle, Building2, CheckCircle2,
  BarChart3, Network, Lightbulb, FileText, Map as MapIcon, Shield,
  TrendingUp, Eye, Gavel,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortalData } from '@/hooks/usePortalData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { DatasetCard } from '@/components/DatasetCard';
import { isOpennessOpen, isOpennessGap } from '@/lib/constants';
import type { DatasetWithRelations, DataStory, OpeningAgendaItem } from '@/types';

export function HomePage() {
  const { settings, categories, integrityDomains, researchPaths } = usePortalData();
  const [searchQuery, setSearchQuery] = useState('');
  const [featured, setFeatured] = useState<DatasetWithRelations[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, gaps: 0, institutions: 0, partial: 0, available: 0 });
  const [statusBreakdown, setStatusBreakdown] = useState<{ name: string; color: string; count: number }[]>([]);
  const [stories, setStories] = useState<DataStory[]>([]);
  const [agenda, setAgenda] = useState<OpeningAgendaItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const [featuredRes, statsRes, statusRes, storiesRes, agendaRes] = await Promise.all([
        supabase
          .from('datasets')
          .select('*, category:categories(*), dataset_type:dataset_types(*), institution:institutions(*), status:statuses(*), tags:dataset_tags(tag:tags(*)), resources:resources(*)')
          .eq('published', true)
          .eq('featured', true)
          .order('display_order')
          .limit(6),
        supabase
          .from('datasets')
          .select('id, openness_level, institution_id, status_id')
          .eq('published', true),
        supabase
          .from('datasets')
          .select('status:statuses(name, color)')
          .eq('published', true)
          .not('status_id', 'is', null),
        supabase
          .from('data_stories')
          .select('*')
          .eq('published', true)
          .order('publication_date', { ascending: false })
          .limit(3),
        supabase
          .from('opening_agenda')
          .select('*')
          .eq('published', true)
          .order('display_order')
          .limit(5),
      ]);

      const datasets = statsRes.data || [];
      const institutionIds = new Set(datasets.map((d) => d.institution_id).filter(Boolean));
      const openCount = datasets.filter((d) => isOpennessOpen((d as { openness_level: number }).openness_level)).length;
      const gapCount = datasets.filter((d) => isOpennessGap((d as { openness_level: number }).openness_level)).length;

      setStats({
        total: datasets.length,
        open: openCount,
        gaps: gapCount,
        institutions: institutionIds.size,
        partial: datasets.filter((d) => {
          const lvl = (d as { openness_level: number }).openness_level;
          return lvl > 0 && lvl < 4;
        }).length,
        available: datasets.filter((d) => (d as { openness_level: number }).openness_level === 3).length,
      });

      const stMap = new Map<string, { color: string; count: number }>();
      (statusRes.data || []).forEach((d) => {
        const st = (d as unknown as { status: { name: string; color: string } | null }).status;
        if (st) {
          const ex = stMap.get(st.name) || { color: st.color, count: 0 };
          ex.count++;
          stMap.set(st.name, ex);
        }
      });
      setStatusBreakdown(Array.from(stMap.entries()).map(([name, v]) => ({ name, color: v.color, count: v.count })));

      const featuredData = (featuredRes.data || []).map((d) => ({
        ...d,
        tags: (d as unknown as { tags?: { tag: unknown }[] }).tags?.map((t) => t.tag).filter(Boolean) || [],
      })) as unknown as DatasetWithRelations[];
      setFeatured(featuredData);
      setStories((storiesRes.data as DataStory[]) || []);
      setAgenda((agendaRes.data as OpeningAgendaItem[]) || []);
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const indicatorCards = [
    { label: 'Fuentes estratégicas', value: stats.total, icon: Database, color: 'text-cnc-700 bg-cnc-50' },
    { label: 'Datos abiertos', value: stats.open, icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
    { label: 'Consulta pública', value: stats.available, icon: Eye, color: 'text-blue-700 bg-blue-50' },
    { label: 'Datos parciales', value: stats.partial, icon: AlertTriangle, color: 'text-amber-700 bg-amber-50' },
    { label: 'Brechas identificadas', value: stats.gaps, icon: AlertTriangle, color: 'text-red-700 bg-red-50' },
    { label: 'Instituciones conectadas', value: stats.institutions, icon: Building2, color: 'text-teal-700 bg-teal-50' },
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
            {integrityDomains.map((domain) => (
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

      {/* 8. MAPA DE DATOS (preview) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Network className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mapa de Datos para la Integridad</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Visualiza cómo se conectan los datasets: personas, empresas, proveedores, presupuesto,
                contratos, obras, auditorías y sanciones. Descubre qué datos puedes cruzar y qué identificadores
                permiten interoperabilidad.
              </p>
              <Link to="/mapa-datos" className="btn-primary">
                Abrir mapa de datos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[300px] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/39041186/pexels-photo-39041186.jpeg?auto=compress&cs=tinysrgb&w=940"
                alt="Colinas verdes y ciudad en Guatemala"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cnc-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                {['Users', 'Building2', 'Banknote', 'FileText', 'HardHat', 'Gavel', 'ShieldAlert', 'Map', 'BarChart3'].map((icon, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md text-cnc-700 backdrop-blur-sm">
                      <DynamicIcon name={icon} className="h-5 w-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      {/* 11. BRECHAS PRIORITARIAS / AGENDA */}
      {agenda.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">Agenda de apertura</h2>
                <p className="text-gray-500 mt-2">Prioridades para abrir información estratégica que todavía no está disponible</p>
              </div>
              <Link to="/brechas" className="text-sm font-medium text-cnc-700 hover:text-cnc-800 inline-flex items-center gap-1">
                Ver agenda completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {agenda.map((item) => (
                <div key={item.id} className="card p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{item.information}</div>
                    {item.situation && <div className="text-xs text-gray-500 mt-0.5">{item.situation}</div>}
                  </div>
                  <div className="hidden sm:block w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Avance</span>
                      <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.priority === 'critica' ? 'bg-red-100 text-red-700' : item.priority === 'alta' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. HISTORIAS CON DATOS */}
      {stories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Historias con datos</h2>
              <p className="text-gray-500 mt-2">Análisis e investigaciones realizadas con los datasets del portal</p>
            </div>
            <Link to="/historias" className="text-sm font-medium text-cnc-700 hover:text-cnc-800 inline-flex items-center gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.map((story) => (
              <Link
                key={story.id}
                to={`/historias/${story.slug}`}
                className="card group overflow-hidden hover:border-cnc-300 hover:shadow-md transition-all"
              >
                {story.cover_image && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-cnc-700 mb-1 line-clamp-2">{story.title}</h3>
                  {story.summary && <p className="text-xs text-gray-500 line-clamp-3">{story.summary}</p>}
                  {story.author && <div className="text-xs text-gray-400 mt-2">{story.author}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 13. INSTITUCIONES (preview) */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11733119/pexels-photo-11733119.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Volcán y pueblo en Guatemala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-cnc-900/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <Building2 className="h-12 w-12 text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Instituciones conectadas</h2>
          <p className="text-cnc-200 mt-2 max-w-xl mx-auto">
            {stats.institutions} instituciones públicas publican o administran los datos disponibles en el portal.
          </p>
          <Link to="/explorar" className="btn-primary mt-6">
            Explorar por institución
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 14. METODOLOGÍA (preview) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Metodología de evaluación</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
            Conoce cómo evaluamos la madurez de los datos, su utilidad anticorrupción, qué significa cada estado
            de disponibilidad y cómo identificamos brechas de información.
          </p>
          {settings.integrity_disclaimer && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-6">
              <p className="text-xs text-amber-900 leading-relaxed">{settings.integrity_disclaimer}</p>
            </div>
          )}
          <Link to="/metodologia" className="btn-primary">
            Conocer la metodología
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
