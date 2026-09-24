/*
# CNC Guatemala — Directorio de Datos Abiertos Anticorrupción

## Esquema completo de base de datos

Crea todas las tablas necesarias para el portal de datos anticorrupción de la CNC Guatemala.

### Tablas nuevas:
1. profiles — Perfiles de usuario con rol
2. categories — Categorías anticorrupción
3. dataset_types — Tipos de conjunto
4. statuses — Estados de disponibilidad
5. institutions — Instituciones responsables
6. tags — Etiquetas
7. pida_topics — Temas PIDA (30 conjuntos OEA)
8. datasets — Conjuntos de datos reales
9. dataset_tags — Relación N:M datasets↔tags
10. dataset_pida_relations — Relación N:M datasets↔pida_topics
11. resources — Recursos de cada dataset
12. use_cases — Casos de uso
13. use_case_datasets — Relación N:M use_cases↔datasets
14. files — Metadata de archivos subidos
15. audit_logs — Historial de cambios
16. settings — Configuración general (clave-valor)

### Seguridad (RLS):
- Lectura pública (anon + authenticated) para contenido publicado.
- Escritura solo para authenticated (admin).
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'consulta' CHECK (role IN ('super_admin','editor','revisor','consulta')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid()));

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon_name text DEFAULT 'Folder',
  color text DEFAULT '#1e40af',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "categories_admin_c" ON categories;
CREATE POLICY "categories_admin_c" ON categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "categories_admin_u" ON categories;
CREATE POLICY "categories_admin_u" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "categories_admin_d" ON categories;
CREATE POLICY "categories_admin_d" ON categories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DATASET_TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon_name text DEFAULT 'Database',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE dataset_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dt_public_read" ON dataset_types;
CREATE POLICY "dt_public_read" ON dataset_types FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dt_admin_c" ON dataset_types;
CREATE POLICY "dt_admin_c" ON dataset_types FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dt_admin_u" ON dataset_types;
CREATE POLICY "dt_admin_u" ON dataset_types FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "dt_admin_d" ON dataset_types;
CREATE POLICY "dt_admin_d" ON dataset_types FOR DELETE TO authenticated USING (true);

-- ============================================================
-- STATUSES
-- ============================================================
CREATE TABLE IF NOT EXISTS statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#6b7280',
  icon_name text DEFAULT 'Circle',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "st_public_read" ON statuses;
CREATE POLICY "st_public_read" ON statuses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "st_admin_c" ON statuses;
CREATE POLICY "st_admin_c" ON statuses FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "st_admin_u" ON statuses;
CREATE POLICY "st_admin_u" ON statuses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "st_admin_d" ON statuses;
CREATE POLICY "st_admin_d" ON statuses FOR DELETE TO authenticated USING (true);

-- ============================================================
-- INSTITUTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  acronym text,
  description text,
  logo_url text,
  website text,
  email text,
  phone text,
  is_active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inst_public_read" ON institutions;
CREATE POLICY "inst_public_read" ON institutions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "inst_admin_c" ON institutions;
CREATE POLICY "inst_admin_c" ON institutions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "inst_admin_u" ON institutions;
CREATE POLICY "inst_admin_u" ON institutions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "inst_admin_d" ON institutions;
CREATE POLICY "inst_admin_d" ON institutions FOR DELETE TO authenticated USING (true);

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tags_public_read" ON tags;
CREATE POLICY "tags_public_read" ON tags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "tags_admin_c" ON tags;
CREATE POLICY "tags_admin_c" ON tags FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tags_admin_u" ON tags;
CREATE POLICY "tags_admin_u" ON tags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "tags_admin_d" ON tags;
CREATE POLICY "tags_admin_d" ON tags FOR DELETE TO authenticated USING (true);

-- ============================================================
-- PIDA_TOPICS
-- ============================================================
CREATE TABLE IF NOT EXISTS pida_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  dataset_type_id uuid REFERENCES dataset_types(id) ON DELETE SET NULL,
  icon_name text DEFAULT 'Database',
  anti_corruption_prevention boolean DEFAULT false,
  anti_corruption_detection boolean DEFAULT false,
  anti_corruption_investigation boolean DEFAULT false,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE pida_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pt_public_read" ON pida_topics;
CREATE POLICY "pt_public_read" ON pida_topics FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "pt_admin_c" ON pida_topics;
CREATE POLICY "pt_admin_c" ON pida_topics FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "pt_admin_u" ON pida_topics;
CREATE POLICY "pt_admin_u" ON pida_topics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "pt_admin_d" ON pida_topics;
CREATE POLICY "pt_admin_d" ON pida_topics FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DATASETS
-- ============================================================
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  description text,
  icon_type text DEFAULT 'lucide' CHECK (icon_type IN ('lucide','svg','png','webp')),
  icon_name text DEFAULT 'Database',
  icon_url text,
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  dataset_type_id uuid REFERENCES dataset_types(id) ON DELETE SET NULL,
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  status_id uuid REFERENCES statuses(id) ON DELETE SET NULL,
  is_pida boolean DEFAULT false,
  pida_topic_id uuid REFERENCES pida_topics(id) ON DELETE SET NULL,
  availability text,
  coverage_geo text,
  coverage_temporal text,
  frequency text,
  last_updated_at date,
  license text,
  source_url text,
  source_contact text,
  api_url text,
  api_available boolean DEFAULT false,
  metadata_url text,
  documentation_url text,
  anti_corruption_prevention boolean DEFAULT false,
  anti_corruption_detection boolean DEFAULT false,
  anti_corruption_investigation boolean DEFAULT false,
  openness_level int DEFAULT 0 CHECK (openness_level >= 0 AND openness_level <= 5),
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  display_order int DEFAULT 0,
  published_at timestamptz,
  guatemala_exists boolean,
  guatemala_observations text,
  guatemala_evaluation_date date,
  guatemala_evaluated_by text,
  guatemala_regulatory_framework text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ds_public_read" ON datasets;
CREATE POLICY "ds_public_read" ON datasets FOR SELECT
  TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "ds_admin_read" ON datasets;
CREATE POLICY "ds_admin_read" ON datasets FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "ds_admin_c" ON datasets;
CREATE POLICY "ds_admin_c" ON datasets FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ds_admin_u" ON datasets;
CREATE POLICY "ds_admin_u" ON datasets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ds_admin_d" ON datasets;
CREATE POLICY "ds_admin_d" ON datasets FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DATASET_TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_tags (
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (dataset_id, tag_id)
);
ALTER TABLE dataset_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dtag_public_read" ON dataset_tags;
CREATE POLICY "dtag_public_read" ON dataset_tags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dtag_admin_c" ON dataset_tags;
CREATE POLICY "dtag_admin_c" ON dataset_tags FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dtag_admin_u" ON dataset_tags;
CREATE POLICY "dtag_admin_u" ON dataset_tags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "dtag_admin_d" ON dataset_tags;
CREATE POLICY "dtag_admin_d" ON dataset_tags FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DATASET_PIDA_RELATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS dataset_pida_relations (
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  pida_topic_id uuid REFERENCES pida_topics(id) ON DELETE CASCADE,
  PRIMARY KEY (dataset_id, pida_topic_id)
);
ALTER TABLE dataset_pida_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dpr_public_read" ON dataset_pida_relations;
CREATE POLICY "dpr_public_read" ON dataset_pida_relations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dpr_admin_c" ON dataset_pida_relations;
CREATE POLICY "dpr_admin_c" ON dataset_pida_relations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dpr_admin_u" ON dataset_pida_relations;
CREATE POLICY "dpr_admin_u" ON dataset_pida_relations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "dpr_admin_d" ON dataset_pida_relations;
CREATE POLICY "dpr_admin_d" ON dataset_pida_relations FOR DELETE TO authenticated USING (true);

-- ============================================================
-- RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'file',
  format text,
  url text,
  file_path text,
  file_size bigint,
  mime_type text,
  last_updated date,
  is_active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "res_public_read" ON resources;
CREATE POLICY "res_public_read" ON resources FOR SELECT
  TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "res_admin_read" ON resources;
CREATE POLICY "res_admin_read" ON resources FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "res_admin_c" ON resources;
CREATE POLICY "res_admin_c" ON resources FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "res_admin_u" ON resources;
CREATE POLICY "res_admin_u" ON resources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "res_admin_d" ON resources;
CREATE POLICY "res_admin_d" ON resources FOR DELETE TO authenticated USING (true);

-- ============================================================
-- USE_CASES
-- ============================================================
CREATE TABLE IF NOT EXISTS use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  methodology text,
  results text,
  links jsonb,
  published boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uc_public_read" ON use_cases;
CREATE POLICY "uc_public_read" ON use_cases FOR SELECT
  TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "uc_admin_read" ON use_cases;
CREATE POLICY "uc_admin_read" ON use_cases FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "uc_admin_c" ON use_cases;
CREATE POLICY "uc_admin_c" ON use_cases FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "uc_admin_u" ON use_cases;
CREATE POLICY "uc_admin_u" ON use_cases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "uc_admin_d" ON use_cases;
CREATE POLICY "uc_admin_d" ON use_cases FOR DELETE TO authenticated USING (true);

-- ============================================================
-- USE_CASE_DATASETS
-- ============================================================
CREATE TABLE IF NOT EXISTS use_case_datasets (
  use_case_id uuid REFERENCES use_cases(id) ON DELETE CASCADE,
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  PRIMARY KEY (use_case_id, dataset_id)
);
ALTER TABLE use_case_datasets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ucd_public_read" ON use_case_datasets;
CREATE POLICY "ucd_public_read" ON use_case_datasets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ucd_admin_c" ON use_case_datasets;
CREATE POLICY "ucd_admin_c" ON use_case_datasets FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ucd_admin_u" ON use_case_datasets;
CREATE POLICY "ucd_admin_u" ON use_case_datasets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ucd_admin_d" ON use_case_datasets;
CREATE POLICY "ucd_admin_d" ON use_case_datasets FOR DELETE TO authenticated USING (true);

-- ============================================================
-- FILES
-- ============================================================
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  original_name text,
  storage_path text NOT NULL,
  mime_type text,
  size bigint,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "files_admin_read" ON files;
CREATE POLICY "files_admin_read" ON files FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "files_admin_c" ON files;
CREATE POLICY "files_admin_c" ON files FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "files_admin_u" ON files;
CREATE POLICY "files_admin_u" ON files FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "files_admin_d" ON files;
CREATE POLICY "files_admin_d" ON files FOR DELETE TO authenticated USING (true);

-- ============================================================
-- AUDIT_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "al_admin_read" ON audit_logs;
CREATE POLICY "al_admin_read" ON audit_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "al_auth_write" ON audit_logs;
CREATE POLICY "al_auth_write" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text,
  value_json jsonb,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "set_public_read" ON settings;
CREATE POLICY "set_public_read" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "set_admin_c" ON settings;
CREATE POLICY "set_admin_c" ON settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "set_admin_u" ON settings;
CREATE POLICY "set_admin_u" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "set_admin_d" ON settings;
CREATE POLICY "set_admin_d" ON settings FOR DELETE TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_datasets_slug ON datasets(slug);
CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(category_id);
CREATE INDEX IF NOT EXISTS idx_datasets_institution ON datasets(institution_id);
CREATE INDEX IF NOT EXISTS idx_datasets_status ON datasets(status_id);
CREATE INDEX IF NOT EXISTS idx_datasets_published ON datasets(published);
CREATE INDEX IF NOT EXISTS idx_datasets_is_pida ON datasets(is_pida);
CREATE INDEX IF NOT EXISTS idx_pida_topics_slug ON pida_topics(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_statuses_slug ON statuses(slug);
CREATE INDEX IF NOT EXISTS idx_resources_dataset ON resources(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_dataset ON dataset_tags(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_tag ON dataset_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_use_case_datasets_uc ON use_case_datasets(use_case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_datasets_updated ON datasets;
CREATE TRIGGER trg_datasets_updated BEFORE UPDATE ON datasets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_institutions_updated ON institutions;
CREATE TRIGGER trg_institutions_updated BEFORE UPDATE ON institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_categories_updated ON categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_pida_topics_updated ON pida_topics;
CREATE TRIGGER trg_pida_topics_updated BEFORE UPDATE ON pida_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_use_cases_updated ON use_cases;
CREATE TRIGGER trg_use_cases_updated BEFORE UPDATE ON use_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
