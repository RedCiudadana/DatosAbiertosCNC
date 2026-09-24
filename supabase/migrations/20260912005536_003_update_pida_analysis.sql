/*
# Actualización del análisis PIDA para Guatemala

Actualiza los 30 conjuntos PIDA con:
1. Estados de disponibilidad corregidos según investigación real
2. Instituciones responsables reales (8 instituciones nuevas)
3. Hallazgos detallados por conjunto (guatemala_observations)
4. Enlaces oficiales verificados (source_url)
5. Niveles de apertura ajustados
6. Recursos (enlaces) para cada conjunto con URL explícita
7. Fecha de evaluación y evaluador

### Nuevas instituciones:
- REPEJU / MINGOB (personas jurídicas no lucrativas)
- ONSEC (servicio civil)
- SIB (Superintendencia de Bancos - PEP)
- MARN (licencias ambientales)
- MIDES (subsidios)
- ANADIE (asociaciones público-privadas)
- Diario de Centro América (normas)
- Corte de Constitucionalidad (jurisprudencia)

### Cambios de estado por conjunto:
- 3 conjuntos cambiaron a "Datos abiertos" (🟢): contratistas, presupuesto, procesos de adquisición, gasto, cooperación, contratos, infraestructura
- Varios cambiaron de "Brecha" a "Parcial" o "Disponible" según el hallazgo real
- Evaluación realizada el 2026-09-12
*/

-- ============================================================
-- NUEVAS INSTITUCIONES
-- ============================================================
INSERT INTO institutions (name, slug, acronym, description, website, display_order) VALUES
('Registro de las Personas Jurídicas', 'repeju-mingob', 'REPEJU', 'Registro de personas jurídicas no lucrativas, asociaciones, fundaciones y ONG.', 'https://repeju.gob.gt/', 10),
('Oficina Nacional de Servicio Civil', 'onsec', 'ONSEC', 'Ente rector del servicio civil. Administra información de servidores públicos.', 'https://www.onsec.gob.gt/', 11),
('Superintendencia de Bancos', 'superintendencia-de-bancos', 'SIB', 'Entidad supervisora del sistema financiero. Mantiene listados de personas políticamente expuestas.', 'https://www.sib.gob.gt/', 12),
('Ministerio de Ambiente y Recursos Naturales', 'marn', 'MARN', 'Ministerio responsable de la gestión ambiental y licencias ambientales.', 'https://www.marn.gob.gt/', 13),
('Ministerio de Desarrollo Social', 'mides', 'MIDES', 'Ministerio responsable de programas sociales, subsidios y transferencias.', 'https://www.mides.gob.gt/', 14),
('Agencia Nacional de Alianzas para el Desarrollo de Infraestructura Económica', 'anadie', 'ANADIE', 'Entidad responsable de proyectos de asociaciones público-privadas.', 'https://anadie.gob.gt/', 15),
('Diario de Centro América', 'diario-de-centro-america', 'DCA', 'Diario oficial de Guatemala. Publica leyes, decretos y disposiciones normativas.', 'https://dca.gob.gt/', 16),
('Corte de Constitucionalidad', 'corte-de-constitucionalidad', 'CC', 'Tribunal constitucional. Mantiene sistema de consulta de jurisprudencia.', 'https://www.cc.gob.gt/', 17)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ACTUALIZAR LOS 30 DATASETS
-- ============================================================

-- 1. Registro de cabilderos → 🔴 Brecha
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'brecha'),
  institution_id = NULL,
  guatemala_exists = false,
  guatemala_observations = 'No identifiqué un registro público nacional de cabilderos/lobby. No existe normativa específica que regule esta actividad en Guatemala.',
  source_url = NULL,
  openness_level = 0,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  guatemala_regulatory_framework = 'No existe normativa específica sobre cabildeo en Guatemala.',
  updated_at = now()
WHERE slug = 'registro-de-cabilderos';

