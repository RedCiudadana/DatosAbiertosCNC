import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import type { Tag } from '@/types';

export function AdminTagsPage() {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('tags').select('*').order('name');
    setItems((data as Tag[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newName.trim()) return;
    await supabase.from('tags').insert({ name: newName.trim(), slug: slugify(newName.trim()) });
    setNewName('');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta etiqueta?')) return;
    await supabase.from('tags').delete().eq('id', id); load();
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Etiquetas</h1>

      <div className="card p-4 mb-4 flex gap-2">
        <input className="input flex-1" placeholder="Nueva etiqueta..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" />Agregar</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {loading ? <p className="text-gray-400">Cargando...</p> : items.map((tag) => (
          <div key={tag.id} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
            {tag.name}
            <button onClick={() => remove(tag.id)} className="text-gray-400 hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
