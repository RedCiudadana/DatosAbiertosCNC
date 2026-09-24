import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { UseCase, DatasetWithRelations } from '@/types';

interface UseCaseWithDatasets extends UseCase {
  datasets?: DatasetWithRelations[];
}

export function UseCasesPage() {
  const [cases, setCases] = useState<UseCaseWithDatasets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('use_cases')
        .select('*, datasets:use_case_datasets(dataset:datasets(*, category:categories(*), dataset_type:dataset_types(*), institution:institutions(*), status:statuses(*), pida_topic:pida_topics(*), tags:dataset_tags(tag:tags(*)), resources:resources(*)))')
        .eq('published', true)
        .order('display_order');

      const transformed = (data || []).map((uc) => ({
        ...uc,
        datasets: (uc as unknown as { datasets?: { dataset: unknown }[] }).datasets?.map((d) => {
          const ds = d.dataset as Record<string, unknown>;
          return { ...ds, tags: (ds as unknown as { tags?: { tag: unknown }[] }).tags?.map((t) => t.tag).filter(Boolean) || [] };
        }).filter(Boolean),
      })) as unknown as UseCaseWithDatasets[];

      setCases(transformed);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Casos de uso</h1>
        <p className="text-gray-500 mt-1">Ejemplos de cómo utilizar los datos anticorrupción</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl" />)}</div>
      ) : cases.length === 0 ? (
        <div className="card p-12 text-center">
          <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay casos de uso publicados</h3>
          <p className="text-sm text-gray-500">Los casos de uso se publicarán próximamente.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((uc) => (
            <div key={uc.id} className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{uc.title}</h2>
              {uc.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{uc.description}</p>}

              {uc.datasets && uc.datasets.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Datasets utilizados</h3>
                  <div className="flex flex-wrap gap-2">
                    {uc.datasets.map((ds) => (
                      <Link key={ds.id} to={`/datasets/${ds.slug}`} className="chip bg-cnc-50 text-cnc-700 hover:bg-cnc-100">
                        {ds.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {uc.methodology && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Metodología</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{uc.methodology}</p>
                </div>
              )}

              {uc.results && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Resultado</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{uc.results}</p>
                </div>
              )}

              {uc.links && uc.links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                  {uc.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-cnc-700 hover:text-cnc-800">
                      <ExternalLink className="h-4 w-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
