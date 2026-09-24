import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import type { Institution } from '@/types';

export function AdminInstitutionsPage() {
  const [items, setItems] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Institution>>({ name: '', slug: '', acronym: '', description: '', logo_url: '', website: '', email: '', phone: '', is_active: true, display_order: 0 });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('institutions').select('*').order('display_order');
    setItems((data as Institution[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const save = async () => {
    const data = { ...form, slug: form.slug || slugify(form.name || '') };
    if (creating) await supabase.from('institutions').insert(data);
    else if (editing) await supabase.from('institutions').update(data).eq('id', editing.id);
    setEditing(null); setCreating(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta institución?')) return;
    await supabase.from('institutions').delete().eq('id', id); load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Instituciones</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm({ name: '', slug: '', acronym: '', description: '', logo_url: '', website: '', email: '', phone: '', is_active: true, display_order: items.length }); }} className="btn-primary"><Plus className="h-4 w-4" />Nueva institución</button>
      </div>

      {(creating || editing) && (
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">{creating ? 'Nueva institución' : 'Editar institución'}</h2>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-gray-400"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="label">Nombre</label><input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value, slug: creating ? slugify(e.target.value) : form.slug })} /></div>
            <div><label className="label">Siglas</label><input className="input" value={form.acronym || ''} onChange={(e) => setForm({ ...form, acronym: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label">Descripción</label><textarea className="input" rows={2} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Logo (URL)</label><input className="input" value={form.logo_url || ''} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} /></div>
            <div><label className="label">Sitio web</label><input className="input" value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Teléfono</label><input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label">Orden</label><input type="number" className="input" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
            <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /><span className="text-sm">Activa</span></label>
          </div>
          <div className="mt-3 flex justify-end"><button onClick={save} className="btn-primary"><Save className="h-4 w-4" />Guardar</button></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ? <p className="text-gray-400">Cargando...</p> : items.map((inst) => (
          <div key={inst.id} className="card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">{inst.acronym || inst.name.slice(0, 3)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900">{inst.name}</div>
              <div className="text-xs text-gray-500 truncate">{inst.website || inst.email}</div>
            </div>
            <button onClick={() => { setEditing(inst); setCreating(false); setForm(inst); }} className="p-1.5 rounded text-gray-400 hover:text-cnc-700"><Edit2 className="h-4 w-4" /></button>
            <button onClick={() => remove(inst.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
