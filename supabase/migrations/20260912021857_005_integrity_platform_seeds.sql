/*
# Seeds: Plataforma de Integridad

## Contenido inicial
1. Ejes de integridad (8 ejes con preguntas y ejemplos)
2. Accesos rápidos de investigación (8 rutas)
3. Identificadores de interoperabilidad (8 identificadores)
4. Actualización de estados con descripciones extendidas
5. Settings nuevas (disclaimer, textos institucionales)
*/

-- ============================================================
-- 1. EJES DE INTEGRIDAD
-- ============================================================
INSERT INTO integrity_domains (name, slug, description, question, icon_name, color, display_order) VALUES
('Personas y poder', 'personas-y-poder', 'Funcionarios, autoridades, personas políticamente expuestas, declaraciones de intereses y consejos.', '¿Quién toma decisiones públicas?', 'Users', '#2563eb', 1),
('Empresas y vínculos', 'empresas-y-vinculos', 'Empresas, proveedores, contratistas, representantes legales y beneficiarios finales.', '¿Quién recibe recursos o se relaciona económicamente con el Estado?', 'Building2', '#0f766e', 2),
('Dinero público', 'dinero-publico', 'Presupuesto, gasto, transferencias, fideicomisos y subsidios.', '¿De dónde provienen y hacia dónde van los recursos públicos?', 'Banknote', '#ca8a04', 3),
('Contratación pública', 'contratacion-publica', 'Concursos, adjudicaciones, contratos, proveedores, modificaciones, inconformidades y sanciones.', '¿Cómo compra el Estado y a quién?', 'FileText', '#dc2626', 4),
('Obra e inversión', 'obra-e-inversion', 'Proyectos SNIP, infraestructura, inversión pública, contratos de obra y avance financiero.', '¿Dónde y cómo se ejecutan los recursos públicos?', 'HardHat', '#7c3aed', 5),
('Decisiones públicas', 'decisiones-publicas', 'Licencias, votaciones, regulaciones, resoluciones y reuniones.', '¿Quién autorizó, decidió o reguló qué?', 'Gavel', '#0891b2', 6),
('Control y consecuencias', 'control-y-consecuencias', 'Auditorías, sanciones, hallazgos, inconformidades y denuncias.', '¿Qué encontraron los sistemas de control?', 'ShieldAlert', '#be123c', 7),
('Territorio', 'territorio', 'Presupuesto municipal, transferencias, inversión, compras e infraestructura por departamento y municipio.', '¿Qué ocurre en departamentos y municipios?', 'Map', '#15803d', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. ACCESOS RÁPIDOS (research_paths)
-- ============================================================
INSERT INTO research_paths (title, description, icon_name, destination_url, related_domain_id, display_order, published) VALUES
('Seguir el dinero', 'Rastrea cómo se asigna y ejecuta el presupuesto público.', 'Banknote', '/explorar?category=seguimiento-de-dinero', NULL, 1, true),
('Investigar un proveedor', 'Consulta qué empresas contratan con el Estado y cuánto reciben.', 'Building2', '/explorar?q=proveedores', NULL, 2, true),
('Analizar una compra', 'Revisa procesos de adquisición, adjudicaciones y contratos.', 'FileText', '/explorar?q=compras', NULL, 3, true),
('Revisar una obra pública', 'Verifica proyectos de infraestructura, inversión y avance.', 'HardHat', '/explorar?q=infraestructura', NULL, 4, true),
('Consultar auditorías', 'Accede a informes de auditoría y hallazgos de control.', 'ShieldAlert', '/explorar?q=auditorias', NULL, 5, true),
('Explorar un municipio', 'Revisa presupuesto, transferencias e inversión territorial.', 'Map', '/explorar?q=municipal', NULL, 6, true),
('Analizar empresas', 'Busca información sobre empresas, representantes y vínculos.', 'Building2', '/explorar?q=empresas', NULL, 7, true),
('Revisar gasto público', 'Examina la ejecución del gasto y transferencias del Estado.', 'Banknote', '/explorar?q=gasto', NULL, 8, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. IDENTIFICADORES DE INTEROPERABILIDAD
-- ============================================================
INSERT INTO identifiers (name, slug, description, display_order) VALUES
('NIT', 'nit', 'Número de Identificación Tributaria. Identifica a personas y empresas ante la SAT.', 1),
('NOG', 'nog', 'Número de Oportunidad de Gobierno. Identifica procesos de compra en Guatecompras.', 2),
('NPG', 'npg', 'Número de Proceso de Guatecompras. Identifica procesos de adquisición.', 3),
('SNIP', 'snip', 'Código del Sistema Nacional de Inversión Pública. Identifica proyectos de inversión.', 4),
('Código institucional', 'codigo-institucional', 'Identificador de la institución pública responsable.', 5),
('Código municipal', 'codigo-municipal', 'Identificador del municipio o entidad territorial.', 6),
('Proveedor', 'proveedor', 'Identificador del proveedor o contratista del Estado.', 7),
('Unidad ejecutora', 'unidad-ejecutora', 'Identificador de la unidad ejecutora de un proyecto o programa.', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 4. SETTINGS NUEVAS
-- ============================================================
INSERT INTO settings (key, value) VALUES
('integrity_disclaimer', 'Los datos, indicadores, patrones y cruces presentados en este portal pueden ayudar a identificar riesgos, anomalías o áreas que ameritan análisis adicional. No constituyen por sí mismos una determinación de responsabilidad administrativa, civil o penal.'),
('hero_title', 'Datos para fortalecer la integridad pública'),
('hero_text', 'Explora datos públicos de Guatemala que permiten analizar cómo se toman decisiones, cómo se utilizan los recursos públicos, quiénes participan en ellos y qué mecanismos de control existen.'),
('hero_search_placeholder', 'Buscar contratos, empresas, funcionarios, presupuesto, auditorías, proyectos...'),
('footer_responsible_institution', 'Comisión Nacional contra la Corrupción'),
('footer_technical_partner', ''),
('footer_allies', ''),
('footer_logos', ''),
('methodology_disclaimer', 'Una baja calificación no implica incumplimiento legal ni una alta calificación implica ausencia de riesgos de corrupción. La evaluación busca medir utilidad y condiciones de reutilización de información pública.')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 5. ACTUALIZAR ESTADOS CON DESCRIPCIONES EXTENDIDAS
-- ============================================================
UPDATE statuses SET description = 'Datos estructurados, descargables y reutilizables.' WHERE slug = 'datos-abiertos';
UPDATE statuses SET description = 'Información disponible mediante buscador, plataforma o consulta web, pero sin descarga masiva sencilla.' WHERE slug = 'disponible';
UPDATE statuses SET description = 'Existe información, pero tiene cobertura incompleta, fragmentación institucional o limitaciones importantes.' WHERE slug = 'parcial';
UPDATE statuses SET description = 'La información existe, pero requiere permisos, pagos, registro o condiciones especiales.' WHERE slug = 'brecha' AND name = 'Restringido';
UPDATE statuses SET description = 'No se ha identificado publicación pública suficiente.' WHERE slug = 'brecha' AND name != 'Restringido';

-- Insertar estado "Pendiente de evaluación" si no existe
INSERT INTO statuses (name, slug, description, color, icon_name, display_order, is_active)
SELECT 'Pendiente de evaluación', 'pendiente', 'Todavía no se ha realizado una evaluación.', '#6b7280', 'Clock', 10, true
WHERE NOT EXISTS (SELECT 1 FROM statuses WHERE slug = 'pendiente');

-- Insertar estado "Restringido" si no existe (separado de brecha)
INSERT INTO statuses (name, slug, description, color, icon_name, display_order, is_active)
SELECT 'Restringido', 'restringido', 'La información existe, pero requiere permisos, pagos, registro o condiciones especiales.', '#ea580c', 'Lock', 2, true
WHERE NOT EXISTS (SELECT 1 FROM statuses WHERE slug = 'restringido');
