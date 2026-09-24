import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const settingKeys = [
  { key: 'portal_name', label: 'Nombre del portal' },
  { key: 'portal_title', label: 'Título' },
  { key: 'portal_subtitle', label: 'Subtítulo' },
  { key: 'hero_title', label: 'Título del hero' },
  { key: 'hero_text', label: 'Texto del hero' },
  { key: 'hero_search_placeholder', label: 'Placeholder del buscador' },
  { key: 'home_search_examples', label: 'Ejemplos de búsqueda (separados por comas)' },
  { key: 'gap_recommendation_text', label: 'Texto de recomendación para brechas' },
  { key: 'about_purpose_text', label: 'Texto de propósito (Acerca del portal)' },
  { key: 'contact_email', label: 'Email de contacto' },
  { key: 'footer_text', label: 'Texto del footer' },
  { key: 'about_text', label: 'Texto "Acerca del portal"' },
  { key: 'logo_cnc', label: 'Logo CNC (URL)' },
  { key: 'social_twitter', label: 'Twitter' },
  { key: 'social_facebook', label: 'Facebook' },
  { key: 'social_instagram', label: 'Instagram' },
  { key: 'social_linkedin', label: 'LinkedIn' },
];

export function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('*');
      const map: Record<string, string> = {};
      (data || []).forEach((s) => { map[(s as { key: string }).key] = (s as { value: string | null }).value || ''; });
      setValues(map);
    }
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    for (const { key } of settingKeys) {
      const val = values[key] || '';
      const existing = await supabase.from('settings').select('key').eq('key', key).maybeSingle();
      if (existing.data) {
        await supabase.from('settings').update({ value: val }).eq('key', key);
      } else {
        await supabase.from('settings').insert({ key, value: val });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <button onClick={save} disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {saved && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 mb-4">Configuración guardada</div>}

      <div className="card p-6 space-y-4">
        {settingKeys.map(({ key, label }) => (
          <div key={key}>
            <label className="label">{label}</label>
            {key === 'hero_text' || key === 'about_text' || key === 'about_purpose_text' || key === 'gap_recommendation_text' || key === 'footer_text' ? (
              <textarea className="input" rows={3} value={values[key] || ''} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
            ) : (
              <input className="input" value={values[key] || ''} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
