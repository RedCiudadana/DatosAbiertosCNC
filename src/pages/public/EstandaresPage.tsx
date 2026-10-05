import { Link } from 'react-router-dom';
import {
  ArrowRight, ExternalLink, CheckCircle2, BookOpen,
} from 'lucide-react';

interface Standard {
  name: string;
  fullName: string;
  logo: string;
  color: string;
  bgColor: string;
  description: string;
  principles: string[];
  relevance: string;
  url: string;
  urlLabel: string;
}

const standards: Standard[] = [
  {
    name: 'Open Data Charter',
    fullName: 'Carta de Datos Abiertos',
    logo: 'https://opendatacharter.org/wp-content/themes/open-data-theme/images/svg/ODC_Logo.svg',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    description:
      'Iniciativa global que define seis principios para que los datos gubernamentales sean abiertos por defecto, accesibles, reutilizables y distribuibles por anyone. Promueve la transparencia, la rendición de cuentas y la innovación mediante la publicación proactiva de datos.',
    principles: [
      'Abierto por defecto',
      'Oportuno y exhaustivo',
      'Accesible y utilizable',
      'Comparable e interoperable',
      'Para una mejor gobernanza y mejor participación ciudadana',
      'Inclusivo en su desarrollo y participación',
    ],
    relevance:
      'El portal adopta los principios de la Carta para asegurar que los datos anticorrupción se publiquen en formatos abiertos, de manera oportuna y con documentación que permita su reutilización.',
    url: 'https://opendatacharter.org/',
    urlLabel: 'opendatacharter.org',
  },
  {
    name: 'PIDA',
    fullName: 'Programa Interamericano de Datos Abiertos contra la Corrupción (OEA)',
    logo: 'https://www.oas.org/ext/es/democracia/programa-interamericano-de-datos-abiertos-para-prevenir-y-combatir-la-corrupcion-pida',
    color: 'text-cnc-700',
    bgColor: 'bg-cnc-50',
    description:
      'Iniciativa de la Organización de los Estados Americanos (OEA) que identifica conjuntos de datos prioritarios para prevenir y detectar la corrupción. Define un conjunto mínimo de datos que los países deberían publicar para fortalecer la transparencia en la gestión pública.',
    principles: [
      'Conjuntos de datos prioritarios anticorrupción',
      'Mapeo de disponibilidad por país',
      'Recomendaciones de publicación por conjuntos',
      'Enfoque en prevención, detección e investigación',
      'Interoperabilidad entre conjuntos mediante identificadores comunes',
    ],
    relevance:
      'El portal mapea los conjuntos PIDA y evalúa su disponibilidad en Guatemala, identificando cuáles están publicados, cuáles son parciales y cuáles constituyen brechas prioritarias.',
    url: 'https://www.oas.org/ext/es/democracia/programa-interamericano-de-datos-abiertos-para-prevenir-y-combatir-la-corrupcion-pida',
    urlLabel: 'oas.org',
  },
  {
    name: 'CoST Transparency',
    fullName: 'Construction Sector Transparency Initiative',
    logo: 'https://infrastructuretransparency.org/wp-content/themes/cost/images/logo.png',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    description:
      'Estándar internacional enfocado en la transparencia de la infraestructura pública. CoST promueve la divulgación de datos en cada etapa del ciclo de proyectos de infraestructura: desde la planificación y el diseño, hasta la contratación, ejecución y entrega de obras.',
    principles: [
      'Divulgación proactiva en proyectos de infraestructura',
      'Datos en cada etapa del ciclo del proyecto',
      'Validación social mediante mesas multiactor',
      'Estándar de datos para infraestructura (IDS)',
      'Seguimiento de plazos, costos y modificaciones',
    ],
    relevance:
      'El portal incorpora datos sobre proyectos de infraestructura pública, contratos de obra y modificaciones, alineados con el estándar CoST para permitir el seguimiento ciudadano de las obras.',
    url: 'https://infrastructuretransparency.org/es/',
    urlLabel: 'infrastructuretransparency.org',
  },
  {
    name: 'Open Contracting',
    fullName: 'Open Contracting Data Standard (OCDS)',
    logo: 'https://dobt-screendoor.s3.amazonaws.com/uploads/45e5b3913c0a278f1bc598b6bdcb2fee/thumb_OC_logo_RGB_grey__1_.png',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    description:
      'Estándar internacional para la publicación de datos de contratación pública en formatos abiertos y estructurados. Define un esquema común para todas las etapas del proceso de contratación: planificación, licitación, adjudicación, contrato y ejecución.',
    principles: [
      'Estándar de datos para contratación pública (OCDS)',
      'Cobertura de todo el ciclo de contratación',
      'Identificadores únicos para contratos y proveedores',
      'Datos estructurados en JSON reutilizable',
      'Transparencia en adjudicaciones y modificaciones',
    ],
    relevance:
      'El portal estructura los datos de contratos públicos siguiendo el modelo OCDS, permitiendo rastrear quién contrató con el Estado, bajo qué condiciones y qué resultados se entregaron.',
    url: 'https://www.open-contracting.org/es/',
    urlLabel: 'open-contracting.org',
  },
  {
    name: 'Open Ownership',
    fullName: 'Beneficial Ownership Transparency',
    logo: 'https://eiti.org/sites/default/files/styles/logo/public/supporter_logo/opo_rgb_logo_purple.png?itok=0IxWe1wQ',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    description:
      'Estándar global para la transparencia de la propiedad beneficiaria de las empresas. Promueve la publicación de datos estructurados sobre quién controla realmente las empresas, facilitando la identificación de conflictos de interés, lavado de dinero y corrupción.',
    principles: [
      'Registro público de propietarios beneficiarios',
      'Datos estructurados según el estándar BODS',
      'Identificación de la persona humana detrás de la empresa',
      'Conexión entre empresas, proveedores y funcionarios',
      'Detección de conflictos de interés y testaferros',
    ],
    relevance:
      'El portal busca integrar datos de propiedad beneficiaria para permitir cruces entre empresas proveedoras del Estado y funcionarios públicos, fortaleciendo la detección de riesgos de corrupción.',
    url: 'https://www.openownership.org/es/',
    urlLabel: 'openownership.org',
  },
  {
    name: 'Fiscal Transparency',
    fullName: 'Transparencia Fiscal (OCGP / FTE)',
    logo: '',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    description:
      'Conjunto de estándares internacionales que promueven la publicación de datos fiscales abiertos: presupuesto, ejecución del gasto, ingresos, deuda pública y transferencias. Incluye los principios del Global Initiative for Fiscal Transparency (GIFT) y la Participation Initiative.',
    principles: [
      'Publicación oportuna del presupuesto y su ejecución',
      'Datos sobre ingresos, gasto, deuda y transferencias',
      'Desglose por unidad ejecutora y programa',
      'Comparabilidad entre años y unidades',
      'Participación ciudadana en el ciclo fiscal',
    ],
    relevance:
      'El portal integra datos presupuestarios y de ejecución del gasto que permiten seguir el flujo de recursos públicos desde la asignación hasta la entrega de bienes y servicios.',
    url: 'https://www.fiscaltransparency.net/',
    urlLabel: 'fiscaltransparency.net',
  },
];

