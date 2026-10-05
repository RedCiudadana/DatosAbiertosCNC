import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Download, FileJson } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { DatasetCard } from '@/components/DatasetCard';
import { ANTI_CORRUPTION_VALUES } from '@/lib/constants';

export function ExplorePage() {
  const { categories, datasetTypes, statuses, institutions, datasets } = usePortalData();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const filtered = useMemo(() => {
    let result = datasets.filter((d) => d.published);

    if (q) {
      const lower = q.toLowerCase();
      result = result.filter((d) =>
        d.name.toLowerCase().includes(lower) ||
        (d.short_description || '').toLowerCase().includes(lower) ||
        (d.description || '').toLowerCase().includes(lower)
      );
    }
    if (categoryFilter) result = result.filter((d) => d.category?.slug === categoryFilter);
    if (typeFilter) result = result.filter((d) => d.dataset_type?.slug === typeFilter);
    if (statusFilter) result = result.filter((d) => d.status?.slug === statusFilter);
    if (institutionFilter) result = result.filter((d) => d.institution?.slug === institutionFilter);
    if (acFilter) {
      if (acFilter === 'prevention') result = result.filter((d) => d.anti_corruption_prevention);
      if (acFilter === 'detection') result = result.filter((d) => d.anti_corruption_detection);
      if (acFilter === 'investigation') result = result.filter((d) => d.anti_corruption_investigation);
    }

    result = [...result].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [datasets, q, categoryFilter, typeFilter, statusFilter, institutionFilter, acFilter]);

  const hasFilters = q || categoryFilter || typeFilter || statusFilter || institutionFilter || acFilter;

  const downloadInventory = (format: 'csv' | 'json') => {
    const rows = filtered.map((d) => ({
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
              {filtered.length} conjunto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
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

          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron conjuntos</h3>
              <p className="text-sm text-gray-500 mb-4">Intenta ajustar los filtros o la búsqueda</p>
              <button onClick={clearFilters} className="btn-secondary">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((ds) => <DatasetCard key={ds.id} dataset={ds} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
