import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Flag } from 'lucide-react';
import { PRIORITY_LEVELS } from '@/lib/constants';
import type { OpeningAgendaItem } from '@/types';

export function AdminOpeningAgendaPage() {
  const [items, setItems] = useState<OpeningAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<OpeningAgendaItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('opening_agenda').select('*').order('display_order');
    setItems((data as OpeningAgendaItem[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(item: Partial<OpeningAgendaItem>) {
    if (editing) {
      await supabase.from('opening_agenda').update(item).eq('id', editing.id);
    } else {
      await supabase.from('opening_agenda').insert(item);
    }
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este item?')) return;
    await supabase.from('opening_agenda').delete().eq('id', id);
    load();
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda de apertura</h1>
          <p className="text-sm text-gray-500 mt-1">Prioridades para abrir información estratégica</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Nuevo item
        </button>
      </div>

      {showForm && <AgendaForm item={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      {loading ? (
        <div className="animate-pulse space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const pr = PRIORITY_LEVELS[item.priority] || PRIORITY_LEVELS['media'];
            return (
              <div key={item.id} className="card p-4 flex items-center gap-3">
                <Flag className="h-4 w-4 text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{item.information}</div>
                  {item.situation && <div className="text-xs text-gray-500 truncate">{item.situation}</div>}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${pr.color}15`, color: pr.color }}>{pr.label}</span>
                <div className="w-20">
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 text-gray-400 hover:text-cnc-700"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AgendaForm({ item, onSave, onCancel }: { item: OpeningAgendaItem | null; onSave: (i: Partial<OpeningAgendaItem>) => void; onCancel: () => void }) {
  const [information, setInformation] = useState(item?.information || '');
  const [situation, setSituation] = useState(item?.situation || '');
  const [institution, setInstitution] = useState(item?.institution || '');
  const [priority, setPriority] = useState(item?.priority || 'media');
  const [recommendation, setRecommendation] = useState(item?.recommendation || '');
  const [progress, setProgress] = useState(item?.progress ?? 0);
  const [order, setOrder] = useState(item?.display_order || 0);
  const [published, setPublished] = useState(item?.published ?? true);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ information, situation, institution, priority, recommendation, progress, display_order: order, published }); }} className="card p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">{item ? 'Editar item' : 'Nuevo item'}</h3>
      <input className="input" placeholder="Información requerida" value={information} onChange={(e) => setInformation(e.target.value)} required />
      <textarea className="input" placeholder="Situación actual" value={situation} onChange={(e) => setSituation(e.target.value)} rows={2} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Institución" value={institution} onChange={(e) => setInstitution(e.target.value)} />
        <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
          {Object.entries(PRIORITY_LEVELS).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
        </select>
      </div>
      <textarea className="input" placeholder="Recomendación" value={recommendation} onChange={(e) => setRecommendation(e.target.value)} rows={2} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Avance: {progress}%</label>
          <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full" />
        </div>
        <input type="number" className="input" placeholder="Orden" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publicado</label>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancelar</button>
      </div>
    </form>
  );
}
