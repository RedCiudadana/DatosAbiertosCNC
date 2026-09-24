export const OPENNESS_THRESHOLD_OPEN = 4;
export const OPENNESS_THRESHOLD_GAP = 0;

export function isOpennessOpen(level: number): boolean {
  return level >= OPENNESS_THRESHOLD_OPEN;
}

export function isOpennessGap(level: number): boolean {
  return level === OPENNESS_THRESHOLD_GAP;
}

export function isOpennessPartial(level: number): boolean {
  return level > OPENNESS_THRESHOLD_GAP && level < OPENNESS_THRESHOLD_OPEN;
}

export interface OpennessLevelInfo {
  label: string;
  color: string;
  description: string;
}

export const OPENNESS_LEVELS: Record<number, OpennessLevelInfo> = {
  0: { label: 'Brecha', color: '#dc2626', description: 'No se ha identificado un conjunto abierto y estructurado.' },
  1: { label: 'Parcial', color: '#ca8a04', description: 'Información incompleta o en formatos poco reutilizables.' },
  2: { label: 'Parcial', color: '#ca8a04', description: 'Información incompleta o en formatos poco reutilizables.' },
  3: { label: 'Disponible', color: '#2563eb', description: 'Existe información pública pero puede requerir consulta mediante plataforma.' },
  4: { label: 'Abierto', color: '#16a34a', description: 'Información estructurada y reutilizable.' },
  5: { label: 'Abierto', color: '#16a34a', description: 'Información estructurada y reutilizable en formatos abiertos.' },
};

export function getOpennessLevel(level: number): OpennessLevelInfo {
  return OPENNESS_LEVELS[level] || OPENNESS_LEVELS[0];
}

export interface AntiCorruptionValue {
  key: 'prevention' | 'detection' | 'investigation' | 'social_control' | 'traceability';
  label: string;
  field: 'anti_corruption_prevention' | 'anti_corruption_detection' | 'anti_corruption_investigation' | 'anti_corruption_social_control' | 'anti_corruption_traceability';
}

export const ANTI_CORRUPTION_VALUES: AntiCorruptionValue[] = [
  { key: 'prevention', label: 'Prevención', field: 'anti_corruption_prevention' },
  { key: 'detection', label: 'Detección', field: 'anti_corruption_detection' },
  { key: 'investigation', label: 'Investigación', field: 'anti_corruption_investigation' },
  { key: 'social_control', label: 'Control social', field: 'anti_corruption_social_control' },
  { key: 'traceability', label: 'Trazabilidad del gasto', field: 'anti_corruption_traceability' },
];

export interface ResourceTypeConfig {
  label: string;
}

export const RESOURCE_TYPES: Record<string, ResourceTypeConfig> = {
  file: { label: 'Archivo' },
  portal: { label: 'Portal' },
  api: { label: 'API' },
  dashboard: { label: 'Dashboard' },
  document: { label: 'Documento' },
};

export const RESOURCE_TYPE_KEYS = Object.keys(RESOURCE_TYPES);

export interface AssessmentDimension {
  key: string;
  label: string;
  field: string;
  description: string;
}

export const ASSESSMENT_DIMENSIONS: AssessmentDimension[] = [
  { key: 'access', label: 'Acceso efectivo', field: 'access_score', description: '¿El ciudadano puede acceder sin barreras?' },
  { key: 'reuse', label: 'Reutilización', field: 'reuse_score', description: '¿Está disponible en CSV, JSON, XLSX, API u otro formato estructurado?' },
  { key: 'update', label: 'Actualización', field: 'update_score', description: '¿La información se actualiza con una frecuencia apropiada?' },
  { key: 'coverage', label: 'Cobertura', field: 'coverage_score', description: '¿Incluye el universo relevante?' },
  { key: 'quality', label: 'Calidad y consistencia', field: 'quality_score', description: '¿Los campos están completos y normalizados?' },
  { key: 'documentation', label: 'Documentación', field: 'documentation_score', description: '¿Existe diccionario de datos y metodología?' },
  { key: 'identifiers', label: 'Identificadores', field: 'identifiers_score', description: '¿Tiene identificadores que permitan conectar bases?' },
  { key: 'interoperability', label: 'Interoperabilidad', field: 'interoperability_score', description: '¿Puede combinarse con otros datos públicos?' },
  { key: 'governance', label: 'Gobernanza', field: 'governance_score', description: '¿Existe una institución responsable y reglas claras de actualización?' },
];

export const AC_ASSESSMENT_DIMENSIONS: AssessmentDimension[] = [
  { key: 'prevention', label: 'Prevención', field: 'prevention_score', description: 'Utilidad para prevenir riesgos de corrupción.' },
  { key: 'detection', label: 'Detección', field: 'detection_score', description: 'Utilidad para detectar anomalías o señales de alerta.' },
  { key: 'investigation', label: 'Investigación', field: 'investigation_score', description: 'Utilidad para investigar casos o patrones.' },
  { key: 'social_control', label: 'Control social', field: 'social_control_score', description: 'Utilidad para el control ciudadano y la rendición de cuentas.' },
  { key: 'traceability', label: 'Trazabilidad del gasto', field: 'traceability_score', description: 'Utilidad para rastrear el flujo de recursos públicos.' },
];

export const FEEDBACK_TYPES: Record<string, string> = {
  broken_link: 'Enlace roto',
  outdated: 'Dato desactualizado',
  incomplete: 'Dato incompleto',
  error: 'Error',
  request_open: 'Solicitar formato abierto',
  suggest_source: 'Sugerir nueva fuente',
  other: 'Otro',
};

export const FEEDBACK_STATUSES: Record<string, string> = {
  nuevo: 'Nuevo',
  en_revision: 'En revisión',
  resuelto: 'Resuelto',
  descartado: 'Descartado',
};

export const PRIORITY_LEVELS: Record<string, { label: string; color: string }> = {
  critica: { label: 'Crítica', color: '#dc2626' },
  alta: { label: 'Alta', color: '#ea580c' },
  media: { label: 'Media', color: '#ca8a04' },
  baja: { label: 'Baja', color: '#6b7280' },
};
