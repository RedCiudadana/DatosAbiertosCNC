import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Download, FileJson } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortalData } from '@/hooks/usePortalData';
import { DatasetCard } from '@/components/DatasetCard';
import { ANTI_CORRUPTION_VALUES } from '@/lib/constants';
import type { DatasetWithRelations } from '@/types';

export function ExplorePage() {
  const { categories, datasetTypes, statuses, institutions } = usePortalData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [datasets, setDatasets] = useState<DatasetWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const q = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const typeFilter = searchParams.get('type') || '';
  const statusFilter = searchParams.get('status') || '';
  const institutionFilter = searchParams.get('institution') || '';
  const acFilter = searchParams.get('ac') || '';

  const updateFilter = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  useEffect(() => {
    async function loadDatasets() {
      setLoading(true);
      let query = supabase
        .from('datasets')
        .select('*, category:categories(*), dataset_type:dataset_types(*), institution:institutions(*), status:statuses(*), tags:dataset_tags(tag:tags(*)), resources:resources(*)')
        .eq('published', true);

      if (q) {
        query = query.or(`name.ilike.%${q}%,short_description.ilike.%${q}%,description.ilike.%${q}%`);
      }
      if (categoryFilter) {
        const cat = categories.find((c) => c.slug === categoryFilter);
        if (cat) query = query.eq('category_id', cat.id);
      }
      if (typeFilter) {
        const dt = datasetTypes.find((t) => t.slug === typeFilter);
        if (dt) query = query.eq('dataset_type_id', dt.id);
      }
      if (statusFilter) {
        const st = statuses.find((s) => s.slug === statusFilter);
        if (st) query = query.eq('status_id', st.id);
      }
      if (institutionFilter) {
        const inst = institutions.find((i) => i.slug === institutionFilter);
        if (inst) query = query.eq('institution_id', inst.id);
      }
      if (acFilter) {
        if (acFilter === 'prevention') query = query.eq('anti_corruption_prevention', true);
        if (acFilter === 'detection') query = query.eq('anti_corruption_detection', true);
        if (acFilter === 'investigation') query = query.eq('anti_corruption_investigation', true);
      }

      query = query.order('featured', { ascending: false }).order('display_order').order('name');
      const { data, count } = await query;
      const transformed = (data || []).map((d) => ({
        ...d,
        tags: (d as unknown as { tags?: { tag: unknown }[] }).tags?.map((t) => t.tag).filter(Boolean) || [],
      })) as unknown as DatasetWithRelations[];
      setDatasets(transformed);
      setTotalCount(count || transformed.length);
      setLoading(false);
    }
    loadDatasets();
  }, [q, categoryFilter, typeFilter, statusFilter, institutionFilter, acFilter, categories, datasetTypes, statuses, institutions]);

  const hasFilters = q || categoryFilter || typeFilter || statusFilter || institutionFilter || acFilter;

  const downloadInventory = (format: 'csv' | 'json') => {
    const rows = datasets.map((d) => ({
      name: d.name, slug: d.slug, description: d.short_description,
      category: d.category?.name || '', type: d.dataset_type?.name || '',
      institution: d.institution?.name || '', status: d.status?.name || '',
      source_url: d.source_url || '',
    }));
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'inventario-datos-cnc.json'; a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = Object.keys(rows[0] || { name: '' });
      const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${String((r as Record<string, unknown>)[h] || '').replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'inventario-datos-cnc.csv'; a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Explorar datos anticorrupción</h1>
        <p className="text-gray-500 mt-1">Explora y filtra los conjuntos de datos del portal</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          defaultValue={q}
          onChange={(e) => updateFilter('q', e.target.value)}
          placeholder="Buscar conjuntos de datos..."
          className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3.5 text-sm focus:border-cnc-500 focus:outline-none focus:ring-1 focus:ring-cnc-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4 text-cnc-700" /> Filtros
              </h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-cnc-700 hover:text-cnc-800 font-medium flex items-center gap-1">
                  <X className="h-3 w-3" /> Limpiar
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="label">Categoría</label>
              <select className="input" value={categoryFilter} onChange={(e) => updateFilter('category', e.target.value)}>
                <option value="">Todas</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="label">Tipo de conjunto</label>
              <select className="input" value={typeFilter} onChange={(e) => updateFilter('type', e.target.value)}>
                <option value="">Todos</option>
                {datasetTypes.map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="label">Estado</label>
              <select className="input" value={statusFilter} onChange={(e) => updateFilter('status', e.target.value)}>
                <option value="">Todos</option>
                {statuses.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="label">Institución</label>
              <select className="input" value={institutionFilter} onChange={(e) => updateFilter('institution', e.target.value)}>
                <option value="">Todas</option>
                {institutions.map((i) => <option key={i.id} value={i.slug}>{i.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="label">Valor anticorrupción</label>
              <select className="input" value={acFilter} onChange={(e) => updateFilter('ac', e.target.value)}>
                <option value="">Todos</option>
                {ANTI_CORRUPTION_VALUES.map((v) => <option key={v.key} value={v.key}>{v.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? 'Cargando...' : `${totalCount} conjunto${totalCount !== 1 ? 's' : ''} encontrado${totalCount !== 1 ? 's' : ''}`}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => downloadInventory('csv')} className="btn-ghost text-xs" title="Descargar CSV">
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
              <button onClick={() => downloadInventory('json')} className="btn-ghost text-xs" title="Descargar JSON">
                <FileJson className="h-3.5 w-3.5" /> JSON
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : datasets.length === 0 ? (
            <div className="card p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron conjuntos</h3>
              <p className="text-sm text-gray-500 mb-4">Intenta ajustar los filtros o la búsqueda</p>
              <button onClick={clearFilters} className="btn-secondary">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {datasets.map((ds) => <DatasetCard key={ds.id} dataset={ds} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
