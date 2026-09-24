import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PRIORITY_LEVELS } from '@/lib/constants';
import type { OpeningAgendaItem } from '@/types';

export function BrechasPage() {
  const [agenda, setAgenda] = useState<OpeningAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('opening_agenda')
      .select('*')
      .eq('published', true)
      .order('display_order')
      .then(({ data }) => {
        setAgenda((data as OpeningAgendaItem[]) || []);
        setLoading(false);
      });
  }, []);

  const priorityOrder = ['critica', 'alta', 'media', 'baja'];
  const sorted = [...agenda].sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden text-white py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/35526170/pexels-photo-35526170.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Vista aérea de Santa Cruz del Quiché, Guatemala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-300 backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Agenda de apertura para la integridad</h1>
              <p className="text-cnc-200 mt-1">Prioridades para abrir información estratégica que todavía no está disponible</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">

      {loading ? (
        <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay items en la agenda</h3>
          <p className="text-sm text-gray-500">La agenda de apertura se publicará próximamente.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Información</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Situación</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Institución</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Prioridad</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Recomendación</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Avance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((item) => {
                  const pr = PRIORITY_LEVELS[item.priority] || PRIORITY_LEVELS['media'];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">{item.information}</td>
                      <td className="px-4 py-4 text-gray-600 hidden md:table-cell text-xs">{item.situation || '—'}</td>
                      <td className="px-4 py-4 text-gray-600 hidden lg:table-cell text-xs">{item.institution || '—'}</td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${pr.color}15`, color: pr.color }}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pr.color }} />
                          {pr.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 hidden md:table-cell text-xs">{item.recommendation || '—'}</td>
                      <td className="px-4 py-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${item.progress}%`, backgroundColor: item.progress > 0 ? '#16a34a' : '#d1d5db' }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link to="/explorar" className="btn-secondary">
          Explorar todos los datos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      </div>
    </div>
  );
}
