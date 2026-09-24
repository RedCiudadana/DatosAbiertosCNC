import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Download, FileText, Globe, Database,
  Calendar, MapPin, Clock, Tag, ShieldCheck, AlertTriangle, BookOpen,
  Code2, BarChart3, Building2, FileCheck2, Lightbulb, Link2,
  Gavel, Eye, Info, Hash, Mail, ChevronRight, HelpCircle, Network,
  Gauge, TrendingUp, MessageSquare, Send,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { DatasetCard } from '@/components/DatasetCard';
import { formatDate, cn } from '@/lib/utils';
import {
  ANTI_CORRUPTION_VALUES, RESOURCE_TYPES, getOpennessLevel,
  ASSESSMENT_DIMENSIONS, AC_ASSESSMENT_DIMENSIONS, FEEDBACK_TYPES,
} from '@/lib/constants';
import { usePortalData } from '@/hooks/usePortalData';
import type { DatasetWithRelations, Resource, UseCase, DatasetQuestion, DatasetRelationship, Identifier, DatasetAssessment } from '@/types';

const acIcons: Record<string, typeof ShieldCheck> = {
  prevention: ShieldCheck,
  detection: Eye,
  investigation: Gavel,
  social_control: TrendingUp,
  traceability: Link2,
};

const resourceIcons: Record<string, typeof Globe> = {
  file: Download, portal: Globe, api: Code2, dashboard: BarChart3, document: FileText,
};