-- 2. Declaración de intereses → 🔴 Brecha
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'brecha'),
  institution_id = NULL,
  guatemala_exists = false,
  guatemala_observations = 'No identifiqué un registro público estructurado de declaraciones de intereses de funcionarios. La ley exige su presentación pero no su publicación sistemática.',
  source_url = NULL,
  openness_level = 0,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  guatemala_regulatory_framework = 'La Ley de Probidad exige declaración de intereses pero no establece publicación pública estructurada.',
  updated_at = now()
WHERE slug = 'declaracion-de-intereses';

-- 3. Registro de compañías → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'registro-mercantil'),
  guatemala_exists = true,
  guatemala_observations = 'El Registro Mercantil permite consultar sociedades, empresas y comerciantes a través de SEDEVIRTUAL. Permite consultas individuales pero no es una descarga masiva abierta. No incluye información de beneficiarios finales.',
  source_url = 'https://sedevirtual.registromercantil.gob.gt/sedevirtual/',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Restringido',
  updated_at = now()
WHERE slug = 'registro-de-companias';

-- 4. Registro de organizaciones benéficas → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'repeju-mingob'),
  guatemala_exists = true,
  guatemala_observations = 'REPEJU registra personas jurídicas no lucrativas, asociaciones, ONG y otras entidades. No identifiqué un padrón nacional completo descargable en formatos abiertos.',
  source_url = 'https://repeju.gob.gt/',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'registro-de-organizaciones-beneficas';

-- 5. Servidores públicos en contratación → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'Los procesos de GUATECOMPRAS identifican unidades compradoras y distintos actores, pero no encontré un dataset nacional específico de funcionarios que participan en contratación.',
  source_url = 'https://www.guatecompras.gt/',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'servidores-publicos-en-procesos-de-contratacion';

-- 6. Personas políticamente expuestas → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'superintendencia-de-bancos'),
  guatemala_exists = true,
  guatemala_observations = 'La SIB dispone de criterios y listados de cargos públicos relevantes considerados PEP, pero esto no equivale a un registro nominal e histórico abierto de las personas.',
  source_url = 'https://infpb.sib.gob.gt/c/document_library/get_file?folderId=12584&name=DLFE-22765.pdf',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'personas-politicamente-expuestas';

-- 7. Registro de servidores públicos → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'onsec'),
  guatemala_exists = true,
  guatemala_observations = 'ONSEC cuenta con la Ficha de Información de Servidores Públicos dentro de SIARH. Incluye datos laborales y salariales, pero no es actualmente un padrón nacional abierto.',
  source_url = 'https://www.onsec.gob.gt/w1/index.php/2025/07/21/onsec-presenta-ficha-de-informacion-de-servidores-publicos/',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'registro-de-servidores-publicos';

-- 8. Lista de contratistas de gobierno → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'Existe el Registro de Proveedores/RGAE, con archivos XLSX y acceso mediante API del catálogo de datos abiertos del MINFIN.',
  source_url = 'https://datos.minfin.gob.gt/dataset/?groups=contratistas-y-proveedores-del-estado-rgae&organization=minfin&tags=proveedores',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'lista-de-contratistas-de-gobierno';

-- 9. Consejos consultivos de gobierno → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = NULL,
  guatemala_exists = true,
  guatemala_observations = 'Existen múltiples consejos, juntas y comisiones en distintas instituciones, pero no identifiqué un directorio nacional estructurado de órganos consultivos y sus integrantes.',
  source_url = NULL,
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'consejos-consultivos-de-gobierno';

-- 10. Financiamiento a partidos políticos → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'tribunal-supremo-electoral'),
  guatemala_exists = true,
  guatemala_observations = 'El TSE dispone de Cuentas Claras, que permite consultar información relativa a ingresos, gastos y financiamiento político de partidos. No es un dataset descargable en formatos abiertos.',
  source_url = 'https://cuentasclaras.tse.org.gt/',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'financiamiento-a-partidos-politicos';

