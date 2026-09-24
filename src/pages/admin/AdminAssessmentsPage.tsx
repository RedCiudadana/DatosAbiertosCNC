import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Gauge, ShieldCheck, Save, AlertCircle } from 'lucide-react';
import { ASSESSMENT_DIMENSIONS, AC_ASSESSMENT_DIMENSIONS } from '@/lib/constants';
import type { DatasetAssessment } from '@/types';

export function AdminAssessmentsPage() {
  const [datasets, setDatasets] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedDs, setSelectedDs] = useState<string>('');
  const [assessment, setAssessment] = useState<DatasetAssessment | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [evaluator, setEvaluator] = useState('');
  const [evalDate, setEvalDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('datasets')
      .select('id, name, slug')
      .order('name')
      .then(({ data }) => {
        setDatasets((data as { id: string; name: string; slug: string }[]) || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedDs) return;
    setSaved(false);
    supabase
      .from('dataset_assessments')
      .select('*')
      .eq('dataset_id', selectedDs)
      .maybeSingle()
      .then(({ data }) => {
        const a = data as DatasetAssessment | null;
        setAssessment(a);
        if (a) {
          const s: Record<string, number> = {};
          [...ASSESSMENT_DIMENSIONS, ...AC_ASSESSMENT_DIMENSIONS].forEach((d) => {
            s[d.field] = (a as unknown as Record<string, number>)[d.field] || 0;
          });
          setScores(s);
          setEvaluator(a.evaluator || '');
          setEvalDate(a.evaluation_date || '');
          setNotes(a.notes || '');
        } else {
          const s: Record<string, number> = {};
          [...ASSESSMENT_DIMENSIONS, ...AC_ASSESSMENT_DIMENSIONS].forEach((d) => { s[d.field] = 0; });
          setScores(s);
          setEvaluator(''); setEvalDate(''); setNotes('');
        }
      });
  }, [selectedDs]);

  const totalScore = Math.round(
    ASSESSMENT_DIMENSIONS.reduce((s, d) => s + (scores[d.field] || 0), 0) / ASSESSMENT_DIMENSIONS.length
  );
  const acTotalScore = Math.round(
    AC_ASSESSMENT_DIMENSIONS.reduce((s, d) => s + (scores[d.field] || 0), 0) / AC_ASSESSMENT_DIMENSIONS.length
  );

  async function save() {
    if (!selectedDs) return;
    const payload = {
      dataset_id: selectedDs,
      ...scores,
      total_score: totalScore,
      ac_total_score: acTotalScore,
      evaluator: evaluator || null,
      evaluation_date: evalDate || null,
      notes: notes || null,
    };
    if (assessment) {
      await supabase.from('dataset_assessments').update(payload).eq('id', assessment.id);
    } else {
      await supabase.from('dataset_assessments').insert(payload);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-xl" />;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
        <p className="text-sm text-gray-500 mt-1">Calidad, madurez y utilidad anticorrupción de cada dataset</p>
      </div>

      <div className="card p-5">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Seleccionar dataset</label>
        <select className="input" value={selectedDs} onChange={(e) => setSelectedDs(e.target.value)}>
          <option value="">— Seleccionar —</option>
          {datasets.map((ds) => <option key={ds.id} value={ds.id}>{ds.name}</option>)}
        </select>
      </div>

      {selectedDs && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Madurez */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="h-5 w-5 text-cnc-700" />
                <h2 className="text-base font-semibold text-gray-900">Madurez del dato</h2>
                <span className="ml-auto text-2xl font-bold text-gray-900">{totalScore}<span className="text-sm text-gray-400">/100</span></span>
              </div>
              <div className="space-y-3">
                {ASSESSMENT_DIMENSIONS.map((dim) => (
                  <div key={dim.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{dim.label}</span>
                      <span className="text-xs font-bold text-gray-900">{scores[dim.field] || 0}</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      value={scores[dim.field] || 0}
                      onChange={(e) => setScores({ ...scores, [dim.field]: Number(e.target.value) })}
                      className="w-full accent-cnc-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Utilidad anticorrupción */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-semibold text-gray-900">Utilidad anticorrupción</h2>
                <span className="ml-auto text-2xl font-bold text-gray-900">{acTotalScore}<span className="text-sm text-gray-400">/100</span></span>
              </div>
              <div className="space-y-3">
                {AC_ASSESSMENT_DIMENSIONS.map((dim) => (
                  <div key={dim.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{dim.label}</span>
                      <span className="text-xs font-bold text-gray-900">{scores[dim.field] || 0}</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      value={scores[dim.field] || 0}
                      onChange={(e) => setScores({ ...scores, [dim.field]: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prioridad automática */}
          {acTotalScore >= 70 && totalScore < 40 && (
            <div className="card p-4 border-l-4 border-l-red-500 bg-red-50/50">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-bold text-red-700">Prioridad crítica de apertura</span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="card p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Evaluador" value={evaluator} onChange={(e) => setEvaluator(e.target.value)} />
              <input type="date" className="input" value={evalDate} onChange={(e) => setEvalDate(e.target.value)} />
            </div>
            <textarea className="input" placeholder="Notas" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            <div className="flex items-center gap-3">
              <button onClick={save} className="btn-primary text-sm">
                <Save className="h-4 w-4" /> Guardar evaluación
              </button>
              {saved && <span className="text-sm text-green-600 font-medium">¡Guardado!</span>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