export function EstandaresPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden text-white py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8891537/pexels-photo-8891537.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Ciudad de Guatemala con edificios gubernamentales"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Estándares internacionales</h1>
            <p className="text-cnc-200 mt-1">Marcos globales que guían la publicación de datos para la integridad</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro */}
        <div className="mb-10">
          <p className="text-gray-600 leading-relaxed">
            El portal se alinea con estándares internacionales que definen qué datos deberían publicarse,
            en qué formato y con qué nivel de detalle. Estos marcos garantizan que la información sea
            comparable entre países, reutilizable por la ciudadanía y útil para prevenir, detectar e
            investigar la corrupción.
          </p>
        </div>

        {/* Standards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((std) => (
            <div key={std.name} className="card overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className={`px-6 py-5 ${std.bgColor} border-b border-gray-100`}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm shrink-0 overflow-hidden">
                    {std.logo ? (
                      <img
                        src={std.logo}
                        alt={`Logo ${std.name}`}
                        className="max-h-10 max-w-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className={`text-xl font-bold ${std.color}`}>
                        {std.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">{std.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{std.fullName}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <p className="text-sm text-gray-600 leading-relaxed">{std.description}</p>

                {/* Principles */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className={`h-4 w-4 ${std.color}`} />
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Principios clave</h3>
                  </div>
                  <ul className="space-y-2">
                    {std.principles.map((principle, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${std.color.replace('text-', 'bg-')} mt-2 shrink-0`} />
                        <span className="text-sm text-gray-600">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relevance */}
                <div className={`rounded-xl ${std.bgColor} border border-gray-100 p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className={`h-4 w-4 ${std.color}`} />
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Relevancia para el portal</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{std.relevance}</p>
                </div>

                {/* Link */}
                <a
                  href={std.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${std.color} hover:opacity-80 transition-opacity`}
                >
                  {std.urlLabel}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 card p-8 bg-gradient-to-br from-cnc-50 to-teal-50 border-cnc-100 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Explora los datos alineados a estos estándares</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Cada conjunto de datos del portal indica qué estándares internacionales cumple y qué brechas
            existen respecto a las mejores prácticas globales.
          </p>
          <Link to="/explorar" className="btn-primary">
            Explorar datos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
