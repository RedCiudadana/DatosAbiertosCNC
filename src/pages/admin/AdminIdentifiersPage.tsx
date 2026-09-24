import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Hash } from 'lucide-react';
import type { Identifier } from '@/types';

export function AdminIdentifiersPage() {
  const [items, setItems] = useState<Identifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Identifier | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('identifiers').select('*').order('display_order');
    setItems((data as Identifier[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(idn: Partial<Identifier>) {
    if (editing) {
      await supabase.from('identifiers').update(idn).eq('id', editing.id);
    } else {
      await supabase.from('identifiers').insert(idn);
    }
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este identificador?')) return;
    await supabase.from('identifiers').delete().eq('id', id);
    load();
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Identificadores</h1>
          <p className="text-sm text-gray-500 mt-1">Identificadores de interoperabilidad entre datasets</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Nuevo identificador
        </button>
      </div>

      {showForm && <IdnForm idn={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      {loading ? (
        <div className="animate-pulse space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((idn) => (
            <div key={idn.id} className="card p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Hash className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{idn.name}</div>
                {idn.description && <div className="text-xs text-gray-500 truncate">{idn.description}</div>}
              </div>
              <button onClick={() => { setEditing(idn); setShowForm(true); }} className="p-2 text-gray-400 hover:text-cnc-700"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(idn.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IdnForm({ idn, onSave, onCancel }: { idn: Identifier | null; onSave: (i: Partial<Identifier>) => void; onCancel: () => void }) {
  const [name, setName] = useState(idn?.name || '');
  const [slug, setSlug] = useState(idn?.slug || '');
  const [description, setDescription] = useState(idn?.description || '');
  const [order, setOrder] = useState(idn?.display_order || 0);
  const [active, setActive] = useState(idn?.is_active ?? true);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, display_order: order, is_active: active }); }} className="card p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">{idn ? 'Editar identificador' : 'Nuevo identificador'}</h3>
      <input className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
      <textarea className="input" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="number" className="input" placeholder="Orden" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Activo</label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancelar</button>
      </div>
    </form>
  );
}