-- 11. Presupuesto → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'El portal de datos abiertos del MINFIN publica información presupuestaria en formatos reutilizables (CSV, XLSX).',
  source_url = 'https://datos.minfin.gob.gt/',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'presupuesto-general-de-la-nacion';

-- 12. Procesos de adquisición → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'Guatemala cuenta con datos de concursos, adquisiciones y otros componentes de contratación pública en GUATECOMPRAS y el portal de datos abiertos del MINFIN.',
  source_url = 'https://datos.minfin.gob.gt/',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'procesos-de-compra-en-guatecompras';

-- 13. Licencias → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'marn'),
  guatemala_exists = true,
  guatemala_observations = 'Existen registros sectoriales. MARN permite validar licencias ambientales, pero no existe un registro nacional unificado de licencias de todas las instituciones.',
  source_url = 'https://apps.marn.gob.gt/Consultas/Licencia/ConsultaLicencia.aspx',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'licencias';

-- 14. Asociaciones público-privadas → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'anadie'),
  guatemala_exists = true,
  guatemala_observations = 'Existe información pública sobre proyectos APP en el portal de ANADIE, pero no identifiqué un dataset abierto consolidado equivalente al estándar PIDA.',
  source_url = 'https://anadie.gob.gt/',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'asociaciones-publico-privadas';

-- 15. Gasto público → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'La ejecución presupuestaria del MINFIN permite analizar el gasto público mediante información fiscal estructurada en formatos reutilizables.',
  source_url = 'https://datos.minfin.gob.gt/',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'gasto-publico';

-- 16. Subsidios de gobierno → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'mides'),
  guatemala_exists = true,
  guatemala_observations = 'MIDES publica montos, criterios y padrones de programas, incluyendo archivos en formato abierto. No cubre todos los subsidios del Estado de Guatemala.',
  source_url = 'https://www.mides.gob.gt/15-programas-de-subsidios-becas-o-transferencias/',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'subsidios-de-gobierno';

-- 17. Cooperación internacional → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'segeplan'),
  guatemala_exists = true,
  guatemala_observations = 'SEGEPLAN publica proyectos, desembolsos y procesos de cooperación en formatos CSV/XLSX y señala acceso mediante API en su portal de datos abiertos.',
  source_url = 'https://datos.segeplan.gob.gt/dataset/?_tags_limit=0&groups=cooperacion',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'cooperacion-internacional';

-- 18. Contratos de gobierno → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'Buena parte de la información contractual y de adjudicación puede recuperarse desde el ecosistema de contratación pública de GUATECOMPRAS y el portal de datos del MINFIN.',
  source_url = 'https://www.guatecompras.gt/',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'contratos-de-gobierno';

-- 19. Datos de auditorías → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'contraloria-general-de-cuentas'),
  guatemala_exists = true,
  guatemala_observations = 'La CGC publica informes de auditoría, pero principalmente como documentos PDF. Falta un dataset estructurado de hallazgos, montos y recomendaciones.',
  source_url = 'https://www.contraloria.gob.gt/index.php/informes-de-auditoria-cgc/',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'datos-de-auditorias';

-- 20. Votaciones → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'congreso-de-la-republica'),
  guatemala_exists = true,
  guatemala_observations = 'Existe consulta pública de votaciones del Pleno del Congreso, incluyendo las sesiones de 2026. No es un dataset estructurado descargable.',
  source_url = 'https://www.congreso.gob.gt/seccion_informacion_legislativa/votaciones_pleno',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'votaciones-del-congreso';

-- 21. Decisiones judiciales → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'corte-de-constitucionalidad'),
  guatemala_exists = true,
  guatemala_observations = 'La Corte de Constitucionalidad cuenta con un sistema avanzado de consulta de jurisprudencia constitucional, pero no representa todas las decisiones del sistema judicial (Organismo Judicial).',
  source_url = 'https://jurisprudencia.cc.gob.gt/ptmp/Expediente.aspx',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'decisiones-judiciales';

