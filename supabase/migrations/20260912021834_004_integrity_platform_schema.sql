/*
# Plataforma Nacional de Datos para la Integridad — Esquema

## Resumen
Evoluciona el portal de catálogo a plataforma de datos para la integridad.
Agrega nuevos ejes de datos, investigaciones, evaluaciones de madurez,
relaciones entre datasets, identificadores, feedback ciudadano, historias,
agenda de apertura y accesos rápidos de investigación.

## Nuevas tablas
1. integrity_domains — Ejes de integridad (Personas y poder, Empresas y vínculos, etc.)
2. dataset_integrity_domains — Relación N:M entre datasets y ejes
3. research_paths — Accesos rápidos en la home ("Seguir el dinero", etc.)
4. dataset_questions — Preguntas que permite responder cada dataset
5. dataset_relationships — Relaciones entre datasets (cruces posibles)
6. identifiers — Identificadores de interoperabilidad (NIT, NOG, SNIP, etc.)
7. dataset_identifiers — Relación N:M entre datasets e identificadores
8. dataset_assessments — Evaluación de madurez y utilidad anticorrupción
9. investigations — Preguntas de investigación que agrupan datasets
10. investigation_datasets — Relación N:M entre investigaciones y datasets
11. dataset_feedback — Reportes ciudadanos sobre datasets
12. data_stories — Historias con datos (análisis publicados)
13. data_story_datasets — Relación N:M entre historias y datasets
14. opening_agenda — Agenda de apertura priorizada

## Columnas nuevas en datasets
- anti_corruption_relevance (text) — ¿Por qué estos datos importan?
- anti_corruption_social_control (boolean) — Valor: control social
- anti_corruption_traceability (boolean) — Valor: trazabilidad del gasto

## Seguridad
- RLS habilitado en todas las tablas nuevas.
- Lectura pública (anon+authenticated) en todas las tablas de contenido.
- Escritura solo para authenticated (admin).
- dataset_feedback: insert público, lectura/gestión solo authenticated.
*/

-- ============================================================
-- NUEVAS COLUMNAS EN datasets
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'anti_corruption_relevance') THEN
    ALTER TABLE datasets ADD COLUMN anti_corruption_relevance text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'anti_corruption_social_control') THEN
    ALTER TABLE datasets ADD COLUMN anti_corruption_social_control boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'anti_corruption_traceability') THEN
    ALTER TABLE datasets ADD COLUMN anti_corruption_traceability boolean DEFAULT false;
  END IF;
END $$;

-- ============================================================
-- 1. integrity_domains
-- ============================================================
CREATE TABLE IF NOT EXISTS integrity_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  question text,
  icon_name text NOT NULL DEFAULT 'Shield',
  color text NOT NULL DEFAULT '#0f766e',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE integrity_domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "id_public_read" ON integrity_domains;
