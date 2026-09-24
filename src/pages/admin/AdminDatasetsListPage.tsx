import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Copy, Eye, EyeOff, ExternalLink, Gauge } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';

interface DatasetListItem {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  icon_type: string;
  icon_url: string | null;
  is_pida: boolean;
  published: boolean;
  featured: boolean;
  openness_level: number;
  updated_at: string;
  category?: { name: string; slug: string } | null;
  institution?: { name: string; slug: string } | null;
  status?: { name: string; color: string; slug: string } | null;
}

export function AdminDatasetsListPage() {
  const [datasets, setDatasets] = useState<DatasetListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('datasets')
      .select('id, name, slug, icon_name, icon_type, icon_url, is_pida, published, featured, openness_level, updated_at, category:categories(name, slug), institution:institutions(name, slug), status:statuses(name, color, slug)')
      .order('updated_at', { ascending: false });
    if (error) {
      setErrorMsg(error.message);
      setDatasets([]);
    } else {
      setDatasets((data as unknown as DatasetListItem[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = datasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.category?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.institution?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((d) => d.id)));
  };

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from('datasets').update({ published: !current }).eq('id', id);
    load();
  };

  const duplicate = async (ds: DatasetListItem) => {
    const { data } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', ds.id)
      .maybeSingle();
    if (!data) return;
    const { id, created_at, updated_at, slug, ...rest } = data as Record<string, unknown>;
    await supabase.from('datasets').insert({
      ...rest,
      name: `${ds.name} (copia)`,
      slug: `${ds.slug}-copia-${Date.now().toString().slice(-4)}`,
      published: false,
    });
    load();
  };

  const deleteDataset = async (id: string) => {
    if (!confirm('¿Eliminar este conjunto de datos? Esta acción no se puede deshacer.')) return;
    await supabase.from('datasets').delete().eq('id', id);
    load();
  };

  const bulkAction = async (action: string) => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    if (action === 'publish') {
      await supabase.from('datasets').update({ published: true }).in('id', ids);
    } else if (action === 'unpublish') {
      await supabase.from('datasets').update({ published: false }).in('id', ids);
    } else if (action === 'delete') {
      if (!confirm(`¿Eliminar ${ids.length} conjuntos?`)) return;
      await supabase.from('datasets').delete().in('id', ids);
    }
    setSelected(new Set());
    load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Conjuntos de datos</h1>
        <Link to="/admin/datasets/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Nuevo conjunto
        </Link>
      </div>

      {/* Search + bulk actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="input flex-1"
        />
        {selected.size > 0 && (
          <div className="flex gap-2">
            <button onClick={() => bulkAction('publish')} className="btn-secondary text-xs">Publicar ({selected.size})</button>
            <button onClick={() => bulkAction('unpublish')} className="btn-secondary text-xs">Despublicar</button>
            <button onClick={() => bulkAction('delete')} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Eliminar</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Institución</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden xl:table-cell">Apertura</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Actualizado</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Publicado</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-400">Cargando...</td></tr>
              ) : errorMsg ? (
                <tr><td colSpan={9} className="text-center py-8 text-red-500">Error: {errorMsg}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-400">No se encontraron conjuntos</td></tr>
              ) : filtered.map((ds) => (
                <tr key={ds.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(ds.id)} onChange={() => toggleSelect(ds.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cnc-50 text-cnc-700 shrink-0">
                        <DynamicIcon name={ds.icon_name} url={ds.icon_url} iconType={ds.icon_type as 'lucide'} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {ds.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{ds.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{ds.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell text-xs">{ds.institution?.name || '—'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{ds.status ? <StatusBadge status={ds.status as unknown as import('@/types').Status} /> : '—'}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">{ds.openness_level}/5</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{formatDate(ds.updated_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => togglePublished(ds.id, ds.published)} className="text-gray-400 hover:text-cnc-700">
                      {ds.published ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/datasets/${ds.slug}`} target="_blank" className="p-1.5 rounded text-gray-400 hover:text-cnc-700 hover:bg-gray-100" title="Vista previa">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link to={`/admin/datasets/${ds.id}`} className="p-1.5 rounded text-gray-400 hover:text-cnc-700 hover:bg-gray-100" title="Editar">
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button onClick={() => duplicate(ds)} className="p-1.5 rounded text-gray-400 hover:text-cnc-700 hover:bg-gray-100" title="Duplicar">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteDataset(ds.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">{filtered.length} conjunto(s)</p>
    </div>
  );
}