-- 22. Infraestructura prioritaria → 🟢 Abierto
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'datos-abiertos'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'segeplan'),
  guatemala_exists = true,
  guatemala_observations = 'SEGEPLAN publica seguimiento de inversión con código SNIP, proyecto, costos, entidad, municipio, coordenadas, estado y montos en formatos CSV/XLSX.',
  source_url = 'https://datos.segeplan.gob.gt/dataset/informes-de-seguimiento-de-la-inversion-2026',
  openness_level = 5,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Acceso libre',
  updated_at = now()
WHERE slug = 'registro-de-obras-de-infraestructura-prioritarias';

-- 23. Récord de reuniones → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'congreso-de-la-republica'),
  guatemala_exists = true,
  guatemala_observations = 'El Congreso publica actas descargables de sus sesiones, pero Guatemala no cuenta con un registro transversal de reuniones o agendas de altos funcionarios.',
  source_url = 'https://www.congreso.gob.gt/seccion_informacion_legislativa/actas_de_sesion',
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'record-de-reuniones';

-- 24. Cambios en regulaciones → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'diario-de-centro-america'),
  guatemala_exists = true,
  guatemala_observations = 'Las nuevas normas se publican oficialmente en el Diario de Centro América, pero no identifiqué un dataset que estructure las modificaciones regulatorias y su trazabilidad.',
  source_url = 'https://dca.gob.gt/',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'cambios-en-regulaciones';

-- 25. Promesas de campaña → 🟡 Parcial
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'parcial'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'tribunal-supremo-electoral'),
  guatemala_exists = true,
  guatemala_observations = 'Existen planes de gobierno y propuestas electorales disponibles, pero no un dataset oficial estructurado para registrar y dar seguimiento a promesas de campaña.',
  source_url = NULL,
  openness_level = 2,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'promesas-de-campana';

-- 26. Contratistas sancionados → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'GUATECOMPRAS dispone de consulta pública de proveedores inhabilitados/sancionados. No es un dataset descargable sino una consulta web.',
  source_url = 'https://www.guatecompras.gt/inhabilitaciones/consultaProveeInhabRes.aspx',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'contratistas-sancionados';

-- 27. Quejas a procesos de adquisición → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'ministerio-de-finanzas-publicas'),
  guatemala_exists = true,
  guatemala_observations = 'El sistema GUATECOMPRAS registra y permite consultar inconformidades relacionadas con procedimientos de contratación pública.',
  source_url = 'https://www.guatecompras.gt/Inconformidad/consultaAvInc.aspx?opt=Search',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'quejas-a-procesos-de-adquisicion';

-- 28. Registro público de la propiedad → 🔵 Consulta pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'registro-general-de-la-propiedad'),
  guatemala_exists = true,
  guatemala_observations = 'Existe Consulta a Distancia del Registro General de la Propiedad; requiere usuario y saldo, por lo que no puede considerarse un dataset abierto.',
  source_url = 'https://www.rgp.org.gt/rgp-virtual/consulta-distancia',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  license = 'Restringido',
  updated_at = now()
WHERE slug = 'registro-publico-de-la-propiedad';

-- 29. Impuestos → 🔵 Divulgación pública
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'disponible'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'superintendencia-de-administracion-tributaria'),
  guatemala_exists = true,
  guatemala_observations = 'SAT dispone de estadísticas tributarias y series relacionadas con recaudación; requiere una evaluación adicional a nivel de recursos para determinar apertura completa conforme a PIDA.',
  source_url = 'https://portal.sat.gob.gt/portal/estadisticas-tributarias-sat/',
  openness_level = 3,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  updated_at = now()
WHERE slug = 'estadisticas-tributarias';

