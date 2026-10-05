import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Download, FileText, Globe, Database,
  Calendar, MapPin, Clock, Tag, ShieldCheck, AlertTriangle, BookOpen,
  Code2, BarChart3, Building2, FileCheck2, Lightbulb, Link2,
  Gavel, Eye, Info, Hash, ChevronRight,
} from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { DatasetCard } from '@/components/DatasetCard';
import { formatDate, cn } from '@/lib/utils';
import {
  ANTI_CORRUPTION_VALUES, RESOURCE_TYPES, getOpennessLevel,
} from '@/lib/constants';

const acIcons: Record<string, typeof ShieldCheck> = {
  prevention: ShieldCheck,
  detection: Eye,
  investigation: Gavel,
  social_control: ShieldCheck,
  traceability: Link2,
};

const resourceIcons: Record<string, typeof Globe> = {
  file: Download, portal: Globe, api: Code2, dashboard: BarChart3, document: FileText,
};

export function DatasetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { datasets } = usePortalData();

  const dataset = datasets.find((d) => d.slug === slug && d.published) || null;
  const [notFound] = useState(false);

  const related = dataset?.category
    ? datasets.filter((d) => d.published && d.category?.slug === dataset.category?.slug && d.id !== dataset.id).slice(0, 4)
    : [];

  if (!dataset && !notFound) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Conjunto no encontrado</h1>
        <p className="text-gray-500 mb-6">El conjunto de datos que buscas no existe o no está publicado.</p>
        <Link to="/explorar" className="btn-primary">Volver a explorar</Link>
      </div>
    );
  }

  if (!dataset) return null;

  const acValues = ANTI_CORRUPTION_VALUES.map((v) => ({
    label: v.label,
    active: dataset[v.field],
    icon: acIcons[v.key],
  }));

  const avail = getOpennessLevel(dataset.openness_level);
  const primaryUrl = dataset.source_url || (dataset.resources && dataset.resources.length > 0 ? dataset.resources[0].url : null);

  const techFields = [
    { icon: MapPin, label: 'Cobertura geográfica', value: dataset.coverage_geo },
    { icon: Clock, label: 'Cobertura temporal', value: dataset.coverage_temporal },
    { icon: Calendar, label: 'Frecuencia de actualización', value: dataset.frequency },
    { icon: Calendar, label: 'Última actualización', value: dataset.last_updated_at ? formatDate(dataset.last_updated_at) : null },
    { icon: BookOpen, label: 'Licencia', value: dataset.license },
    { icon: Code2, label: 'API disponible', value: dataset.api_available ? 'Sí' : null },
  ].filter((f) => f.value);

  const linkFields = [
    { icon: Link2, label: 'URL API', value: dataset.api_url },
    { icon: FileText, label: 'URL metadata', value: dataset.metadata_url },
    { icon: FileText, label: 'URL documentación', value: dataset.documentation_url },
    { icon: Globe, label: 'Fuente oficial', value: dataset.source_url },
  ].filter((f) => f.value);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500 overflow-hidden">
          <Link to="/explorar" className="hover:text-cnc-700 inline-flex items-center gap-1.5 shrink-0">
            <ArrowLeft className="h-4 w-4" /> Explorar
          </Link>
          {dataset.category && (
            <>
              <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
              <Link to={`/explorar?category=${dataset.category.slug}`} className="hover:text-cnc-700 shrink-0">{dataset.category.name}</Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
          <span className="text-gray-700 font-medium truncate">{dataset.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Ficha header */}
        <div className="card overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-cnc-50 to-teal-50 px-6 sm:px-8 pt-6 pb-8">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm text-cnc-700 shrink-0">
                <DynamicIcon name={dataset.icon_name} url={dataset.icon_url} iconType={dataset.icon_type} className="h-10 w-10" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {dataset.category && (
                    <Link to={`/explorar?category=${dataset.category.slug}`} className="chip bg-white text-cnc-700 hover:bg-cnc-100 shadow-sm">
                      {dataset.category.name}
                    </Link>
                  )}
                  {dataset.featured && <span className="chip bg-amber-100 text-amber-700 border border-amber-200">Destacado</span>}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">{dataset.name}</h1>
                <p className="text-gray-600 leading-relaxed">{dataset.short_description || dataset.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {dataset.status && <StatusBadge status={dataset.status} size="md" />}
                  {dataset.institution && (
                    <Link to={`/explorar?institution=${dataset.institution.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-cnc-700">
                      <Building2 className="h-4 w-4" /> {dataset.institution.name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 bg-white px-6 sm:px-8 py-4 flex flex-wrap items-center gap-3">
            {primaryUrl && (
              <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                <ExternalLink className="h-4 w-4" /> Visitar fuente oficial
              </a>
            )}
            {dataset.resources && dataset.resources.length > 0 && (
              <a href="#recursos" className="btn-secondary text-sm">
                <Download className="h-4 w-4" /> {dataset.resources.length} recurso{dataset.resources.length !== 1 ? 's' : ''}
              </a>
            )}
            <span className="ml-auto text-xs text-gray-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Actualizado: {dataset.last_updated_at ? formatDate(dataset.last_updated_at) : 'N/D'}
            </span>
          </div>
        </div>

        {/* Guatemala evaluation */}
        {dataset.guatemala_observations && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Situación en Guatemala
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{dataset.guatemala_observations}</p>
            {dataset.guatemala_regulatory_framework && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Marco normativo</h3>
                <p className="text-sm text-gray-600">{dataset.guatemala_regulatory_framework}</p>
              </div>
            )}
            {dataset.guatemala_evaluated_by && (
              <div className="mt-3 text-xs text-gray-400">
                Evaluado por: {dataset.guatemala_evaluated_by}
                {dataset.guatemala_evaluation_date ? ` · ${formatDate(dataset.guatemala_evaluation_date)}` : ''}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* ¿Por qué importa? */}
            {dataset.anti_corruption_relevance && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-cnc-700" /> ¿Por qué estos datos importan?
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{dataset.anti_corruption_relevance}</p>
              </div>
            )}

            {/* Descripción */}
            {dataset.description && dataset.description !== dataset.short_description && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-cnc-700" /> Descripción
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{dataset.description}</p>
              </div>
            )}

            {/* Recursos */}
            <div id="recursos" className="card p-6 scroll-mt-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-cnc-700" /> Recursos del conjunto
                {dataset.resources && dataset.resources.length > 0 && <span className="text-sm font-normal text-gray-400">({dataset.resources.length})</span>}
              </h2>
              {dataset.resources && dataset.resources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dataset.resources.map((resource) => {
                    const cfg = RESOURCE_TYPES[resource.type] || { label: resource.type };
                    const Icon = resourceIcons[resource.type] || Download;
                    return (
                      <a key={resource.id} href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-cnc-300 hover:shadow-sm transition-all group">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cnc-50 text-cnc-700 group-hover:bg-cnc-100 shrink-0 transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{resource.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            {resource.format && <span className="uppercase font-semibold text-cnc-600">{resource.format}</span>}
                            <span className="capitalize">{cfg.label}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-cnc-700 shrink-0 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Sin recursos disponibles.</p>
                </div>
              )}
            </div>

            {/* Datos técnicos */}
            {techFields.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-cnc-700" /> Datos técnicos
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {techFields.map((field) => (
                    <div key={field.label} className="flex items-start gap-2.5">
                      <field.icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div><dt className="text-xs text-gray-500">{field.label}</dt><dd className="text-sm text-gray-900 font-medium">{field.value}</dd></div>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Enlaces */}
            {linkFields.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-cnc-700" /> Enlaces
                </h2>
                <div className="space-y-3">
                  {linkFields.map((field) => (
                    <a key={field.label} href={field.value || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-cnc-700 hover:text-cnc-800 group">
                      <field.icon className="h-4 w-4 text-gray-400 group-hover:text-cnc-700 shrink-0" />
                      <span className="flex-1 truncate">{field.label}: {field.value}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Estado */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Estado de disponibilidad</h3>
              {dataset.status && <StatusBadge status={dataset.status} size="md" />}
              {dataset.status?.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{dataset.status.description}</p>}
            </div>

            {/* Nivel de apertura */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Nivel de disponibilidad</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: avail.color }} />
                <span className="text-sm font-semibold" style={{ color: avail.color }}>{avail.label}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{avail.description}</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className={cn('h-2 flex-1 rounded-full transition-colors', level <= dataset.openness_level ? 'bg-teal-500' : 'bg-gray-200')} />
                ))}
              </div>
              <div className="mt-1.5 text-xs text-gray-500">{dataset.openness_level}/5</div>
            </div>

            {/* Institución */}
            {dataset.institution && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Institución responsable</h3>
                <Link to={`/explorar?institution=${dataset.institution.slug}`} className="flex items-center gap-3 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-cnc-700">{dataset.institution.name}</div>
                    {dataset.institution.acronym && <div className="text-xs text-gray-500">{dataset.institution.acronym}</div>}
                  </div>
                </Link>
                {dataset.institution.website && (
                  <a href={dataset.institution.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-cnc-700 hover:text-cnc-800">
                    <Globe className="h-3.5 w-3.5" /> Sitio web
                  </a>
                )}
              </div>
            )}

            {/* Valor anticorrupción */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Valor anticorrupción</h3>
              <div className="space-y-2.5">
                {acValues.map((v) => (
                  <div key={v.label} className={cn('flex items-center gap-2.5 text-sm', v.active ? 'text-gray-900' : 'text-gray-300')}>
                    <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', v.active ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-300')}>
                      <v.icon className="h-3.5 w-3.5" />
                    </div>
                    {v.label}
                    {v.active && <ShieldCheck className="h-3.5 w-3.5 text-teal-600 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Etiquetas */}
            {dataset.tags && dataset.tags.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" /> Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <Link key={tag.id} to={`/explorar?q=${encodeURIComponent(tag.name)}`} className="chip bg-gray-100 text-gray-600 hover:bg-gray-200">{tag.name}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conjuntos relacionados (same category) */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between mb-6">
              <h2 className="section-title">Conjuntos relacionados</h2>
              <Link to={`/explorar?category=${dataset.category?.slug}`} className="text-sm font-medium text-cnc-700 hover:text-cnc-800">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((ds) => <DatasetCard key={ds.id} dataset={ds} />)}
            </div>
          </section>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/explorar" className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Volver a explorar</Link>
        </div>
      </div>
    </div>
  );
}
