import { useEffect, useState } from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { RESOURCE_TYPES } from '@/lib/constants';
import type { Resource } from '@/types';

interface ResourceWithDataset extends Resource {
  dataset?: { name: string; slug: string } | null;
}

export function AdminResourcesPage() {
  const [items, setItems] = useState<ResourceWithDataset[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('resources')
      .select('*, dataset:datasets(name, slug)')
      .order('created_at', { ascending: false });
    setItems((data as ResourceWithDataset[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este recurso?')) return;
    await supabase.from('resources').delete().eq('id', id); load();
  };

  const toggleActive = async (res: ResourceWithDataset) => {
    await supabase.from('resources').update({ is_active: !res.is_active }).eq('id', res.id); load();
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recursos</h1>
      <p className="text-sm text-gray-500 mb-4">Los recursos se administran desde la ficha de cada conjunto de datos.</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Conjunto</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Formato</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Activo</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Cargando...</td></tr> :
               items.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Sin recursos</td></tr> :
               items.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{res.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">{res.dataset?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{RESOURCE_TYPES[res.type]?.label || res.type}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell uppercase text-xs">{res.format || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(res)} className={`text-xs font-medium ${res.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                      {res.is_active ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {res.url && <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-gray-400 hover:text-cnc-700"><ExternalLink className="h-4 w-4" /></a>}
                      {res.dataset && <a href={`/admin/datasets/${(res.dataset as { slug?: string }).slug || ''}`} className="p-1.5 rounded text-gray-400 hover:text-cnc-700" title="Editar conjunto"><Edit2 className="h-4 w-4" /></a>}
                      <button onClick={() => remove(res.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
