import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import type { IntegrityDomain } from '@/types';

export function AdminIntegrityDomainsPage() {
  const [items, setItems] = useState<IntegrityDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IntegrityDomain | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('integrity_domains').select('*').order('display_order');
    setItems((data as IntegrityDomain[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(domain: Partial<IntegrityDomain>) {
    if (editing) {
      await supabase.from('integrity_domains').update(domain).eq('id', editing.id);
    } else {
      await supabase.from('integrity_domains').insert(domain);
    }
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este eje?')) return;
    await supabase.from('integrity_domains').delete().eq('id', id);
    load();
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ejes de integridad</h1>
          <p className="text-sm text-gray-500 mt-1">Organiza los datos por pregunta anticorrupción</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Nuevo eje
        </button>
      </div>

      {showForm && <DomainForm domain={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      {loading ? (
        <div className="animate-pulse space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-2">
          {items.map((d) => (
            <div key={d.id} className="card p-4 flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-gray-300" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0" style={{ backgroundColor: d.color }}>
                <DynamicIcon name={d.icon_name} className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{d.name}</div>
                {d.question && <div className="text-xs text-cnc-700">{d.question}</div>}
              </div>
              <button onClick={() => { setEditing(d); setShowForm(true); }} className="p-2 text-gray-400 hover:text-cnc-700"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(d.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DomainForm({ domain, onSave, onCancel }: { domain: IntegrityDomain | null; onSave: (d: Partial<IntegrityDomain>) => void; onCancel: () => void }) {
  const [name, setName] = useState(domain?.name || '');
  const [slug, setSlug] = useState(domain?.slug || '');
  const [description, setDescription] = useState(domain?.description || '');
  const [question, setQuestion] = useState(domain?.question || '');
  const [iconName, setIconName] = useState(domain?.icon_name || 'Shield');
  const [color, setColor] = useState(domain?.color || '#0f766e');
  const [order, setOrder] = useState(domain?.display_order || 0);
  const [active, setActive] = useState(domain?.is_active ?? true);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, question, icon_name: iconName, color, display_order: order, is_active: active }); }} className="card p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">{domain ? 'Editar eje' : 'Nuevo eje'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="input" placeholder="Pregunta" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input className="input" placeholder="Icono (lucide)" value={iconName} onChange={(e) => setIconName(e.target.value)} />
        <input type="color" className="input h-10" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="number" className="input" placeholder="Orden" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
      </div>
      <textarea className="input" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Activo</label>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancelar</button>
      </div>
    </form>
  );
}
