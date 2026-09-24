import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Mail, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { FEEDBACK_TYPES, FEEDBACK_STATUSES } from '@/lib/constants';
import type { DatasetFeedback } from '@/types';

export function AdminFeedbackPage() {
  const [items, setItems] = useState<DatasetFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DatasetFeedback | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('dataset_feedback').select('*').order('created_at', { ascending: false });
    setItems((data as DatasetFeedback[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from('dataset_feedback').update({ status }).eq('id', id);
    setSelected(null); load();
  }

  async function respond(id: string, response: string) {
    await supabase.from('dataset_feedback').update({ response, status: 'en_revision' }).eq('id', id);
    setSelected(null); load();
  }

  const statusIcons: Record<string, typeof Clock> = {
    nuevo: Clock, en_revision: Eye, resuelto: CheckCircle2, descartado: XCircle,
  };
  const statusColors: Record<string, string> = {
    nuevo: 'bg-blue-100 text-blue-700', en_revision: 'bg-amber-100 text-amber-700',
    resuelto: 'bg-green-100 text-green-700', descartado: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comentarios ciudadanos</h1>
        <p className="text-sm text-gray-500 mt-1">Reportes y sugerencias de los usuarios</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500">No hay comentarios.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((fb) => {
            const StatusIcon = statusIcons[fb.status] || Clock;
            return (
              <div key={fb.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cnc-50 text-cnc-700 shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{FEEDBACK_TYPES[fb.feedback_type] || fb.feedback_type}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[fb.status] || ''}`}>
                        <StatusIcon className="h-3 w-3 inline mr-1" />{FEEDBACK_STATUSES[fb.status] || fb.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{fb.comment}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {fb.name && <span>{fb.name}</span>}
                      {fb.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{fb.email}</span>}
                      <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                    </div>
                    {fb.response && <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">Respuesta: {fb.response}</div>}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {fb.status !== 'resuelto' && <button onClick={() => updateStatus(fb.id, 'resuelto')} className="text-xs text-green-600 hover:text-green-700 font-medium">Marcar resuelto</button>}
                    {fb.status !== 'descartado' && <button onClick={() => updateStatus(fb.id, 'descartado')} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Descartar</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
