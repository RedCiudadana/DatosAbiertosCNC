import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import type { DataStory } from '@/types';

export function AdminDataStoriesPage() {
  const [items, setItems] = useState<DataStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DataStory | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('data_stories').select('*').order('publication_date', { ascending: false });
    setItems((data as DataStory[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(s: Partial<DataStory>) {
    if (editing) {
      await supabase.from('data_stories').update(s).eq('id', editing.id);
    } else {
      await supabase.from('data_stories').insert(s);
    }
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar esta historia?')) return;
    await supabase.from('data_stories').delete().eq('id', id);
    load();
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historias con datos</h1>
          <p className="text-sm text-gray-500 mt-1">Análisis e investigaciones publicados</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Nueva historia
        </button>
      </div>

      {showForm && <StoryForm story={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      {loading ? (
        <div className="animate-pulse space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <div key={s.id} className="card p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                {s.author && <div className="text-xs text-gray-500">{s.author}</div>}
              </div>
              {!s.published && <span className="chip bg-gray-100 text-gray-500 text-xs">Borrador</span>}
              {s.featured && <span className="chip bg-amber-100 text-amber-700 text-xs">Destacada</span>}
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="p-2 text-gray-400 hover:text-cnc-700"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(s.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryForm({ story, onSave, onCancel }: { story: DataStory | null; onSave: (s: Partial<DataStory>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(story?.title || '');
  const [slug, setSlug] = useState(story?.slug || '');
  const [summary, setSummary] = useState(story?.summary || '');
  const [content, setContent] = useState(story?.content || '');
  const [coverImage, setCoverImage] = useState(story?.cover_image || '');
  const [author, setAuthor] = useState(story?.author || '');
  const [pubDate, setPubDate] = useState(story?.publication_date || '');
  const [published, setPublished] = useState(story?.published ?? false);
  const [featured, setFeatured] = useState(story?.featured ?? false);
  const [order, setOrder] = useState(story?.display_order || 0);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, slug: slug || title.toLowerCase().replace(/\s+/g, '-'), summary, content, cover_image: coverImage || null, author: author || null, publication_date: pubDate || null, published, featured, display_order: order }); }} className="card p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">{story ? 'Editar historia' : 'Nueva historia'}</h3>
      <input className="input" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="input" placeholder="URL de imagen de portada" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
      <textarea className="input" placeholder="Resumen" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
      <textarea className="input" placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input type="date" className="input" value={pubDate} onChange={(e) => setPubDate(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publicado</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Destacada</label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancelar</button>
      </div>
    </form>
  );
}
