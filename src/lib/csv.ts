export interface CSVParsedRow {
  [key: string]: string;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

export function parseCSV(text: string): CSVParsedRow[] {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else if (char === '\r') {
      continue;
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows: CSVParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: CSVParsedRow = {};
    headers.forEach((h, j) => {
      row[h] = (values[j] ?? '').trim();
    });
    rows.push(row);
  }

  return rows;
}

export function toBool(val: string): boolean {
  return val === 'true' || val === 'True' || val === 'TRUE' || val === '1';
}

export function toNum(val: string): number {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

export function toStr(val: string | undefined | null): string | null {
  if (!val || val.trim() === '') return null;
  return val;
}

let csvCache: Record<string, string> = {};

async function fetchCSV(filename: string): Promise<string> {
  if (csvCache[filename]) return csvCache[filename];
  const res = await fetch(`/data/${filename}`);
  if (!res.ok) throw new Error(`No se pudo cargar ${filename}`);
  const text = await res.text();
  csvCache[filename] = text;
  return text;
}

async function loadCSV<T>(filename: string, mapper: (row: CSVParsedRow) => T): Promise<T[]> {
  const text = await fetchCSV(filename);
  return parseCSV(text).map(mapper);
}

export { loadCSV };
