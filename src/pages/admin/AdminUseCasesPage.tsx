import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import type { UseCase } from '@/types';

export function AdminUseCasesPage() {
  const [items, setItems] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UseCase | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<UseCase>>({ title: '', slug: '', description: '', methodology: '', results: '', published: false, display_order: 0 });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('use_cases').select('*').order('display_order');
    setItems((data as UseCase[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const save = async () => {
    const data = { ...form, slug: form.slug || slugify(form.title || '') };
    if (creating) await supabase.from('use_cases').insert(data);
    else if (editing) await supabase.from('use_cases').update(data).eq('id', editing.id);
    setEditing(null); setCreating(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este caso de uso?')) return;
    await supabase.from('use_cases').delete().eq('id', id); load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Casos de uso</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm({ title: '', slug: '', description: '', methodology: '', results: '', published: false, display_order: items.length }); }} className="btn-primary"><Plus className="h-4 w-4" />Nuevo caso</button>
      </div>

      {(creating || editing) && (
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">{creating ? 'Nuevo caso de uso' : 'Editar caso de uso'}</h2>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-gray-400"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div><label className="label">Título</label><input className="input" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value, slug: creating ? slugify(e.target.value) : form.slug })} /></div>
            <div><label className="label">Descripción</label><textarea className="input" rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Metodología</label><textarea className="input" rows={3} value={form.methodology || ''} onChange={(e) => setForm({ ...form, methodology: e.target.value })} /></div>
            <div><label className="label">Resultado</label><textarea className="input" rows={2} value={form.results || ''} onChange={(e) => setForm({ ...form, results: e.target.value })} /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /><span className="text-sm">Publicado</span></label>
          </div>
          <div className="mt-3 flex justify-end"><button onClick={save} className="btn-primary"><Save className="h-4 w-4" />Guardar</button></div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? <p className="text-gray-400">Cargando...</p> : items.map((uc) => (
          <div key={uc.id} className="card p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">{uc.title} {!uc.published && <span className="text-xs text-gray-400">(borrador)</span>}</div>
              <div className="text-xs text-gray-500 truncate">{uc.description}</div>
            </div>
            <button onClick={() => { setEditing(uc); setCreating(false); setForm(uc); }} className="p-1.5 rounded text-gray-400 hover:text-cnc-700"><Edit2 className="h-4 w-4" /></button>
            <button onClick={() => remove(uc.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
