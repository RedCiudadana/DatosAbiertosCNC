import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortalData } from '@/hooks/usePortalData';
import { IconPicker } from '@/components/admin/IconPicker';
import { slugify } from '@/lib/utils';
import { ANTI_CORRUPTION_VALUES, RESOURCE_TYPES, RESOURCE_TYPE_KEYS } from '@/lib/constants';
import type { Dataset, Tag, Resource } from '@/types';

export function AdminDatasetEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const { categories, datasetTypes, statuses, institutions, tags } = usePortalData();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [datasetTags, setDatasetTags] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState<Partial<Dataset>>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    icon_type: 'lucide',
    icon_name: 'Database',
    icon_url: null,
    category_id: '',
    dataset_type_id: '',
    institution_id: '',
    status_id: '',
    is_pida: false,
    pida_topic_id: '',
    published: false,
    featured: false,
    openness_level: 0,
    anti_corruption_prevention: false,
    anti_corruption_detection: false,
    anti_corruption_investigation: false,
    anti_corruption_social_control: false,
    anti_corruption_traceability: false,
    anti_corruption_relevance: '',
    api_available: false,
    coverage_geo: 'Nacional',
    frequency: '',
    license: '',
    source_url: '',
    source_contact: '',
    api_url: '',
    metadata_url: '',
    documentation_url: '',
    guatemala_exists: null,
    guatemala_observations: '',
    guatemala_evaluated_by: '',
    guatemala_regulatory_framework: '',
    display_order: 0,
  });

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data } = await supabase.from('datasets').select('*').eq('id', id).maybeSingle();
      if (data) {
        const d = data as Dataset;
        setForm(d);
        // Load tags
        const { data: tagData } = await supabase.from('dataset_tags').select('tag_id').eq('dataset_id', id);
        setDatasetTags((tagData || []).map((t) => (t as { tag_id: string }).tag_id));
        // Load resources
        const { data: resData } = await supabase.from('resources').select('*').eq('dataset_id', id).order('display_order');
        setResources((resData as Resource[]) || []);
      }
    }
    load();
  }, [id, isNew]);

  const update = (field: keyof Dataset, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const data = {
      ...form,
      slug: form.slug || slugify(form.name || ''),
      category_id: form.category_id || null,
      dataset_type_id: form.dataset_type_id || null,
      institution_id: form.institution_id || null,
      status_id: form.status_id || null,
      pida_topic_id: form.pida_topic_id || null,
      published_at: form.published ? form.published_at || new Date().toISOString() : null,
    };

    let datasetId = id;
    if (isNew) {
      const { data: inserted, error } = await supabase.from('datasets').insert(data).select('id').maybeSingle();
      if (inserted) datasetId = (inserted as { id: string }).id;
      if (error) { setSaving(false); return; }
    } else {
      await supabase.from('datasets').update(data).eq('id', id);
    }

    // Save tags
    if (datasetId) {
      await supabase.from('dataset_tags').delete().eq('dataset_id', datasetId);
      if (datasetTags.length > 0) {
        await supabase.from('dataset_tags').insert(datasetTags.map((tag_id) => ({ dataset_id: datasetId, tag_id })));
      }
    }

    setSaving(false);
    setSaved(true);
    if (isNew && datasetId) navigate(`/admin/datasets/${datasetId}`);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async () => {
    if (!id || isNew) return;
    if (!confirm('¿Eliminar este conjunto de datos?')) return;
    await supabase.from('datasets').delete().eq('id', id);
    navigate('/admin/datasets');
  };

  const toggleTag = (tagId: string) => {
    setDatasetTags((prev) => prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]);
  };

  const addResource = () => {
    setResources((prev) => [...prev, {
      id: `temp-${Date.now()}`,
      dataset_id: id || '',
      name: '',
      description: '',
      type: 'file',
      format: '',
      url: '',
      file_path: null,
      file_size: null,
      mime_type: null,
      last_updated: null,
      is_active: true,
      display_order: prev.length,
      created_at: new Date().toISOString(),
    }]);
  };

  const updateResource = (idx: number, field: keyof Resource, value: unknown) => {
    setResources((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const saveResource = async (idx: number) => {
    const res = resources[idx];
    if (!res.name) return;
    if (res.id.startsWith('temp-')) {
      const { data } = await supabase.from('resources').insert({
        dataset_id: id,
        name: res.name,
        description: res.description,
        type: res.type,
        format: res.format,
        url: res.url,
        is_active: res.is_active,
        display_order: res.display_order,
      }).select('*').maybeSingle();
      if (data) {
        setResources((prev) => prev.map((r, i) => i === idx ? data as Resource : r));
      }
    } else {
      await supabase.from('resources').update({
        name: res.name,
        description: res.description,
        type: res.type,
        format: res.format,
        url: res.url,
        is_active: res.is_active,
        display_order: res.display_order,
      }).eq('id', res.id);
    }
  };

  const deleteResource = async (idx: number) => {
    const res = resources[idx];
    if (!res.id.startsWith('temp-')) {
      await supabase.from('resources').delete().eq('id', res.id);
    }
    setResources((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <Link to="/admin/datasets" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cnc-700 mb-4">
        <ArrowLeft className="h-4 w-4" />
        Volver a conjuntos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Nuevo conjunto' : 'Editar conjunto'}</h1>
        <div className="flex gap-2">
          {!isNew && <button onClick={handleDelete} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"><Trash2 className="h-4 w-4" />Eliminar</button>}
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {saved && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 mb-4">Guardado correctamente</div>}

      <div className="space-y-6">
        {/* Main info */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Información principal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nombre *</label>
              <input className="input" value={form.name || ''} onChange={(e) => { update('name', e.target.value); if (isNew) update('slug', slugify(e.target.value)); }} />
            </div>
            <div>
              <label className="label">Slug</label>
              <input className="input" value={form.slug || ''} onChange={(e) => update('slug', e.target.value)} />
            </div>
            <div>
              <label className="label">Imagen (URL)</label>
              <input className="input" value={form.image_url || ''} onChange={(e) => update('image_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción corta</label>
              <textarea className="input" rows={2} value={form.short_description || ''} onChange={(e) => update('short_description', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción completa</label>
              <textarea className="input" rows={4} value={form.description || ''} onChange={(e) => update('description', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Icono</label>
              <IconPicker
                iconType={form.icon_type || 'lucide'}
                iconName={form.icon_name || 'Database'}
                iconUrl={form.icon_url || null}
                onChange={(type, name, url) => { update('icon_type', type); update('icon_name', name); update('icon_url', url); }}
              />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select className="input" value={form.category_id || ''} onChange={(e) => update('category_id', e.target.value || null)}>
                <option value="">Sin categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tipo</label>
              <select className="input" value={form.dataset_type_id || ''} onChange={(e) => update('dataset_type_id', e.target.value || null)}>
                <option value="">Sin tipo</option>
                {datasetTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Institución</label>
              <select className="input" value={form.institution_id || ''} onChange={(e) => update('institution_id', e.target.value || null)}>
                <option value="">Sin institución</option>
                {institutions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="input" value={form.status_id || ''} onChange={(e) => update('status_id', e.target.value || null)}>
                <option value="">Sin estado</option>
                {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Etiquetas</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = datasetTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`chip cursor-pointer ${selected ? 'bg-cnc-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Anti-corruption classification */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Clasificación anticorrupción</h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {ANTI_CORRUPTION_VALUES.map((v) => (
                <label key={v.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={form[v.field] || false} onChange={(e) => update(v.field, e.target.checked)} className="rounded" />
                  <span className="text-sm text-gray-700">{v.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Anti-corruption relevance */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">¿Por qué estos datos importan?</h2>
          <textarea className="input" rows={3} value={form.anti_corruption_relevance || ''} onChange={(e) => update('anti_corruption_relevance', e.target.value)} placeholder="Explica la relevancia anticorrupción de este conjunto..." />
        </div>

        {/* Availability */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Disponibilidad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Nivel de apertura (0-5)</label>
              <input type="number" min={0} max={5} className="input" value={form.openness_level || 0} onChange={(e) => update('openness_level', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Cobertura geográfica</label>
              <input className="input" value={form.coverage_geo || ''} onChange={(e) => update('coverage_geo', e.target.value)} />
            </div>
            <div>
              <label className="label">Cobertura temporal</label>
              <input className="input" value={form.coverage_temporal || ''} onChange={(e) => update('coverage_temporal', e.target.value)} placeholder="Ej: 2020-presente" />
            </div>
            <div>
              <label className="label">Frecuencia de actualización</label>
              <input className="input" value={form.frequency || ''} onChange={(e) => update('frequency', e.target.value)} placeholder="Ej: Mensual, Anual" />
            </div>
            <div>
              <label className="label">Fecha última actualización</label>
              <input type="date" className="input" value={form.last_updated_at || ''} onChange={(e) => update('last_updated_at', e.target.value || null)} />
            </div>
            <div>
              <label className="label">Licencia</label>
              <input className="input" value={form.license || ''} onChange={(e) => update('license', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Technical data */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Datos técnicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">URL fuente oficial</label>
              <input className="input" value={form.source_url || ''} onChange={(e) => update('source_url', e.target.value)} />
            </div>
            <div>
              <label className="label">Contacto de fuente</label>
              <input className="input" value={form.source_contact || ''} onChange={(e) => update('source_contact', e.target.value)} />
            </div>
            <div>
              <label className="label">URL API</label>
              <input className="input" value={form.api_url || ''} onChange={(e) => update('api_url', e.target.value)} />
            </div>
            <div>
              <label className="label">URL metadata</label>
              <input className="input" value={form.metadata_url || ''} onChange={(e) => update('metadata_url', e.target.value)} />
            </div>
            <div>
              <label className="label">URL documentación</label>
              <input className="input" value={form.documentation_url || ''} onChange={(e) => update('documentation_url', e.target.value)} />
            </div>
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={form.api_available || false} onChange={(e) => update('api_available', e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">API disponible</span>
            </label>
          </div>
        </div>

        {/* Guatemala */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Implementación Guatemala</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">¿Existe en Guatemala?</label>
              <select className="input" value={form.guatemala_exists === null ? '' : String(form.guatemala_exists)} onChange={(e) => update('guatemala_exists', e.target.value === '' ? null : e.target.value === 'true')}>
                <option value="">Pendiente</option>
                <option value="true">Sí existe</option>
                <option value="false">No existe / Brecha</option>
              </select>
            </div>
            <div>
              <label className="label">Evaluado por</label>
              <input className="input" value={form.guatemala_evaluated_by || ''} onChange={(e) => update('guatemala_evaluated_by', e.target.value)} />
            </div>
            <div>
              <label className="label">Fecha de evaluación</label>
              <input type="date" className="input" value={form.guatemala_evaluation_date || ''} onChange={(e) => update('guatemala_evaluation_date', e.target.value || null)} />
            </div>
            <div>
              <label className="label">Normativa relacionada</label>
              <input className="input" value={form.guatemala_regulatory_framework || ''} onChange={(e) => update('guatemala_regulatory_framework', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Observaciones</label>
              <textarea className="input" rows={3} value={form.guatemala_observations || ''} onChange={(e) => update('guatemala_observations', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recursos del conjunto</h2>
            <button onClick={addResource} className="btn-secondary text-xs">
              <Plus className="h-3.5 w-3.5" />
              Agregar recurso
            </button>
          </div>
          <div className="space-y-3">
            {resources.map((res, idx) => (
              <div key={res.id} className="border border-gray-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input className="input sm:col-span-3 text-sm" placeholder="Nombre" value={res.name} onChange={(e) => updateResource(idx, 'name', e.target.value)} />
                <select className="input sm:col-span-2 text-sm" value={res.type} onChange={(e) => updateResource(idx, 'type', e.target.value)}>
                  {RESOURCE_TYPE_KEYS.map((key) => <option key={key} value={key}>{RESOURCE_TYPES[key].label}</option>)}
                </select>
                <input className="input sm:col-span-2 text-sm" placeholder="Formato" value={res.format || ''} onChange={(e) => updateResource(idx, 'format', e.target.value)} />
                <input className="input sm:col-span-3 text-sm" placeholder="URL" value={res.url || ''} onChange={(e) => updateResource(idx, 'url', e.target.value)} />
                <div className="sm:col-span-2 flex gap-1">
                  <button onClick={() => saveResource(idx)} className="px-2 py-1.5 rounded text-xs bg-cnc-50 text-cnc-700 hover:bg-cnc-100 font-medium">Guardar</button>
                  <button onClick={() => deleteResource(idx)} className="px-2 py-1.5 rounded text-xs bg-red-50 text-red-700 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
            {resources.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin recursos. Agrega archivos, enlaces o APIs.</p>}
          </div>
        </div>

        {/* Publication */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Publicación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published || false} onChange={(e) => update('published', e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Publicado</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured || false} onChange={(e) => update('featured', e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Destacado</span>
            </label>
            <div>
              <label className="label">Orden</label>
              <input type="number" className="input" value={form.display_order || 0} onChange={(e) => update('display_order', parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        {/* Save button at bottom */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
