import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, Upload, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DynamicIcon } from '@/components/DynamicIcon';

type LucideIcon = React.ComponentType<{ className?: string }>;
const iconMap = LucideIcons as unknown as Record<string, LucideIcon>;

const iconNames = Object.keys(iconMap).filter(
  (name) => typeof iconMap[name] === 'function' && name !== 'default' && !name.startsWith('_') && name[0] === name[0].toUpperCase()
);

interface IconPickerProps {
  iconType: string;
  iconName: string;
  iconUrl: string | null;
  onChange: (type: string, name: string, url: string | null) => void;
}

export function IconPicker({ iconType, iconName, iconUrl, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'lucide' | 'custom'>(iconType === 'lucide' ? 'lucide' : 'custom');
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return iconNames.slice(0, 48);
    const q = search.toLowerCase();
    return iconNames.filter((name) => name.toLowerCase().includes(q)).slice(0, 48);
  }, [search]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = ext === 'svg' ? 'svg' : ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'svg';
    const fileName = `icon-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('icons').upload(fileName, file);
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('icons').getPublicUrl(data.path);
      onChange(type, file.name, urlData.publicUrl);
      setMode('custom');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('lucide')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg ${mode === 'lucide' ? 'bg-cnc-700 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Iconos Lucide
        </button>
        <button
          type="button"
          onClick={() => setMode('custom')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg ${mode === 'custom' ? 'bg-cnc-700 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Subir personalizado
        </button>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cnc-50 text-cnc-700">
          <DynamicIcon name={iconName} url={iconUrl} iconType={iconType as 'lucide'} className="h-6 w-6" />
        </div>
        <div className="text-xs text-gray-500">
          {iconType === 'lucide' ? `Lucide: ${iconName}` : `Personalizado: ${iconName}`}
        </div>
      </div>

      {mode === 'lucide' ? (
        <div>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar icono (empresa, contrato, dinero...)"
              className="input pl-9 text-sm"
            />
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 border rounded-lg">
            {filtered.map((name) => {
              const Icon = iconMap[name];
              if (!Icon) return null;
              const isSelected = iconType === 'lucide' && iconName === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onChange('lucide', name, null)}
                  className={`relative flex h-12 items-center justify-center rounded-lg border transition-all ${
                    isSelected ? 'border-cnc-500 bg-cnc-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={name}
                >
                  <Icon className="h-5 w-5 text-gray-700" />
                  {isSelected && <Check className="absolute -top-1 -right-1 h-3.5 w-3.5 text-cnc-600 bg-white rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <label className="block">
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cnc-400 hover:bg-gray-50 transition-colors">
              <div className="text-center">
                {uploading ? (
                  <p className="text-sm text-gray-500">Subiendo...</p>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Subir SVG, PNG o WebP</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".svg,.png,.webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
              />
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
