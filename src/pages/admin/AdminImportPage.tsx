import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortalData } from '@/hooks/usePortalData';
import { slugify } from '@/lib/utils';

interface ParsedRow {
  name?: string;
  description?: string;
  category?: string;
  dataset_type?: string;
  institution?: string;
  status?: string;
  source_url?: string;
  tags?: string;
  [key: string]: string | undefined;
}

export function AdminImportPage() {
  const { categories, datasetTypes, statuses, institutions } = usePortalData();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; failed: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
    return lines.slice(1).map((line) => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { values.push(current); current = ''; }
        else current += char;
      }
      values.push(current);
      const row: ParsedRow = {};
      headers.forEach((h, i) => { row[h] = values[i]?.trim().replace(/^"|"$/g, ''); });
      return row;
    });
  };

  const handleFile = async (file: File) => {
    setErrors([]);
    setResult(null);
    const text = await file.text();
    const parsed = text.trim().startsWith('[') || text.trim().startsWith('{') ? JSON.parse(text) : parseCSV(text);
    if (!Array.isArray(parsed)) { setErrors(['Formato no válido']); return; }

    const errs: string[] = [];
    parsed.forEach((row, i) => {
      if (!row.name) errs.push(`Fila ${i + 2}: falta "name"`);
    });
    setErrors(errs);
    setRows(parsed as ParsedRow[]);
  };

  const downloadTemplate = () => {
    const headers = 'name,description,category,dataset_type,institution,status,source_url,tags';
    const example = 'Ejemplo Dataset,Descripción de ejemplo,Recursos públicos,Divulgación pública,Ministerio de Finanzas Públicas,Disponible,https://ejemplo.gob.gt,Contrataciones;Presupuesto';
    const blob = new Blob([`${headers}\n${example}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-importacion-cnc.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async () => {
    setImporting(true);
    let imported = 0, failed = 0;

    for (const row of rows) {
      if (!row.name) { failed++; continue; }

      const cat = categories.find((c) => c.name.toLowerCase() === (row.category || '').toLowerCase());
      const dt = datasetTypes.find((t) => t.name.toLowerCase() === (row.dataset_type || '').toLowerCase());
      const st = statuses.find((s) => s.name.toLowerCase() === (row.status || '').toLowerCase());
      const inst = institutions.find((i) => i.name.toLowerCase() === (row.institution || '').toLowerCase());

      const { error } = await supabase.from('datasets').insert({
        name: row.name,
        slug: slugify(row.name),
        short_description: row.description || '',
        description: row.description || '',
        category_id: cat?.id || null,
        dataset_type_id: dt?.id || null,
        institution_id: inst?.id || null,
        status_id: st?.id || null,
        source_url: row.source_url || null,
        published: false,
        icon_name: 'Database',
      });

      if (error) failed++; else imported++;
    }

    setResult({ imported, failed });
    setImporting(false);
    setRows([]);
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Importación masiva</h1>

      <div className="card p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Subir archivo</h2>
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cnc-400 hover:bg-gray-50 transition-colors" onClick={() => fileRef.current?.click()}>
          <div className="text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">CSV, XLSX o JSON</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
        <button onClick={downloadTemplate} className="btn-secondary mt-3 text-xs">
          <Download className="h-3.5 w-3.5" />
          Descargar plantilla CSV
        </button>
      </div>

      {errors.length > 0 && (
        <div className="card p-4 mb-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-2 text-red-700"><AlertCircle className="h-4 w-4" /><span className="text-sm font-semibold">Errores encontrados ({errors.length})</span></div>
          <ul className="text-xs text-red-600 space-y-1">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      {rows.length > 0 && (
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Vista previa ({rows.length} registros)</h3>
            <button onClick={doImport} disabled={importing} className="btn-primary text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {importing ? 'Importando...' : `Confirmar importación (${rows.length})`}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50"><tr><th className="px-2 py-2 text-left">name</th><th className="px-2 py-2 text-left">category</th><th className="px-2 py-2 text-left">status</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {rows.slice(0, 10).map((r, i) => <tr key={i}><td className="px-2 py-1.5">{r.name}</td><td className="px-2 py-1.5">{r.category}</td><td className="px-2 py-1.5">{r.status}</td></tr>)}
              </tbody>
            </table>
            {rows.length > 10 && <p className="text-xs text-gray-400 mt-2">y {rows.length - 10} más...</p>}
          </div>
        </div>
      )}

      {result && (
        <div className="card p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4" /><span className="text-sm font-semibold">Importación completa: {result.imported} importados, {result.failed} fallidos</span></div>
        </div>
      )}
    </div>
  );
}
