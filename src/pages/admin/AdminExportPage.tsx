import { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, Table2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ExportTable {
  label: string;
  table: string;
  description: string;
  select?: string;
  relation?: string;
}

const EXPORT_TABLES: ExportTable[] = [
  {
    label: 'Datasets',
    table: 'datasets',
    description: 'Catálogo completo de conjuntos de datos con todos sus campos',
    select: '*, categories(name), dataset_types(name), institutions(name), statuses(name)',
  },
  {
    label: 'Recursos',
    table: 'resources',
    description: 'Recursos asociados a cada dataset (archivos, APIs, dashboards)',
    select: '*, datasets(name)',
  },
  {
    label: 'Categorías',
    table: 'categories',
    description: 'Categorías temáticas del portal',
  },
  {
    label: 'Tipos de dataset',
    table: 'dataset_types',
    description: 'Tipos de dataset del portal',
  },
  {
    label: 'Estados',
    table: 'statuses',
    description: 'Estados de publicación de los datasets',
  },
  {
    label: 'Instituciones',
    table: 'institutions',
    description: 'Instituciones responsables de los datos',
  },
  {
    label: 'Etiquetas',
    table: 'tags',
    description: 'Etiquetas transversales asignadas a los datasets',
  },
  {
    label: 'Ejes de integridad',
    table: 'integrity_domains',
    description: 'Ejes de integridad y anticorrupción del portal',
  },
  {
    label: 'Identificadores',
    table: 'identifiers',
    description: 'Identificadores disponibles para vincular datasets',
  },
  {
    label: 'Evaluaciones',
    table: 'dataset_assessments',
    description: 'Evaluaciones de calidad y utilidad anticorrupción de cada dataset',
    select: '*, datasets(name)',
  },
  {
    label: 'Casos de uso',
    table: 'use_cases',
    description: 'Casos de uso publicados en el portal',
  },
  {
    label: 'Configuración',
    table: 'settings',
    description: 'Parámetros de configuración del portal',
  },
];

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    if (value === null || value === undefined) {
      result[fullKey] = '';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else if (Array.isArray(value)) {
      result[fullKey] = value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join('; ');
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const flatRows = rows.map((r) => flattenObject(r));
  const headers = Array.from(new Set(flatRows.flatMap((r) => Object.keys(r))));
  const escape = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const lines = [headers.join(',')];
  for (const row of flatRows) {
    lines.push(headers.map((h) => escape(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
}

export function AdminExportPage() {
  const [busyTable, setBusyTable] = useState<string | null>(null);
  const [result, setResult] = useState<{ table: string; format: string; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportTable = async (cfg: ExportTable, format: 'csv' | 'json') => {
    setBusyTable(cfg.table);
    setError(null);
    setResult(null);

    try {
      let allData: Record<string, unknown>[] = [];
      let from = 0;
      const pageSize = 1000;

      while (true) {
        const query = supabase.from(cfg.table).select(cfg.select || '*').range(from, from + pageSize - 1);
        const { data, error: queryError } = await query;
        if (queryError) throw new Error(queryError.message);
        if (!data || data.length === 0) break;
        allData = allData.concat(data as unknown as Record<string, unknown>[]);
        if (data.length < pageSize) break;
        from += pageSize;
      }

      if (allData.length === 0) {
        setError(`La tabla "${cfg.label}" no tiene registros para exportar.`);
        return;
      }

      const slug = cfg.table.replace(/_/g, '-');
      if (format === 'csv') {
        downloadFile(toCSV(allData), `${slug}_${timestamp()}.csv`, 'text/csv;charset=utf-8');
      } else {
        downloadFile(JSON.stringify(allData, null, 2), `${slug}_${timestamp()}.json`, 'application/json');
      }
      setResult({ table: cfg.label, format: format.toUpperCase(), count: allData.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar los datos');
    } finally {
      setBusyTable(null);
    }
  };

  const exportAll = async (format: 'csv' | 'json') => {
    setBusyTable('all');
    setError(null);
    setResult(null);

    try {
      for (const cfg of EXPORT_TABLES) {
        let allData: Record<string, unknown>[] = [];
        let from = 0;
        const pageSize = 1000;
        while (true) {
          const { data, error: queryError } = await supabase
            .from(cfg.table)
            .select(cfg.select || '*')
            .range(from, from + pageSize - 1);
          if (queryError) continue;
          if (!data || data.length === 0) break;
          allData = allData.concat(data as unknown as Record<string, unknown>[]);
          if (data.length < pageSize) break;
          from += pageSize;
        }
        if (allData.length === 0) continue;
        const slug = cfg.table.replace(/_/g, '-');
        if (format === 'csv') {
          downloadFile(toCSV(allData), `${slug}_${timestamp()}.csv`, 'text/csv;charset=utf-8');
        } else {
          downloadFile(JSON.stringify(allData, null, 2), `${slug}_${timestamp()}.json`, 'application/json');
        }
      }
      setResult({ table: 'Todas las tablas', format: format.toUpperCase(), count: EXPORT_TABLES.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar los datos');
    } finally {
      setBusyTable(null);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exportar datos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Descarga los datos publicados en el portal en formato CSV o JSON para analizarlos externamente
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportAll('csv')}
            disabled={busyTable !== null}
            className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busyTable === 'all' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Exportar todo (CSV)
          </button>
          <button
            onClick={() => exportAll('json')}
            disabled={busyTable !== null}
            className="btn-secondary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busyTable === 'all' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Exportar todo (JSON)
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 mb-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="card p-4 mb-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="text-sm font-semibold">
              {result.table === 'Todas las tablas'
                ? `Se exportaron ${result.count} tablas en formato ${result.format}`
                : `Se descargaron ${result.count} registros de "${result.table}" en formato ${result.format}`}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORT_TABLES.map((cfg) => (
          <div key={cfg.table} className="card p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cnc-50 shrink-0">
                <Table2 className="h-5 w-5 text-cnc-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900">{cfg.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cfg.description}</p>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => exportTable(cfg, 'csv')}
                disabled={busyTable !== null}
                title="Exportar como CSV"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-cnc-300 hover:text-cnc-600 hover:bg-cnc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busyTable === cfg.table ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => exportTable(cfg, 'json')}
                disabled={busyTable !== null}
                title="Exportar como JSON"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-cnc-300 hover:text-cnc-600 hover:bg-cnc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busyTable === cfg.table ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileJson className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5 mt-6 bg-gray-50 border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Notas sobre la exportación</h3>
        <ul className="text-xs text-gray-500 space-y-1.5 leading-relaxed">
          <li>- Cada tabla se descarga como un archivo independiente con la fecha en el nombre.</li>
          <li>- El formato CSV es ideal para abrir en Excel, Google Sheets u otras hojas de cálculo.</li>
          <li>- El formato JSON preserva la estructura completa de los datos, incluyendo relaciones.</li>
          <li>- Los datos relacionados (categoría, institución, estado) se incluyen como columnas adicionales en CSV.</li>
          <li>- "Exportar todo" descarga cada tabla por separado, una tras otra.</li>
        </ul>
      </div>
    </div>
  );
}
