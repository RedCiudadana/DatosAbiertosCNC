import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DynamicIcon } from '@/components/DynamicIcon';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

export function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Category>>({ name: '', slug: '', description: '', icon_name: 'Folder', color: '#1e40af', display_order: 0, is_active: true });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('display_order');
    setItems((data as Category[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({ name: '', slug: '', description: '', icon_name: 'Folder', color: '#1e40af', display_order: items.length, is_active: true });
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setCreating(false);
    setForm(cat);
  };

  const save = async () => {
    const data = { ...form, slug: form.slug || slugify(form.name || '') };
    if (creating) {
      await supabase.from('categories').insert(data);
    } else if (editing) {
      await supabase.from('categories').update(data).eq('id', editing.id);
    }
    setEditing(null);
    setCreating(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <button onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" />Nueva categoría</button>
      </div>

      {(creating || editing) && (
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">{creating ? 'Nueva categoría' : 'Editar categoría'}</h2>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="label">Nombre</label><input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value, slug: creating ? slugify(e.target.value) : form.slug })} /></div>
            <div><label className="label">Slug</label><input className="input" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label">Descripción</label><textarea className="input" rows={2} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Icono (Lucide)</label><input className="input" value={form.icon_name || ''} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} /></div>
            <div><label className="label">Color</label><input type="color" className="input h-10" value={form.color || '#1e40af'} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
            <div><label className="label">Orden</label><input type="number" className="input" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
            <div><label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Activa</span></label></div>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={save} className="btn-primary"><Save className="h-4 w-4" />Guardar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ? <p className="text-gray-400">Cargando...</p> : items.map((cat) => (
          <div key={cat.id} className="card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
              <DynamicIcon name={cat.icon_name} className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900">{cat.name}</div>
              <div className="text-xs text-gray-500 truncate">{cat.description}</div>
            </div>
            <button onClick={() => startEdit(cat)} className="p-1.5 rounded text-gray-400 hover:text-cnc-700"><Edit2 className="h-4 w-4" /></button>
            <button onClick={() => remove(cat.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
