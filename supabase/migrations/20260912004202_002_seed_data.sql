/*
# CNC Guatemala — Datos iniciales (Seed)

Carga todos los datos iniciales del portal:
1. 4 categorías anticorrupción
2. 3 tipos de conjunto
3. 7 estados de disponibilidad
4. 9 instituciones guatemaltecas
5. 8 etiquetas iniciales
6. 30 temas PIDA (con categoría, tipo e icono asignados)
7. 30 datasets iniciales (uno por tema PIDA, publicados, vinculados)
8. Relaciones dataset_tags y dataset_pida_relations
9. Configuración general del portal (settings)

Todos los datos son editables/eliminables desde /admin.
*/

-- ============================================================
-- CATEGORÍAS
-- ============================================================
INSERT INTO categories (name, slug, description, icon_name, color, display_order) VALUES
('Individuos y organizaciones', 'individuos-y-organizaciones', 'Registros de personas, funcionarios, empresas y organizaciones relevantes para la integridad.', 'Users', '#1e40af', 1),
('Recursos públicos', 'recursos-publicos', 'Información sobre presupuesto, gasto, contrataciones y asignación de recursos del Estado.', 'Banknote', '#0891b2', 2),
('Regulación, procesos administrativos y registros', 'regulacion-procesos-administrativos-registros', 'Procesos administrativos, decisiones, auditorías y registros regulatorios.', 'ScrollText', '#0d9488', 3),
('Extracción de rentas', 'extraccion-de-rentas', 'Datos sobre propiedad, impuestos y declaraciones patrimoniales.', 'Landmark', '#b45309', 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TIPOS DE CONJUNTO
-- ============================================================
INSERT INTO dataset_types (name, slug, description, icon_name, display_order) VALUES
('Registro', 'registro', 'Conjuntos de datos que funcionan como registros públicos.', 'Database', 1),
('Transacción', 'transaccion', 'Conjuntos de datos sobre transacciones o eventos específicos.', 'ArrowRightLeft', 2),
('Divulgación pública', 'divulgacion-publica', 'Conjuntos de datos que resultan de obligaciones de divulgación.', 'FileText', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ESTADOS
-- ============================================================
INSERT INTO statuses (name, slug, description, color, icon_name, display_order) VALUES
('Datos abiertos', 'datos-abiertos', 'Información estructurada y reutilizable, disponible en formatos abiertos.', '#16a34a', 'CircleCheck', 1),
('Disponible', 'disponible', 'Existe información pública pero puede requerir consulta mediante plataforma.', '#2563eb', 'CircleDashed', 2),
('Parcial', 'parcial', 'Información incompleta, fragmentada o en formatos poco reutilizables.', '#ca8a04', 'CircleDot', 3),
('Brecha', 'brecha', 'No se ha identificado un conjunto abierto y estructurado.', '#dc2626', 'CircleX', 4),
('No disponible', 'no-disponible', 'La información no está disponible públicamente.', '#6b7280', 'CircleOff', 5),
('En desarrollo', 'en-desarrollo', 'El conjunto de datos está en proceso de publicación.', '#ea580c', 'CircleLoader', 6),
('Pendiente de evaluación', 'pendiente-de-evaluacion', 'Todavía no ha sido analizado.', '#9ca3af', 'Circle', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INSTITUCIONES
-- ============================================================
INSERT INTO institutions (name, slug, acronym, description, website, display_order) VALUES
('Ministerio de Finanzas Públicas', 'ministerio-de-finanzas-publicas', 'MINFIN', 'Responsable de la política fiscal, presupuesto y contrataciones del Estado.', 'https://www.minfin.gob.gt', 1),
('Contraloría General de Cuentas', 'contraloria-general-de-cuentas', 'CGC', 'Entidad rectora del control gubernamental y la auditoría del Estado.', 'https://www.contraloria.gob.gt', 2),
('Tribunal Supremo Electoral', 'tribunal-supremo-electoral', 'TSE', 'Autoridad electoral responsable del financiamiento de partidos políticos.', 'https://www.tse.org.gt', 3),
('Congreso de la República', 'congreso-de-la-republica', 'CONGRESO', 'Órgano legislativo, responsable del presupuesto y votaciones.', 'https://www.congreso.gob.gt', 4),
('Secretaría de Planificación y Programación de la Presidencia', 'segeplan', 'SEGEPLAN', 'Planificación del desarrollo y cooperación internacional.', 'https://www.segeplan.gob.gt', 5),
('Registro Mercantil', 'registro-mercantil', 'REGMERC', 'Registro de comerciantes, empresas y sociedades mercantiles.', 'https://www.registromercantil.gob.gt', 6),
('Superintendencia de Administración Tributaria', 'superintendencia-de-administracion-tributaria', 'SAT', 'Entidad recaudadora de impuestos y aduanas.', 'https://www.sat.gob.gt', 7),
('Organismo Judicial', 'organismo-judicial', 'OJ', 'Administración de justicia y decisiones judiciales.', 'https://www.oj.gob.gt', 8),
('Registro General de la Propiedad', 'registro-general-de-la-propiedad', 'RGP', 'Registro de bienes inmuebles y propiedad.', 'https://www.registropropiedad.gob.gt', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TAGS
-- ============================================================
INSERT INTO tags (name, slug) VALUES
('Contrataciones públicas', 'contrataciones-publicas'),
('Beneficiarios finales', 'beneficiarios-finales'),
('Empresas', 'empresas'),
('Auditoría', 'auditoria'),
('Presupuesto', 'presupuesto'),
('Partidos políticos', 'partidos-politicos'),
('Infraestructura', 'infraestructura'),
('Funcionarios públicos', 'funcionarios-publicos'),
('PIDA', 'pida'),
('Lobbying', 'lobbying'),
('Patrimonio', 'patrimonio'),
('Impuestos', 'impuestos'),
('Propiedad', 'propiedad'),
('Sanciones', 'sanciones')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 30 TEMAS PIDA
-- ============================================================
INSERT INTO pida_topics (name, slug, description, category_id, dataset_type_id, icon_name, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, display_order) VALUES
-- 1-9: Individuos y organizaciones
('Registro de cabilderos', 'registro-de-cabilderos', 'Registro de personas y organizaciones que realizan actividades de cabildeo ante instituciones públicas.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'Megaphone', true, true, false, 1),
('Declaración de Intereses', 'declaracion-de-intereses', 'Declaraciones de intereses presentadas por servidores públicos y autoridades.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'FileText', true, true, true, 2),
('Registro de compañías', 'registro-de-companias', 'Registro público de empresas, sociedades y personas jurídicas.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'Building2', true, true, true, 3),
('Registro de organizaciones benéficas', 'registro-de-organizaciones-beneficas', 'Registro de organizaciones sin fines de lucro y de beneficencia.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'HeartHandshake', true, false, false, 4),
('Servidores públicos que intervienen en procesos de contratación', 'servidores-publicos-contratacion', 'Registro de funcionarios que participan en procesos de adquisición pública.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'UserCog', true, true, true, 5),
('Personas políticamente expuestas', 'personas-politicamente-expuestas', 'Listado de personas que ocupan o han ocupado cargos públicos de alto nivel.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'UserRoundCheck', true, true, true, 6),
('Registro de servidores públicos', 'registro-de-servidores-publicos', 'Registro completo de servidores públicos del Estado.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'Users', true, false, true, 7),
('Lista de contratistas de gobierno', 'lista-de-contratistas-de-gobierno', 'Listado de empresas y personas que contratan con el Estado.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'ListChecks', true, true, true, 8),
('Consejos consultivos de gobierno', 'consejos-consultivos-de-gobierno', 'Integración y funcionamiento de consejos consultivos del gobierno.', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), 'UsersRound', true, false, false, 9),
-- 10-18: Recursos públicos
('Financiamiento a partidos políticos', 'financiamiento-a-partidos-politicos', 'Ingresos, gastos y fuentes de financiamiento de partidos políticos.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'Landmark', true, true, true, 10),
('Presupuesto', 'presupuesto', 'Presupuesto general de la Nación y asignaciones por institución.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'PieChart', true, true, false, 11),
('Procesos de Adquisición', 'procesos-de-adquisicion', 'Procesos de compra y contratación realizados por instituciones públicas.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'ShoppingCart', true, true, true, 12),
('Licencias', 'licencias', 'Licencias, permisos y autorizaciones otorgados por entidades públicas.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'BadgeCheck', true, false, true, 13),
('Asociaciones público privadas', 'asociaciones-publico-privadas', 'Contratos de asociación entre el sector público y privado.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'Handshake', true, true, true, 14),
('Gasto', 'gasto', 'Ejecución del gasto público por institución, programa y partida.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'Banknote', true, true, false, 15),
('Subsidios de gobierno', 'subsidios-de-gobierno', 'Subsidios, transferencias y asignaciones del gobierno.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'Gift', true, true, false, 16),
('Cooperación internacional', 'cooperacion-internacional', 'Proyectos y fondos de cooperación internacional recibidos por el país.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'Globe', true, false, false, 17),
('Contratos de gobierno', 'contratos-de-gobierno', 'Contratos suscritos entre el Estado y proveedores.', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='registro'), 'FileSignature', true, true, true, 18),
-- 19-27: Regulación, procesos administrativos y registros
('Datos de auditorías', 'datos-de-auditorias', 'Informes y resultados de auditorías realizadas a instituciones públicas.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'SearchCheck', false, true, true, 19),
('Votaciones', 'votaciones', 'Registro de votaciones del Congreso y otros órganos deliberativos.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'Vote', true, false, false, 20),
('Decisiones judiciales', 'decisiones-judiciales', 'Sentencias y resoluciones del sistema de justicia.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'Scale', false, true, true, 21),
('Registro de obras de infraestructura prioritarias', 'registro-de-obras-de-infraestructura-prioritarias', 'Obras de infraestructura declaradas prioritarias por el Estado.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), 'HardHat', true, true, true, 22),
('Récord de reuniones', 'record-de-reuniones', 'Registro de reuniones de autoridades con actores externos.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'CalendarDays', true, true, false, 23),
('Cambios en regulaciones', 'cambios-en-regulaciones', 'Modificaciones a normas, reglamentos y disposiciones administrativas.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'ScrollText', true, false, false, 24),
('Promesas de campaña', 'promesas-de-campana', 'Compromisos asumidos por candidatos durante campañas electorales.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), 'Flag', true, false, false, 25),
('Contratistas sancionados', 'contratistas-sancionados', 'Listado de proveedores sancionados por incumplimiento o irregularidades.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), 'ShieldAlert', false, true, true, 26),
('Quejas a procesos de adquisición', 'quejas-a-procesos-de-adquisicion', 'Quejas e impugnaciones presentadas en procesos de compra pública.', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), 'MessageSquareWarning', false, true, true, 27),
-- 28-30: Extracción de rentas
('Registro público de la propiedad', 'registro-publico-de-la-propiedad', 'Registro de bienes inmuebles, derechos reales y transacciones patrimoniales.', (SELECT id FROM categories WHERE slug='extraccion-de-rentas'), (SELECT id FROM dataset_types WHERE slug='registro'), 'Landmark', true, true, true, 28),
('Impuestos', 'impuestos', 'Recaudación tributaria, declaraciones y estadísticas fiscales.', (SELECT id FROM categories WHERE slug='extraccion-de-rentas'), (SELECT id FROM dataset_types WHERE slug='transaccion'), 'Receipt', true, true, false, 29),
('Declaración patrimonial', 'declaracion-patrimonial', 'Declaraciones patrimoniales presentadas por servidores públicos.', (SELECT id FROM categories WHERE slug='extraccion-de-rentas'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), 'WalletCards', true, true, true, 30)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 30 DATASETS INICIALES (uno por tema PIDA)
-- ============================================================
-- Dataset 1: Registro de cabilderos
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Registro de cabilderos', 'registro-de-cabilderos', 'Registro de personas y organizaciones que realizan actividades de cabildeo.', 'Registro de personas y organizaciones que realizan actividades de cabildeo ante instituciones públicas de Guatemala. Permite identificar intereses que influyen en decisiones de política pública.', 'Megaphone', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='registro-de-cabilderos'), 0, true, now(), false, 'No se ha identificado un registro público de cabilderos en Guatemala. No existe normativa específica que regule esta actividad.', true, true, false, 'Nacional', 'N/D', 'Anual', 'N/D', 1)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 2: Declaración de Intereses
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Declaración de Intereses', 'declaracion-de-intereses', 'Declaraciones de intereses de servidores públicos.', 'Declaraciones de intereses presentadas por servidores públicos y autoridades guatemaltecas. Permiten identificar conflictos de interés potenciales.', 'FileText', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='declaracion-de-intereses'), 0, true, now(), false, 'No se ha identificado un registro público estructurado de declaraciones de intereses. La ley exige su presentación pero no su publicación sistemática.', true, true, true, 'Nacional', 'N/D', 'Anual', 'N/D', 2)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 3: Registro de compañías
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Registro de compañías', 'registro-de-companias', 'Registro público de empresas y sociedades mercantiles.', 'Registro público de empresas, sociedades mercantiles y personas jurídicas en Guatemala. Administrado por el Registro Mercantil.', 'Building2', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='registro-mercantil'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='registro-de-companias'), 2, true, now(), true, 'El Registro Mercantil permite consultas individuales pero no ofrece descarga masiva en formatos abiertos. No incluye información de beneficiarios finales.', true, true, true, 'Nacional', 'N/D', 'Continua', 'Restringido', 3)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 4: Registro de organizaciones benéficas
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Registro de organizaciones benéficas', 'registro-de-organizaciones-beneficas', 'Registro de organizaciones sin fines de lucro.', 'Registro de organizaciones sin fines de lucro, fundaciones y asociaciones de beneficencia en Guatemala.', 'HeartHandshake', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='pendiente-de-evaluacion'), true, (SELECT id FROM pida_topics WHERE slug='registro-de-organizaciones-beneficas'), 0, true, now(), NULL, 'Pendiente de evaluación. Existen registros dispersos en diferentes instituciones.', true, false, false, 'Nacional', 'N/D', 'Anual', 'N/D', 4)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 5: Servidores públicos en contratación
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Servidores públicos en procesos de contratación', 'servidores-publicos-en-procesos-de-contratacion', 'Funcionarios que participan en procesos de adquisición.', 'Registro de servidores públicos que intervienen en procesos de contratación pública en Guatemala.', 'UserCog', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='servidores-publicos-contratacion'), 0, true, now(), false, 'No se ha identificado un registro público estructurado de funcionarios que participan en procesos de contratación.', true, true, true, 'Nacional', 'N/D', 'N/D', 'N/D', 5)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 6: Personas políticamente expuestas
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Personas políticamente expuestas', 'personas-politicamente-expuestas', 'Listado de personas que ocupan cargos públicos de alto nivel.', 'Listado de personas que ocupan o han ocupado cargos públicos de alto nivel en Guatemala, relevantes para prevención de lavado de dinero y corrupción.', 'UserRoundCheck', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='personas-politicamente-expuestas'), 0, true, now(), false, 'No existe un listado público estructurado de personas políticamente expuestas.', true, true, true, 'Nacional', 'N/D', 'Anual', 'N/D', 6)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 7: Registro de servidores públicos
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Registro de servidores públicos', 'registro-de-servidores-publicos', 'Registro completo de servidores públicos del Estado.', 'Registro de servidores públicos del Estado de Guatemala, incluyendo cargos, instituciones y remuneraciones.', 'Users', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='registro-de-servidores-publicos'), 2, true, now(), true, 'Algunas instituciones publican nóminas de personal, pero no existe un registro centralizado y estructurado.', true, false, true, 'Nacional', 'N/D', 'Anual', 'N/D', 7)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 8: Lista de contratistas
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Lista de contratistas de gobierno', 'lista-de-contratistas-de-gobierno', 'Empresas y personas que contratan con el Estado.', 'Listado de empresas y personas que han contratado con el Estado de Guatemala. Información disponible parcialmente a través de Guatecompras.', 'ListChecks', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='lista-de-contratistas-de-gobierno'), 3, true, now(), true, 'La información se puede consultar en Guatecompras pero no como un listado descargable único. Requiere procesamiento.', true, true, true, 'Nacional', 'N/D', 'Continua', 'N/D', 8)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 9: Consejos consultivos
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Consejos consultivos de gobierno', 'consejos-consultivos-de-gobierno', 'Integración de consejos consultivos del gobierno.', 'Integración, funcionamiento y resoluciones de consejos consultivos del gobierno de Guatemala.', 'UsersRound', (SELECT id FROM categories WHERE slug='individuos-y-organizaciones'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='pendiente-de-evaluacion'), true, (SELECT id FROM pida_topics WHERE slug='consejos-consultivos-de-gobierno'), 0, true, now(), NULL, 'Pendiente de evaluación. No se ha identificado un registro centralizado.', true, false, false, 'Nacional', 'N/D', 'N/D', 'N/D', 9)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 10: Financiamiento a partidos políticos
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Financiamiento a partidos políticos', 'financiamiento-a-partidos-politicos', 'Ingresos, gastos y fuentes de financiamiento de partidos.', 'Información sobre ingresos, gastos y fuentes de financiamiento de partidos políticos en Guatemala, publicada por el TSE.', 'Landmark', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), (SELECT id FROM institutions WHERE slug='tribunal-supremo-electoral'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='financiamiento-a-partidos-politicos'), 2, true, now(), true, 'El TSE publica informes de financiamiento en PDF, pero no en formatos estructurados reutilizables.', true, true, true, 'Nacional', 'N/D', 'Anual', 'N/D', 10)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 11: Presupuesto
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Presupuesto General de la Nación', 'presupuesto-general-de-la-nacion', 'Presupuesto del Estado y asignaciones por institución.', 'Presupuesto General de la Nación de Guatemala, incluyendo asignaciones por institución, programa y partida presupuestaria.', 'PieChart', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='presupuesto'), 3, true, now(), true, 'MINFIN publica el presupuesto en su portal web. Existe información en formato Excel y PDF. No en formatos completamente abiertos.', true, true, false, 'Nacional', 'Anual', 'Anual', 'Acceso libre', 11)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 12: Procesos de Adquisición
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, source_url, display_order)
VALUES ('Procesos de compra en Guatecompras', 'procesos-de-compra-en-guatecompras', 'Procesos de adquisición realizados por instituciones públicas.', 'Procesos de compra y contratación realizados por instituciones públicas de Guatemala, publicados a través del sistema Guatecompras del MINFIN.', 'ShoppingCart', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='procesos-de-adquisicion'), 3, true, now(), true, 'Guatecompras permite consultar procesos de adquisición. La información está disponible pero no en formato OCDS completo ni como descarga masiva estructurada.', true, true, true, 'Nacional', '2003-presente', 'Continua', 'Acceso libre', 'https://www.guatecompras.gov.gt', 12)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 13: Licencias
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Licencias', 'licencias', 'Licencias y permisos otorgados por entidades públicas.', 'Licencias, permisos y autorizaciones otorgados por entidades públicas de Guatemala.', 'BadgeCheck', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), NULL, (SELECT id FROM statuses WHERE slug='pendiente-de-evaluacion'), true, (SELECT id FROM pida_topics WHERE slug='licencias'), 0, true, now(), NULL, 'Pendiente de evaluación. Las licencias están dispersas en múltiples instituciones.', true, false, true, 'Nacional', 'N/D', 'N/D', 'N/D', 13)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 14: Asociaciones público privadas
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Asociaciones público privadas', 'asociaciones-publico-privadas', 'Contratos de asociación entre el sector público y privado.', 'Contratos y proyectos de asociación entre el sector público y el sector privado en Guatemala.', 'Handshake', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='asociaciones-publico-privadas'), 0, true, now(), false, 'No se ha identificado un registro público de asociaciones público privadas.', true, true, true, 'Nacional', 'N/D', 'N/D', 'N/D', 14)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 15: Gasto
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Gasto público', 'gasto-publico', 'Ejecución del gasto público por institución.', 'Ejecución del gasto público de Guatemala, desglosado por institución, programa y partida presupuestaria.', 'Banknote', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='gasto'), 3, true, now(), true, 'MINFIN publica información de ejecución presupuestaria en su portal. Disponible en Excel.', true, true, false, 'Nacional', 'N/D', 'Mensual', 'Acceso libre', 15)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 16: Subsidios
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Subsidios de gobierno', 'subsidios-de-gobierno', 'Subsidios y transferencias del gobierno.', 'Subsidios, transferencias y asignaciones otorgadas por el gobierno de Guatemala.', 'Gift', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='subsidios-de-gobierno'), 1, true, now(), true, 'La información de subsidios está parcialmente disponible en informes presupuestarios, pero no como un registro específico y estructurado.', true, true, false, 'Nacional', 'N/D', 'Mensual', 'N/D', 16)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 17: Cooperación internacional
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Cooperación internacional', 'cooperacion-internacional', 'Proyectos y fondos de cooperación internacional.', 'Proyectos y fondos de cooperación internacional recibidos por Guatemala, administrados principalmente por SEGEPLAN.', 'Globe', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='transaccion'), (SELECT id FROM institutions WHERE slug='segeplan'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='cooperacion-internacional'), 2, true, now(), true, 'SEGEPLAN publica informes de cooperación, pero no como datos estructurados descargables.', true, false, false, 'Nacional', 'N/D', 'Anual', 'N/D', 17)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 18: Contratos de gobierno
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, source_url, display_order)
VALUES ('Contratos de gobierno', 'contratos-de-gobierno', 'Contratos suscritos entre el Estado y proveedores.', 'Contratos suscritos entre el Estado de Guatemala y proveedores de bienes y servicios. Información disponible a través de Guatecompras.', 'FileSignature', (SELECT id FROM categories WHERE slug='recursos-publicos'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='contratos-de-gobierno'), 3, true, now(), true, 'Los contratos pueden consultarse en Guatecompras. No existe un registro único de contratos firmados en formato descargable.', true, true, true, 'Nacional', 'N/D', 'Continua', 'Acceso libre', 'https://www.guatecompras.gov.gt', 18)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 19: Datos de auditorías
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, source_url, display_order)
VALUES ('Datos de auditorías', 'datos-de-auditorias', 'Informes y resultados de auditorías a instituciones públicas.', 'Informes y resultados de auditorías realizadas por la Contraloría General de Cuentas a instituciones públicas de Guatemala.', 'SearchCheck', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='transaccion'), (SELECT id FROM institutions WHERE slug='contraloria-general-de-cuentas'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='datos-de-auditorias'), 2, true, now(), true, 'La CGC publica informes de auditoría en PDF en su portal web. No están disponibles como datos estructurados.', false, true, true, 'Nacional', 'N/D', 'Continua', 'Acceso libre', 'https://www.contraloria.gob.gt', 19)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 20: Votaciones
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, source_url, display_order)
VALUES ('Votaciones del Congreso', 'votaciones-del-congreso', 'Registro de votaciones del Congreso de la República.', 'Registro de votaciones del Congreso de la República de Guatemala en sesiones plenarias.', 'Vote', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), (SELECT id FROM institutions WHERE slug='congreso-de-la-republica'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='votaciones'), 2, true, now(), true, 'El Congreso publica actas y resúmenes de votaciones, pero no como datos estructurados descargables.', true, false, false, 'Nacional', 'N/D', 'Sesión', 'N/D', 'https://www.congreso.gob.gt', 20)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 21: Decisiones judiciales
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, source_url, display_order)
VALUES ('Decisiones judiciales', 'decisiones-judiciales', 'Sentencias y resoluciones del sistema de justicia.', 'Sentencias y resoluciones del sistema de justicia guatemalteco, publicadas por el Organismo Judicial.', 'Scale', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='transaccion'), (SELECT id FROM institutions WHERE slug='organismo-judicial'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='decisiones-judiciales'), 2, true, now(), true, 'El Organismo Judicial publica resoluciones y sentencias en su portal, pero no como datos estructurados masivamente descargables.', false, true, true, 'Nacional', 'N/D', 'Continua', 'N/D', 'https://www.oj.gob.gt', 21)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 22: Infraestructura prioritaria
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Registro de obras de infraestructura prioritarias', 'registro-de-obras-de-infraestructura-prioritarias', 'Obras de infraestructura declaradas prioritarias.', 'Obras de infraestructura declaradas prioritarias por el Estado de Guatemala, incluyendo datos de ejecución y avance.', 'HardHat', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='registro-de-obras-de-infraestructura-prioritarias'), 1, true, now(), true, 'Algunas obras prioritarias se publican en portales institucionales, pero no existe un registro centralizado y estructurado.', true, true, true, 'Nacional', 'N/D', 'N/D', 'N/D', 22)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 23: Récord de reuniones
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Récord de reuniones', 'record-de-reuniones', 'Registro de reuniones de autoridades con actores externos.', 'Registro de reuniones sostenidas por autoridades públicas con representantes del sector privado, sociedad civil y otros actores.', 'CalendarDays', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='record-de-reuniones'), 0, true, now(), false, 'No se ha identificado un registro público sistemático de reuniones de autoridades con actores externos.', true, true, false, 'Nacional', 'N/D', 'N/D', 'N/D', 23)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 24: Cambios en regulaciones
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Cambios en regulaciones', 'cambios-en-regulaciones', 'Modificaciones a normas y disposiciones administrativas.', 'Modificaciones a normas, reglamentos y disposiciones administrativas del Estado de Guatemala.', 'ScrollText', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), NULL, (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='cambios-en-regulaciones'), 3, true, now(), true, 'El Diario de Centro América publica normas y reformas, pero no como datos estructurados.', true, false, false, 'Nacional', 'N/D', 'Diaria', 'Acceso libre', 24)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 25: Promesas de campaña
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Promesas de campaña', 'promesas-de-campana', 'Compromisos asumidos por candidatos durante campañas.', 'Compromisos y propuestas asumidos por candidatos durante campañas electorales en Guatemala.', 'Flag', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='tribunal-supremo-electoral'), (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='promesas-de-campana'), 0, true, now(), false, 'No existe un registro estructurado de promesas de campaña. El TSE no recopila esta información de manera sistemática.', true, false, false, 'Nacional', 'N/D', 'Electoral', 'N/D', 25)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 26: Contratistas sancionados
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Contratistas sancionados', 'contratistas-sancionados', 'Proveedores sancionados por irregularidades.', 'Listado de proveedores y contratistas sancionados por incumplimiento contractual o irregularidades en Guatemala.', 'ShieldAlert', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='ministerio-de-finanzas-publicas'), (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='contratistas-sancionados'), 0, true, now(), false, 'No se ha identificado un registro público estructurado de contratistas sancionados.', false, true, true, 'Nacional', 'N/D', 'N/D', 'N/D', 26)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 27: Quejas a procesos de adquisición
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Quejas a procesos de adquisición', 'quejas-a-procesos-de-adquisicion', 'Quejas e impugnaciones en procesos de compra pública.', 'Quejas, impugnaciones y recursos presentados en procesos de adquisición pública en Guatemala.', 'MessageSquareWarning', (SELECT id FROM categories WHERE slug='regulacion-procesos-administrativos-registros'), (SELECT id FROM dataset_types WHERE slug='registro'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='quejas-a-procesos-de-adquisicion'), 0, true, now(), false, 'No se ha identificado un registro público estructurado de quejas a procesos de adquisición.', false, true, true, 'Nacional', 'N/D', 'N/D', 'N/D', 27)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 28: Registro público de la propiedad
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Registro público de la propiedad', 'registro-publico-de-la-propiedad', 'Registro de bienes inmuebles y derechos reales.', 'Registro de bienes inmuebles, derechos reales y transacciones patrimoniales en Guatemala, administrado por el Registro General de la Propiedad.', 'Landmark', (SELECT id FROM categories WHERE slug='extraccion-de-rentas'), (SELECT id FROM dataset_types WHERE slug='registro'), (SELECT id FROM institutions WHERE slug='registro-general-de-la-propiedad'), (SELECT id FROM statuses WHERE slug='parcial'), true, (SELECT id FROM pida_topics WHERE slug='registro-publico-de-la-propiedad'), 2, true, now(), true, 'El Registro General de la Propiedad permite consultas individuales pero no ofrece descarga masiva en formatos abiertos.', true, true, true, 'Nacional', 'N/D', 'Continua', 'Restringido', 28)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 29: Impuestos
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Estadísticas tributarias', 'estadisticas-tributarias', 'Recaudación tributaria y estadísticas fiscales.', 'Recaudación tributaria, declaraciones y estadísticas fiscales de Guatemala, publicadas por la SAT.', 'Receipt', (SELECT id FROM categories WHERE slug='extraccion-de-rentas'), (SELECT id FROM dataset_types WHERE slug='transaccion'), (SELECT id FROM institutions WHERE slug='superintendencia-de-administracion-tributaria'), (SELECT id FROM statuses WHERE slug='disponible'), true, (SELECT id FROM pida_topics WHERE slug='impuestos'), 3, true, now(), true, 'La SAT publica estadísticas tributarias en su portal. Información disponible en Excel y PDF.', true, true, false, 'Nacional', 'N/D', 'Mensual', 'Acceso libre', 29)
ON CONFLICT (slug) DO NOTHING;

-- Dataset 30: Declaración patrimonial
INSERT INTO datasets (name, slug, short_description, description, icon_name, category_id, dataset_type_id, institution_id, status_id, is_pida, pida_topic_id, openness_level, published, published_at, guatemala_exists, guatemala_observations, anti_corruption_prevention, anti_corruption_detection, anti_corruption_investigation, coverage_geo, coverage_temporal, frequency, license, display_order)
VALUES ('Declaración patrimonial', 'declaracion-patrimonial', 'Declaraciones patrimoniales de servidores públicos.', 'Declaraciones patrimoniales presentadas por servidores públicos de Guatemala, que permiten verificar evolución patrimonial.', 'WalletCards', (SELECT id FROM categories WHERE slug='extraccion-de-rentas'), (SELECT id FROM dataset_types WHERE slug='divulgacion-publica'), NULL, (SELECT id FROM statuses WHERE slug='brecha'), true, (SELECT id FROM pida_topics WHERE slug='declaracion-patrimonial'), 0, true, now(), false, 'La ley exige declaración patrimonial pero no existe publicación pública estructurada de las declaraciones.', true, true, true, 'Nacional', 'N/D', 'Anual', 'N/D', 30)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DATASET_PIDA_RELATIONS
-- ============================================================
INSERT INTO dataset_pida_relations (dataset_id, pida_topic_id)
SELECT d.id, pt.id FROM datasets d JOIN pida_topics pt ON d.pida_topic_id = pt.id
WHERE d.is_pida = true AND d.pida_topic_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================================
-- DATASET_TAGS
-- ============================================================
INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'pida' WHERE d.is_pida = true
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'contrataciones-publicas'
WHERE d.slug IN ('procesos-de-compra-en-guatecompras','contratos-de-gobierno','lista-de-contratistas-de-gobierno','quejas-a-procesos-de-adquisicion','contratistas-sancionados')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'empresas'
WHERE d.slug IN ('registro-de-companias','lista-de-contratistas-de-gobierno','contratos-de-gobierno')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'funcionarios-publicos'
WHERE d.slug IN ('registro-de-servidores-publicos','servidores-publicos-en-procesos-de-contratacion','personas-politicamente-expuestas','declaracion-de-intereses','declaracion-patrimonial')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'presupuesto'
WHERE d.slug IN ('presupuesto-general-de-la-nacion','gasto-publico','subsidios-de-gobierno')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'partidos-politicos'
WHERE d.slug IN ('financiamiento-a-partidos-politicos','promesas-de-campana','votaciones-del-congreso')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'auditoria'
WHERE d.slug IN ('datos-de-auditorias')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'infraestructura'
WHERE d.slug IN ('registro-de-obras-de-infraestructura-prioritarias')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'lobbying'
WHERE d.slug IN ('registro-de-cabilderos','record-de-reuniones','consejos-consultivos-de-gobierno')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'patrimonio'
WHERE d.slug IN ('declaracion-patrimonial','declaracion-de-intereses')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'impuestos'
WHERE d.slug IN ('estadisticas-tributarias')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'propiedad'
WHERE d.slug IN ('registro-publico-de-la-propiedad')
ON CONFLICT DO NOTHING;

INSERT INTO dataset_tags (dataset_id, tag_id)
SELECT d.id, t.id FROM datasets d JOIN tags t ON t.slug = 'sanciones'
WHERE d.slug IN ('contratistas-sancionados')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SETTINGS
-- ============================================================
INSERT INTO settings (key, value) VALUES
('portal_name', 'CNC Guatemala | Datos para la Integridad'),
('portal_title', 'Datos para la Integridad'),
('portal_subtitle', 'Directorio de Datos Abiertos Anticorrupción'),
('hero_title', 'Datos abiertos para prevenir y combatir la corrupción'),
('hero_text', 'Descubre conjuntos de datos públicos de Guatemala que pueden utilizarse para fortalecer la transparencia, identificar riesgos de corrupción, realizar investigaciones y promover el control ciudadano.'),
('hero_image', ''),
('contact_email', 'contacto@cnc.gob.gt'),
('footer_text', 'Comisión Nacional contra la Corrupción — CNC Guatemala. Directorio de Datos Abiertos Anticorrupción.'),
('about_text', 'El Directorio de Datos Abiertos Anticorrupción es una iniciativa de la Comisión Nacional contra la Corrupción de Guatemala para centralizar, clasificar y facilitar el acceso a conjuntos de datos públicos útiles para prevenir, detectar, investigar y analizar riesgos de corrupción.'),
('pida_methodology', 'El Programa Interamericano de Datos Abiertos para Prevenir y Combatir la Corrupción (PIDA) de la OEA identifica conjuntos de datos estratégicos que los Estados deberían publicar para fortalecer la transparencia y la lucha contra la corrupción. Este portal adapta dichos conjuntos al contexto de Guatemala.'),
('logo_cnc', ''),
('logo_pida', ''),
('social_twitter', ''),
('social_facebook', ''),
('social_instagram', ''),
('social_linkedin', ''),
('hero_search_placeholder', '¿Qué datos estás buscando?')
ON CONFLICT (key) DO NOTHING;