export function DatasetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = usePortalData();
  const [dataset, setDataset] = useState<DatasetWithRelations | null>(null);
  const [related, setRelated] = useState<DatasetWithRelations[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [questions, setQuestions] = useState<DatasetQuestion[]>([]);
  const [relationships, setRelationships] = useState<DatasetRelationship[]>([]);
  const [relatedDatasets, setRelatedDatasets] = useState<Record<string, DatasetWithRelations>>({});
  const [datasetIdentifiers, setDatasetIdentifiers] = useState<Identifier[]>([]);
  const [assessment, setAssessment] = useState<DatasetAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Feedback form
  const [fbName, setFbName] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbType, setFbType] = useState('broken_link');
  const [fbComment, setFbComment] = useState('');
  const [fbSent, setFbSent] = useState(false);

  useEffect(() => {
    async function loadDataset() {
      if (!slug) return;
      setLoading(true);
      setNotFound(false);
      const { data } = await supabase
        .from('datasets')
        .select('*, category:categories(*), dataset_type:dataset_types(*), institution:institutions(*), status:statuses(*), tags:dataset_tags(tag:tags(*)), resources:resources(*)')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (!data) { setNotFound(true); setLoading(false); return; }

      const transformed = {
        ...data,
        tags: (data as unknown as { tags?: { tag: unknown }[] }).tags?.map((t) => t.tag).filter(Boolean) || [],
        resources: ((data as unknown as { resources?: Resource[] }).resources || []).filter((r) => r.is_active).sort((a, b) => a.display_order - b.display_order),
      } as unknown as DatasetWithRelations;

      setDataset(transformed);
      setLoading(false);

      // Load related datasets (same category)
      if (transformed.category_id) {
        const { data: relData } = await supabase
          .from('datasets')
          .select('*, category:categories(*), dataset_type:dataset_types(*), institution:institutions(*), status:statuses(*), tags:dataset_tags(tag:tags(*)), resources:resources(*)')
          .eq('published', true)
          .eq('category_id', transformed.category_id)
          .neq('id', transformed.id)
          .order('featured', { ascending: false })
          .order('display_order')
          .limit(4);
        const relTransformed = (relData || []).map((d) => ({
          ...d,
          tags: (d as unknown as { tags?: { tag: unknown }[] }).tags?.map((t) => t.tag).filter(Boolean) || [],
        })) as unknown as DatasetWithRelations[];
        setRelated(relTransformed);
      }

      // Load use cases
      const { data: ucRelData } = await supabase
        .from('use_case_datasets')
        .select('use_case_id')
        .eq('dataset_id', transformed.id);
      const ucIds = (ucRelData || []).map((r) => (r as { use_case_id: string }).use_case_id);
      if (ucIds.length > 0) {
        const { data: ucData } = await supabase
          .from('use_cases')
          .select('*')
          .eq('published', true)
          .in('id', ucIds)
          .order('display_order');
        setUseCases((ucData || []) as unknown as UseCase[]);
      } else {
        setUseCases([]);
      }

      // Load questions
      const { data: qData } = await supabase
        .from('dataset_questions')
        .select('*')
        .eq('dataset_id', transformed.id)
        .order('display_order');
      setQuestions((qData as DatasetQuestion[]) || []);

      // Load relationships
      const { data: relData } = await supabase
        .from('dataset_relationships')
        .select('*')
        .or(`source_dataset_id.eq.${transformed.id},target_dataset_id.eq.${transformed.id}`)
        .order('display_order');
      const rels = (relData as DatasetRelationship[]) || [];
      setRelationships(rels);

      // Load related datasets for relationships
      const relDsIds = new Set<string>();
      rels.forEach((r) => {
        relDsIds.add(r.source_dataset_id);
        relDsIds.add(r.target_dataset_id);
      });
      relDsIds.delete(transformed.id);
      if (relDsIds.size > 0) {
        const { data: relDsData } = await supabase
          .from('datasets')
          .select('*, category:categories(*), institution:institutions(*), status:statuses(*)')
          .in('id', Array.from(relDsIds))
          .eq('published', true);
        const map: Record<string, DatasetWithRelations> = {};
        (relDsData || []).forEach((d) => { map[(d as { id: string }).id] = d as unknown as DatasetWithRelations; });
        setRelatedDatasets(map);
      }

      // Load identifiers
      const { data: idnData } = await supabase
        .from('dataset_identifiers')
        .select('identifier:identifiers(*)')
        .eq('dataset_id', transformed.id);
      setDatasetIdentifiers(
        ((idnData || []) as unknown as { identifier: Identifier }[]).map((r) => r.identifier).filter(Boolean)
      );

      // Load assessment
      const { data: aData } = await supabase
        .from('dataset_assessments')
        .select('*')
        .eq('dataset_id', transformed.id)
        .maybeSingle();
      setAssessment((aData as DatasetAssessment) || null);
    }
    loadDataset();
  }, [slug]);

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataset || !fbComment.trim()) return;
    const { error } = await supabase
      .from('dataset_feedback')
      .insert({
        dataset_id: dataset.id,
        name: fbName || null,
        email: fbEmail || null,
        feedback_type: fbType,
        comment: fbComment,
      });
    if (!error) {
      setFbSent(true);
      setFbName(''); setFbEmail(''); setFbComment('');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !dataset) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Conjunto no encontrado</h1>
        <p className="text-gray-500 mb-6">El conjunto de datos que buscas no existe o no está publicado.</p>
        <Link to="/explorar" className="btn-primary">Volver a explorar</Link>
      </div>
    );
  }

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

        {/* Madurez y Utilidad (scores) */}
        {assessment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Madurez */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="h-5 w-5 text-cnc-700" />
                <h2 className="text-base font-semibold text-gray-900">Madurez del dato</h2>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">{assessment.total_score}<span className="text-lg text-gray-400">/100</span></div>
              <div className="space-y-2.5">
                {ASSESSMENT_DIMENSIONS.map((dim) => {
                  const val = (assessment as unknown as Record<string, number>)[dim.field] || 0;
                  return (
                    <div key={dim.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{dim.label}</span>
                        <span className="text-xs font-bold text-gray-900">{val}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-cnc-500" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {assessment.evaluator && (
                <div className="mt-4 text-xs text-gray-400">Evaluado por: {assessment.evaluator}{assessment.evaluation_date ? ` · ${formatDate(assessment.evaluation_date)}` : ''}</div>
              )}
            </div>

            {/* Utilidad anticorrupción */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-semibold text-gray-900">Utilidad anticorrupción</h2>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">{assessment.ac_total_score}<span className="text-lg text-gray-400">/100</span></div>
              <div className="space-y-2.5">
                {AC_ASSESSMENT_DIMENSIONS.map((dim) => {
                  const val = (assessment as unknown as Record<string, number>)[dim.field] || 0;
                  return (
                    <div key={dim.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{dim.label}</span>
                        <span className="text-xs font-bold text-gray-900">{val}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Prioridad de mejora */}
        {assessment && assessment.ac_total_score >= 70 && assessment.total_score < 40 && (
          <div className="card p-5 mb-6 border-l-4 border-l-red-500 bg-red-50/50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <span className="text-sm font-bold text-red-700">Prioridad crítica de apertura</span>
                <p className="text-xs text-red-600 mt-0.5">Alta utilidad anticorrupción con baja madurez. Abrir este dato tendría alto impacto para la integridad.</p>
              </div>
            </div>
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

            {/* Preguntas que permite responder */}
            {questions.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cnc-700" /> Preguntas que puedes investigar
                </h2>
                <ul className="space-y-3">
                  {questions.map((q) => (
                    <li key={q.id} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cnc-50 text-cnc-700 text-xs font-bold shrink-0 mt-0.5">?</div>
                      <span className="text-sm text-gray-700 leading-relaxed">{q.question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Datos relacionados / Cruces */}
            {relationships.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Network className="h-5 w-5 text-cnc-700" /> Datos que puedes cruzar
                </h2>
                <div className="space-y-3">
                  {relationships.map((rel) => {
                    const targetId = rel.source_dataset_id === dataset.id ? rel.target_dataset_id : rel.source_dataset_id;
                    const target = relatedDatasets[targetId];
                    if (!target) return null;
                    return (
                      <Link
                        key={rel.id}
                        to={`/datasets/${target.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-cnc-300 hover:shadow-sm transition-all group"
                      >
                        <Database className="h-5 w-5 text-gray-300 group-hover:text-cnc-700 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-cnc-700 truncate">{target.name}</div>
                          {rel.description && <div className="text-xs text-gray-500 truncate">{rel.description}</div>}
                        </div>
                        {rel.join_field && (
                          <span className="chip bg-blue-50 text-blue-700 text-xs shrink-0">{rel.join_field}</span>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-cnc-700 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
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

            {/* Casos de uso */}
            {useCases.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-cnc-700" /> Casos de uso relacionados
                </h2>
                <div className="space-y-3">
                  {useCases.map((uc) => (
                    <Link key={uc.id} to="/casos-de-uso" className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-cnc-700">{uc.title}</div>
                        {uc.description && <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">{uc.description}</div>}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-cnc-700 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback form */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cnc-700" /> Reportar problema o sugerir mejora
              </h2>
              {fbSent ? (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                  <p className="text-sm text-green-800">¡Gracias! Tu reporte fue enviado. Lo revisaremos pronto.</p>
                </div>
              ) : (
                <form onSubmit={submitFeedback} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" value={fbName} onChange={(e) => setFbName(e.target.value)} placeholder="Nombre (opcional)" className="input text-sm" />
                    <input type="email" value={fbEmail} onChange={(e) => setFbEmail(e.target.value)} placeholder="Correo (opcional)" className="input text-sm" />
                  </div>
                  <select value={fbType} onChange={(e) => setFbType(e.target.value)} className="input text-sm">
                    {Object.entries(FEEDBACK_TYPES).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <textarea value={fbComment} onChange={(e) => setFbComment(e.target.value)} placeholder="Describe el problema o sugerencia..." rows={3} className="input text-sm resize-none" required />
                  <button type="submit" className="btn-primary text-sm">
                    <Send className="h-4 w-4" /> Enviar reporte
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Estado */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Estado de disponibilidad</h3>
              <StatusBadge status={dataset.status} size="md" />
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

            {/* Identificadores */}
            {datasetIdentifiers.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" /> Identificadores disponibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {datasetIdentifiers.map((idn) => (
                    <span key={idn.id} className="chip bg-blue-50 text-blue-700 text-xs">{idn.name}</span>
                  ))}
                </div>
              </div>
            )}

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
