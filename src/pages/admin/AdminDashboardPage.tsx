import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Database, Building2, FileText, AlertTriangle, CheckCircle2, Gauge, ShieldCheck, Eye, MessageSquare } from 'lucide-react';
import type { DatasetAssessment } from '@/types';

interface DashboardStats {
  total: number;
  open: number;
  publicConsult: number;
  partial: number;
  restricted: number;
  gaps: number;
  avgMaturity: number;
  avgUtility: number;
  institutions: number;
  unevaluated: number;
  pendingFeedback: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<{ id: string; name: string; slug: string; updated_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [dsRes, instRes, fbRes, asRes, recentRes] = await Promise.all([
        supabase.from('datasets').select('*, status:statuses(slug, name)'),
        supabase.from('institutions').select('id').eq('is_active', true),
        supabase.from('dataset_feedback').select('id').eq('status', 'nuevo'),
        supabase.from('dataset_assessments').select('total_score, ac_total_score'),
        supabase.from('datasets').select('id, name, slug, updated_at').order('updated_at', { ascending: false }).limit(8),
      ]);

      if (dsRes.error) { setErrorMsg(dsRes.error.message); setLoading(false); return; }

      const datasets = dsRes.data || [];
      const statusCounts = new Map<string, number>();
      datasets.forEach((d) => {
        const st = (d as unknown as { status: { slug: string; name: string } | null }).status;
        if (st) statusCounts.set(st.slug, (statusCounts.get(st.slug) || 0) + 1);
      });

      const assessments = (asRes.data as Pick<DatasetAssessment, 'total_score' | 'ac_total_score'>[]) || [];
      const avgMaturity = assessments.length > 0 ? Math.round(assessments.reduce((s, a) => s + a.total_score, 0) / assessments.length) : 0;
      const avgUtility = assessments.length > 0 ? Math.round(assessments.reduce((s, a) => s + a.ac_total_score, 0) / assessments.length) : 0;

      setStats({
        total: datasets.length,
        open: statusCounts.get('datos-abiertos') || 0,
        publicConsult: statusCounts.get('disponible') || 0,
        partial: statusCounts.get('parcial') || 0,
        restricted: statusCounts.get('restringido') || 0,
        gaps: statusCounts.get('brecha') || 0,
        avgMaturity,
        avgUtility,
        institutions: instRes.data?.length || 0,
        unevaluated: datasets.length - assessments.length,
        pendingFeedback: fbRes.data?.length || 0,
      });
      setRecent((recentRes.data as { id: string; name: string; slug: string; updated_at: string }[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !stats) {
    if (errorMsg) {
      return <div className="animate-fade-in"><div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">Error: {errorMsg}</div></div>;
    }
    return <div className="animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}</div>;
  }

  const cards = [
    { label: 'Total datasets', value: stats.total, icon: Database, color: 'text-cnc-700 bg-cnc-50' },
    { label: 'Datos abiertos', value: stats.open, icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
    { label: 'Consulta pública', value: stats.publicConsult, icon: Eye, color: 'text-blue-700 bg-blue-50' },
    { label: 'Parciales', value: stats.partial, icon: AlertTriangle, color: 'text-amber-700 bg-amber-50' },
    { label: 'Restringidos', value: stats.restricted, icon: AlertTriangle, color: 'text-orange-700 bg-orange-50' },
    { label: 'Brechas', value: stats.gaps, icon: AlertTriangle, color: 'text-red-700 bg-red-50' },
    { label: 'Madurez promedio', value: `${stats.avgMaturity}/100`, icon: Gauge, color: 'text-cnc-700 bg-cnc-50' },
    { label: 'Utilidad anticorrupción', value: `${stats.avgUtility}/100`, icon: ShieldCheck, color: 'text-teal-700 bg-teal-50' },
    { label: 'Instituciones', value: stats.institutions, icon: Building2, color: 'text-teal-700 bg-teal-50' },
    { label: 'Sin evaluar', value: stats.unevaluated, icon: FileText, color: 'text-gray-700 bg-gray-100' },
    { label: 'Solicitudes pendientes', value: stats.pendingFeedback, icon: MessageSquare, color: 'text-orange-700 bg-orange-50' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del portal</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-2 ${card.color}`}>
              <card.icon className="h-4.5 w-4.5" />
            </div>
            <div className="text-xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Actualizaciones recientes</h2>
          <div className="space-y-2">
            {recent.map((ds) => (
              <a key={ds.id} href={`/admin/datasets/${ds.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-700 truncate">{ds.name}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{new Date(ds.updated_at).toLocaleDateString()}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