-- 30. Declaración patrimonial → 🔴 Brecha
UPDATE datasets SET
  status_id = (SELECT id FROM statuses WHERE slug = 'brecha'),
  institution_id = (SELECT id FROM institutions WHERE slug = 'contraloria-general-de-cuentas'),
  guatemala_exists = false,
  guatemala_observations = 'La declaración jurada patrimonial existe y es obligatoria para determinados funcionarios, pero no identifiqué publicación abierta de los registros o principales variables de las declaraciones. La CGC administra el proceso pero no publica los datos.',
  source_url = 'https://www.contraloria.gob.gt/index.php/declaracion-jurada-patrimonial/',
  openness_level = 0,
  guatemala_evaluation_date = '2026-09-12',
  guatemala_evaluated_by = 'Equipo CNC Guatemala',
  guatemala_regulatory_framework = 'La Ley de Probidad establece la obligación de declaración jurada patrimonial ante la CGC.',
  updated_at = now()
WHERE slug = 'declaracion-patrimonial';

-- ============================================================
-- RECURSOS: Agregar enlaces oficiales como recursos
-- ============================================================

-- 3. Registro de compañías
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'SEDEVIRTUAL - Registro Mercantil', 'Portal de consulta virtual del Registro Mercantil de Guatemala.', 'portal', NULL, 'https://sedevirtual.registromercantil.gob.gt/sedevirtual/', true, 1
FROM datasets WHERE slug = 'registro-de-companias'
ON CONFLICT DO NOTHING;

-- 4. Registro de organizaciones benéficas
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'REPEJU - Registro de Personas Jurídicas', 'Portal del Registro de las Personas Jurídicas de Guatemala.', 'portal', NULL, 'https://repeju.gob.gt/', true, 1
FROM datasets WHERE slug = 'registro-de-organizaciones-beneficas'
ON CONFLICT DO NOTHING;

-- 5. Servidores públicos en contratación
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'GUATECOMPRAS', 'Sistema de información de contrataciones y adquisiciones del Estado.', 'portal', NULL, 'https://www.guatecompras.gt/', true, 1
FROM datasets WHERE slug = 'servidores-publicos-en-procesos-de-contratacion'
ON CONFLICT DO NOTHING;

-- 6. PEP
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'SIB - Listado de cargos PEP', 'Documento con criterios y listado de cargos públicos relevantes considerados PEP por la SIB.', 'document', 'PDF', 'https://infpb.sib.gob.gt/c/document_library/get_file?folderId=12584&name=DLFE-22765.pdf', true, 1
FROM datasets WHERE slug = 'personas-politicamente-expuestas'
ON CONFLICT DO NOTHING;

-- 7. Registro de servidores públicos
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'ONSEC - Ficha de Servidores Públicos', 'Ficha de información de servidores públicos dentro de SIARH.', 'portal', NULL, 'https://www.onsec.gob.gt/w1/index.php/2025/07/21/onsec-presenta-ficha-de-informacion-de-servidores-publicos/', true, 1
FROM datasets WHERE slug = 'registro-de-servidores-publicos'
ON CONFLICT DO NOTHING;

-- 8. Lista de contratistas
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Datos abiertos MINFIN - RGAE', 'Portal de datos abiertos del MINFIN con registro de proveedores y contratistas del Estado.', 'portal', 'CSV', 'https://datos.minfin.gob.gt/dataset/?groups=contratistas-y-proveedores-del-estado-rgae&organization=minfin&tags=proveedores', true, 1
FROM datasets WHERE slug = 'lista-de-contratistas-de-gobierno'
ON CONFLICT DO NOTHING;

-- 10. Financiamiento a partidos políticos
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Cuentas Claras TSE', 'Sistema de consulta de ingresos, gastos y financiamiento de partidos políticos.', 'portal', NULL, 'https://cuentasclaras.tse.org.gt/', true, 1
FROM datasets WHERE slug = 'financiamiento-a-partidos-politicos'
ON CONFLICT DO NOTHING;

-- 11. Presupuesto
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Portal de datos abiertos MINFIN', 'Portal de datos abiertos del Ministerio de Finanzas Públicas con información presupuestaria.', 'portal', 'CSV', 'https://datos.minfin.gob.gt/', true, 1
FROM datasets WHERE slug = 'presupuesto-general-de-la-nacion'
ON CONFLICT DO NOTHING;

