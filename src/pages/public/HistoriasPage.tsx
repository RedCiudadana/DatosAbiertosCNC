import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { DataStory } from '@/types';

export function HistoriasPage() {
  const [stories, setStories] = useState<DataStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('data_stories')
      .select('*')
      .eq('published', true)
      .order('publication_date', { ascending: false })
      .then(({ data }) => {
        setStories((data as DataStory[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Historias con datos</h1>
            <p className="text-gray-500 mt-1">Análisis e investigaciones realizadas con los datasets del portal</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-xl" />)}
        </div>
      ) : stories.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay historias publicadas</h3>
          <p className="text-sm text-gray-500">Las historias con datos se publicarán próximamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/historias/${story.slug}`}
              className="card group overflow-hidden hover:border-cnc-300 hover:shadow-md transition-all"
            >
              {story.cover_image && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={story.cover_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-cnc-700 mb-2 line-clamp-2">{story.title}</h3>
                {story.summary && <p className="text-sm text-gray-500 line-clamp-3 mb-3">{story.summary}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {story.author && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {story.author}
                    </span>
                  )}
                  {story.publication_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(story.publication_date)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
