import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Gauge, ShieldCheck, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { ASSESSMENT_DIMENSIONS, AC_ASSESSMENT_DIMENSIONS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { DatasetAssessment } from '@/types';

export function MetodologiaPage() {
  const { settings, statuses } = usePortalData();
  const [assessments, setAssessments] = useState<DatasetAssessment[]>([]);

  useEffect(() => {
    supabase
      .from('dataset_assessments')
      .select('*')
      .then(({ data }) => setAssessments((data as DatasetAssessment[]) || []));
  }, []);

  const avgMaturity = assessments.length > 0
    ? Math.round(assessments.reduce((s, a) => s + a.total_score, 0) / assessments.length)
    : 0;
  const avgUtility = assessments.length > 0
    ? Math.round(assessments.reduce((s, a) => s + a.ac_total_score, 0) / assessments.length)
    : 0;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden text-white py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8635247/pexels-photo-8635247.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Lago de Atitlán y volcán en Guatemala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Metodología de evaluación</h1>
            <p className="text-cnc-200 mt-1">Cómo evaluamos los datos públicos para la integridad</p>
          </div>
        </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">

      {/* Disclaimer */}
      {settings.methodology_disclaimer && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-8">
          <p className="text-sm text-amber-900 leading-relaxed">{settings.methodology_disclaimer}</p>
        </div>
      )}

      {/* Estados de disponibilidad */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Estados de disponibilidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statuses.map((st) => (
            <div key={st.id} className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="text-sm font-bold text-gray-900">{st.name}</span>
              </div>
              {st.description && <p className="text-sm text-gray-600 leading-relaxed">{st.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Madurez del dato */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Calidad y madurez del dato</h2>
        <p className="text-gray-600 mb-6">
          Evaluamos 9 dimensiones para medir qué tan lista está la información para ser utilizada.
          Cada dimensión se evalúa de 0 a 100. El promedio constituye el índice de madurez.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-5 w-5 text-cnc-700" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Madurez promedio</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{avgMaturity}<span className="text-lg text-gray-400">/100</span></div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Utilidad anticorrupción promedio</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{avgUtility}<span className="text-lg text-gray-400">/100</span></div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Datasets evaluados</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{assessments.length}</div>
          </div>
        </div>
        <div className="space-y-3">
          {ASSESSMENT_DIMENSIONS.map((dim) => (
            <div key={dim.key} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cnc-50 text-cnc-700 shrink-0">
                  <Gauge className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{dim.label}</h3>
                  <p className="text-xs text-gray-500">{dim.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Utilidad anticorrupción */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Utilidad anticorrupción</h2>
        <p className="text-gray-600 mb-6">
          Evaluamos separadamente cuán útil es cada conjunto para fines anticorrupción.
          Este valor no se combina con la madurez: un dataset puede tener alta utilidad pero baja madurez,
          lo que indica una oportunidad de apertura.
        </p>
        <div className="space-y-3">
          {AC_ASSESSMENT_DIMENSIONS.map((dim) => (
            <div key={dim.key} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{dim.label}</h3>
                  <p className="text-xs text-gray-500">{dim.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Matriz Madurez vs Utilidad */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Matriz Madurez vs Utilidad</h2>
        <div className="card p-6">
          <div className="relative aspect-square max-w-md mx-auto">
            {/* Axes */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300" />
            <div className="absolute left-0 bottom-0 right-0 h-px bg-gray-300" />
            {/* Labels */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium">Utilidad →</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium mt-2">Madurez →</div>
            {/* Quadrants */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-dashed border-gray-200 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Alta utilidad + Alta madurez</div>
                  <div className="text-xs text-gray-400 mt-1">Datos estratégicos consolidados</div>
                </div>
              </div>
              <div className="border-b border-dashed border-gray-200 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Baja utilidad + Alta madurez</div>
                  <div className="text-xs text-gray-400 mt-1">Datos complementarios</div>
                </div>
              </div>
              <div className="border-r border-dashed border-gray-200 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-red-700">Alta utilidad + Baja madurez</div>
                  <div className="text-xs text-red-400 mt-1">Prioridad de apertura</div>
                </div>
              </div>
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-500">Baja utilidad + Baja madurez</div>
                  <div className="text-xs text-gray-400 mt-1">Prioridad secundaria</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brechas */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Identificación de brechas</h2>
        <p className="text-gray-600">
          Una brecha se identifica cuando no existe publicación pública suficiente de un conjunto de datos
          que es estratégico para la integridad. Las brechas no implican incumplimiento legal: indican
          oportunidades para mejorar la transparencia y abrir información.
        </p>
      </section>

      <div className="flex justify-center">
        <Link to="/explorar" className="btn-primary">
          Explorar datos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      </div>
    </div>
  );
}