-- 12. Procesos de adquisición
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'GUATECOMPRAS', 'Sistema de información de contrataciones y adquisiciones del Estado de Guatemala.', 'portal', NULL, 'https://www.guatecompras.gt/', true, 1
FROM datasets WHERE slug = 'procesos-de-compra-en-guatecompras'
ON CONFLICT DO NOTHING;

INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Datos abiertos MINFIN - Contrataciones', 'Datos de contrataciones en formatos reutilizables.', 'portal', 'CSV', 'https://datos.minfin.gob.gt/', true, 2
FROM datasets WHERE slug = 'procesos-de-compra-en-guatecompras'
ON CONFLICT DO NOTHING;

-- 13. Licencias
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'MARN - Consulta de Licencias Ambientales', 'Sistema de consulta de licencias ambientales del Ministerio de Ambiente.', 'portal', NULL, 'https://apps.marn.gob.gt/Consultas/Licencia/ConsultaLicencia.aspx', true, 1
FROM datasets WHERE slug = 'licencias'
ON CONFLICT DO NOTHING;

-- 14. Asociaciones público-privadas
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'ANADIE', 'Portal de la Agencia Nacional de Alianzas para el Desarrollo de Infraestructura Económica.', 'portal', NULL, 'https://anadie.gob.gt/', true, 1
FROM datasets WHERE slug = 'asociaciones-publico-privadas'
ON CONFLICT DO NOTHING;

-- 15. Gasto público
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Portal de datos abiertos MINFIN', 'Ejecución presupuestaria y gasto público en formatos reutilizables.', 'portal', 'CSV', 'https://datos.minfin.gob.gt/', true, 1
FROM datasets WHERE slug = 'gasto-publico'
ON CONFLICT DO NOTHING;

-- 16. Subsidios
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'MIDES - Programas de subsidios', 'Programas de subsidios, becas y transferencias del Ministerio de Desarrollo Social.', 'portal', NULL, 'https://www.mides.gob.gt/15-programas-de-subsidios-becas-o-transferencias/', true, 1
FROM datasets WHERE slug = 'subsidios-de-gobierno'
ON CONFLICT DO NOTHING;

-- 17. Cooperación internacional
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Datos abiertos SEGEPLAN - Cooperación', 'Proyectos y desembolsos de cooperación internacional en CSV/XLSX.', 'portal', 'CSV', 'https://datos.segeplan.gob.gt/dataset/?_tags_limit=0&groups=cooperacion', true, 1
FROM datasets WHERE slug = 'cooperacion-internacional'
ON CONFLICT DO NOTHING;

-- 18. Contratos de gobierno
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'GUATECOMPRAS', 'Sistema de contrataciones del Estado con información de contratos y adjudicaciones.', 'portal', NULL, 'https://www.guatecompras.gt/', true, 1
FROM datasets WHERE slug = 'contratos-de-gobierno'
ON CONFLICT DO NOTHING;

-- 19. Datos de auditorías
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'CGC - Informes de Auditoría', 'Informes de auditoría publicados por la Contraloría General de Cuentas.', 'portal', 'PDF', 'https://www.contraloria.gob.gt/index.php/informes-de-auditoria-cgc/', true, 1
FROM datasets WHERE slug = 'datos-de-auditorias'
ON CONFLICT DO NOTHING;

-- 20. Votaciones
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Congreso - Votaciones del Pleno', 'Consulta pública de votaciones del pleno del Congreso de la República.', 'portal', NULL, 'https://www.congreso.gob.gt/seccion_informacion_legislativa/votaciones_pleno', true, 1
FROM datasets WHERE slug = 'votaciones-del-congreso'
ON CONFLICT DO NOTHING;