CREATE POLICY "id_public_read" ON integrity_domains FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "id_admin_c" ON integrity_domains;
CREATE POLICY "id_admin_c" ON integrity_domains FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "id_admin_u" ON integrity_domains;
CREATE POLICY "id_admin_u" ON integrity_domains FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "id_admin_d" ON integrity_domains;
CREATE POLICY "id_admin_d" ON integrity_domains FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 2. dataset_integrity_domains (N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_integrity_domains (
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  integrity_domain_id uuid REFERENCES integrity_domains(id) ON DELETE CASCADE,
  PRIMARY KEY (dataset_id, integrity_domain_id)
);
ALTER TABLE dataset_integrity_domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "did_public_read" ON dataset_integrity_domains;
CREATE POLICY "did_public_read" ON dataset_integrity_domains FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "did_admin_c" ON dataset_integrity_domains;
CREATE POLICY "did_admin_c" ON dataset_integrity_domains FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "did_admin_d" ON dataset_integrity_domains;
CREATE POLICY "did_admin_d" ON dataset_integrity_domains FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 3. research_paths
-- ============================================================
CREATE TABLE IF NOT EXISTS research_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Search',
  destination_url text,
  related_domain_id uuid REFERENCES integrity_domains(id) ON DELETE SET NULL,
  display_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE research_paths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rp_public_read" ON research_paths;
CREATE POLICY "rp_public_read" ON research_paths FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "rp_admin_c" ON research_paths;
CREATE POLICY "rp_admin_c" ON research_paths FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "rp_admin_u" ON research_paths;
CREATE POLICY "rp_admin_u" ON research_paths FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "rp_admin_d" ON research_paths;
CREATE POLICY "rp_admin_d" ON research_paths FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 4. dataset_questions
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  question text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE dataset_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dq_public_read" ON dataset_questions;
CREATE POLICY "dq_public_read" ON dataset_questions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dq_admin_c" ON dataset_questions;
CREATE POLICY "dq_admin_c" ON dataset_questions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dq_admin_u" ON dataset_questions;
CREATE POLICY "dq_admin_u" ON dataset_questions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "dq_admin_d" ON dataset_questions;
CREATE POLICY "dq_admin_d" ON dataset_questions FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_dq_dataset ON dataset_questions(dataset_id);

-- ============================================================
-- 5. dataset_relationships
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  target_dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  relationship_type text NOT NULL DEFAULT 'cruce',
  description text,
  join_field text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE dataset_relationships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dr_public_read" ON dataset_relationships;
CREATE POLICY "dr_public_read" ON dataset_relationships FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dr_admin_c" ON dataset_relationships;
CREATE POLICY "dr_admin_c" ON dataset_relationships FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dr_admin_u" ON dataset_relationships;
CREATE POLICY "dr_admin_u" ON dataset_relationships FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "dr_admin_d" ON dataset_relationships;
CREATE POLICY "dr_admin_d" ON dataset_relationships FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_dr_source ON dataset_relationships(source_dataset_id);

-- ============================================================
-- 6. identifiers
-- ============================================================
CREATE TABLE IF NOT EXISTS identifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE identifiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "idn_public_read" ON identifiers;
CREATE POLICY "idn_public_read" ON identifiers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "idn_admin_c" ON identifiers;
CREATE POLICY "idn_admin_c" ON identifiers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "idn_admin_u" ON identifiers;
CREATE POLICY "idn_admin_u" ON identifiers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "idn_admin_d" ON identifiers;
CREATE POLICY "idn_admin_d" ON identifiers FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 7. dataset_identifiers (N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_identifiers (
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  identifier_id uuid REFERENCES identifiers(id) ON DELETE CASCADE,
  PRIMARY KEY (dataset_id, identifier_id)
);
ALTER TABLE dataset_identifiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "di_public_read" ON dataset_identifiers;
CREATE POLICY "di_public_read" ON dataset_identifiers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "di_admin_c" ON dataset_identifiers;
CREATE POLICY "di_admin_c" ON dataset_identifiers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "di_admin_d" ON dataset_identifiers;
CREATE POLICY "di_admin_d" ON dataset_identifiers FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 8. dataset_assessments
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL UNIQUE REFERENCES datasets(id) ON DELETE CASCADE,
  access_score int NOT NULL DEFAULT 0,
  reuse_score int NOT NULL DEFAULT 0,
  update_score int NOT NULL DEFAULT 0,
  coverage_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  documentation_score int NOT NULL DEFAULT 0,
  identifiers_score int NOT NULL DEFAULT 0,
  interoperability_score int NOT NULL DEFAULT 0,
  governance_score int NOT NULL DEFAULT 0,
  total_score int NOT NULL DEFAULT 0,
  prevention_score int NOT NULL DEFAULT 0,
  detection_score int NOT NULL DEFAULT 0,
  investigation_score int NOT NULL DEFAULT 0,
  social_control_score int NOT NULL DEFAULT 0,
  traceability_score int NOT NULL DEFAULT 0,
  ac_total_score int NOT NULL DEFAULT 0,
  evaluator text,
  evaluation_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE dataset_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "da_public_read" ON dataset_assessments;
CREATE POLICY "da_public_read" ON dataset_assessments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "da_admin_c" ON dataset_assessments;
CREATE POLICY "da_admin_c" ON dataset_assessments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "da_admin_u" ON dataset_assessments;
CREATE POLICY "da_admin_u" ON dataset_assessments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "da_admin_d" ON dataset_assessments;
CREATE POLICY "da_admin_d" ON dataset_assessments FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 9. investigations
-- ============================================================
CREATE TABLE IF NOT EXISTS investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  question text NOT NULL,
  description text,
  methodology text,
  icon_name text NOT NULL DEFAULT 'Search',
  published boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inv_public_read" ON investigations;
CREATE POLICY "inv_public_read" ON investigations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "inv_admin_c" ON investigations;
CREATE POLICY "inv_admin_c" ON investigations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "inv_admin_u" ON investigations;
CREATE POLICY "inv_admin_u" ON investigations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "inv_admin_d" ON investigations;
CREATE POLICY "inv_admin_d" ON investigations FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 10. investigation_datasets (N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS investigation_datasets (
  investigation_id uuid REFERENCES investigations(id) ON DELETE CASCADE,
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  PRIMARY KEY (investigation_id, dataset_id)
);
ALTER TABLE investigation_datasets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invd_public_read" ON investigation_datasets;
CREATE POLICY "invd_public_read" ON investigation_datasets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "invd_admin_c" ON investigation_datasets;
CREATE POLICY "invd_admin_c" ON investigation_datasets FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "invd_admin_d" ON investigation_datasets;
CREATE POLICY "invd_admin_d" ON investigation_datasets FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 11. dataset_feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  name text,
  email text,
  feedback_type text NOT NULL DEFAULT 'otro',
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'nuevo',
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE dataset_feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "df_public_insert" ON dataset_feedback;
CREATE POLICY "df_public_insert" ON dataset_feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "df_admin_read" ON dataset_feedback;
CREATE POLICY "df_admin_read" ON dataset_feedback FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "df_admin_u" ON dataset_feedback;
CREATE POLICY "df_admin_u" ON dataset_feedback FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "df_admin_d" ON dataset_feedback;
CREATE POLICY "df_admin_d" ON dataset_feedback FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 12. data_stories
-- ============================================================
CREATE TABLE IF NOT EXISTS data_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text,
  content text,
  cover_image text,
  author text,
  publication_date date,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE data_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ds_public_read" ON data_stories;
CREATE POLICY "ds_public_read" ON data_stories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ds_admin_c" ON data_stories;
CREATE POLICY "ds_admin_c" ON data_stories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ds_admin_u" ON data_stories;
CREATE POLICY "ds_admin_u" ON data_stories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ds_admin_d" ON data_stories;
CREATE POLICY "ds_admin_d" ON data_stories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 13. data_story_datasets (N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS data_story_datasets (
  data_story_id uuid REFERENCES data_stories(id) ON DELETE CASCADE,
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  PRIMARY KEY (data_story_id, dataset_id)
);
ALTER TABLE data_story_datasets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dsd_public_read" ON data_story_datasets;
CREATE POLICY "dsd_public_read" ON data_story_datasets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dsd_admin_c" ON data_story_datasets;
CREATE POLICY "dsd_admin_c" ON data_story_datasets FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dsd_admin_d" ON data_story_datasets;
CREATE POLICY "dsd_admin_d" ON data_story_datasets FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 14. opening_agenda
-- ============================================================
CREATE TABLE IF NOT EXISTS opening_agenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE SET NULL,
  information text NOT NULL,
  situation text,
  institution text,
  priority text NOT NULL DEFAULT 'media',
  recommendation text,
  progress int NOT NULL DEFAULT 0,
  display_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE opening_agenda ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "oa_public_read" ON opening_agenda;
CREATE POLICY "oa_public_read" ON opening_agenda FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "oa_admin_c" ON opening_agenda;
CREATE POLICY "oa_admin_c" ON opening_agenda FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "oa_admin_u" ON opening_agenda;
CREATE POLICY "oa_admin_u" ON opening_agenda FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "oa_admin_d" ON opening_agenda;
CREATE POLICY "oa_admin_d" ON opening_agenda FOR DELETE TO authenticated USING (true);
