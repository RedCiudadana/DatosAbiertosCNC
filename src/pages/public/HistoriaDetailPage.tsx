import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { DataStory, DatasetWithRelations } from '@/types';

export function HistoriaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<DataStory | null>(null);
  const [datasets, setDatasets] = useState<DatasetWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const { data } = await supabase
        .from('data_stories')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (!data) { setNotFound(true); setLoading(false); return; }
      setStory(data as DataStory);

      const { data: dsRel } = await supabase
        .from('data_story_datasets')
        .select('dataset:datasets(*)')
        .eq('data_story_id', (data as DataStory).id);

      setDatasets(((dsRel || []) as unknown as { dataset: DatasetWithRelations }[]).map((r) => r.dataset).filter(Boolean));
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !story) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Historia no encontrada</h1>
        <Link to="/historias" className="btn-primary">Volver a historias</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {story.cover_image && (
        <div className="aspect-[2/1] w-full bg-gray-100 overflow-hidden">
          <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/historias" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cnc-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Historias
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-cnc-700" />
          <span className="text-xs font-semibold text-gray-500 uppercase">Historia con datos</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          {story.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {story.author}
            </span>
          )}
          {story.publication_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(story.publication_date)}
            </span>
          )}
        </div>

        {story.summary && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{story.summary}</p>
        )}

        {story.content && (
          <div className="prose prose-sm max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.content}</p>
          </div>
        )}

        {datasets.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Database className="h-4 w-4" /> Datasets utilizados
            </h2>
            <div className="flex flex-wrap gap-2">
              {datasets.map((ds) => (
                <Link
                  key={ds.id}
                  to={`/datasets/${ds.slug}`}
                  className="chip bg-cnc-50 text-cnc-700 hover:bg-cnc-100"
                >
                  {ds.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