-- 21. Decisiones judiciales
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'CC - Jurisprudencia Constitucional', 'Sistema de consulta de jurisprudencia de la Corte de Constitucionalidad.', 'portal', NULL, 'https://jurisprudencia.cc.gob.gt/ptmp/Expediente.aspx', true, 1
FROM datasets WHERE slug = 'decisiones-judiciales'
ON CONFLICT DO NOTHING;

-- 22. Infraestructura prioritaria
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'SEGEPLAN - Seguimiento de Inversión 2026', 'Informes de seguimiento de inversión pública con SNIP, costos, entidad, municipio y coordenadas.', 'portal', 'CSV', 'https://datos.segeplan.gob.gt/dataset/informes-de-seguimiento-de-la-inversion-2026', true, 1
FROM datasets WHERE slug = 'registro-de-obras-de-infraestructura-prioritarias'
ON CONFLICT DO NOTHING;

-- 23. Récord de reuniones
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Congreso - Actas de Sesión', 'Actas descargables de las sesiones del Congreso de la República.', 'document', 'PDF', 'https://www.congreso.gob.gt/seccion_informacion_legislativa/actas_de_sesion', true, 1
FROM datasets WHERE slug = 'record-de-reuniones'
ON CONFLICT DO NOTHING;

-- 24. Cambios en regulaciones
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'Diario de Centro América', 'Diario oficial de Guatemala con publicación de leyes, decretos y disposiciones.', 'portal', NULL, 'https://dca.gob.gt/', true, 1
FROM datasets WHERE slug = 'cambios-en-regulaciones'
ON CONFLICT DO NOTHING;

-- 26. Contratistas sancionados
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'GUATECOMPRAS - Proveedores Inhabilitados', 'Consulta de proveedores inhabilitados y sancionados.', 'portal', NULL, 'https://www.guatecompras.gt/inhabilitaciones/consultaProveeInhabRes.aspx', true, 1
FROM datasets WHERE slug = 'contratistas-sancionados'
ON CONFLICT DO NOTHING;

-- 27. Quejas a procesos de adquisición
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'GUATECOMPRAS - Inconformidades', 'Consulta de inconformidades presentadas en procedimientos de contratación.', 'portal', NULL, 'https://www.guatecompras.gt/Inconformidad/consultaAvInc.aspx?opt=Search', true, 1
FROM datasets WHERE slug = 'quejas-a-procesos-de-adquisicion'
ON CONFLICT DO NOTHING;

-- 28. Registro público de la propiedad
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'RGP - Consulta a Distancia', 'Sistema de consulta del Registro General de la Propiedad (requiere usuario).', 'portal', NULL, 'https://www.rgp.org.gt/rgp-virtual/consulta-distancia', true, 1
FROM datasets WHERE slug = 'registro-publico-de-la-propiedad'
ON CONFLICT DO NOTHING;

-- 29. Impuestos
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'SAT - Estadísticas Tributarias', 'Portal de estadísticas tributarias de la Superintendencia de Administración Tributaria.', 'portal', NULL, 'https://portal.sat.gob.gt/portal/estadisticas-tributarias-sat/', true, 1
FROM datasets WHERE slug = 'estadisticas-tributarias'
ON CONFLICT DO NOTHING;

-- 30. Declaración patrimonial
INSERT INTO resources (dataset_id, name, description, type, format, url, is_active, display_order)
SELECT id, 'CGC - Declaración Jurada Patrimonial', 'Información sobre el proceso de declaración jurada patrimonial ante la CGC.', 'portal', NULL, 'https://www.contraloria.gob.gt/index.php/declaracion-jurada-patrimonial/', true, 1
FROM datasets WHERE slug = 'declaracion-patrimonial'
ON CONFLICT DO NOTHING;

-- ============================================================
-- Actualizarinstitution_id en pida_topics donde corresponda
-- ============================================================
UPDATE pida_topics SET
  category_id = (SELECT id FROM categories WHERE slug = 'extraccion-de-rentas')
WHERE slug = 'registro-publico-de-la-propiedad' AND category_id IS NULL;
