import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, DatasetType, Status, Institution, Tag, Setting, IntegrityDomain, ResearchPath, Identifier } from '@/types';

export function usePortalData() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [datasetTypes, setDatasetTypes] = useState<DatasetType[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [integrityDomains, setIntegrityDomains] = useState<IntegrityDomain[]>([]);
  const [researchPaths, setResearchPaths] = useState<ResearchPath[]>([]);
  const [identifiers, setIdentifiers] = useState<Identifier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [settingsRes, catRes, dtRes, stRes, instRes, tagRes, idRes, rpRes, idnRes] = await Promise.all([
        supabase.from('settings').select('*'),
        supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
        supabase.from('dataset_types').select('*').eq('is_active', true).order('display_order'),
        supabase.from('statuses').select('*').eq('is_active', true).order('display_order'),
        supabase.from('institutions').select('*').eq('is_active', true).order('display_order'),
        supabase.from('tags').select('*').order('name'),
        supabase.from('integrity_domains').select('*').eq('is_active', true).order('display_order'),
        supabase.from('research_paths').select('*').eq('published', true).order('display_order'),
        supabase.from('identifiers').select('*').eq('is_active', true).order('display_order'),
      ]);

      const settingsMap: Record<string, string> = {};
      (settingsRes.data as Setting[] | null)?.forEach((s) => {
        if (s.value) settingsMap[s.key] = s.value;
      });

      setSettings(settingsMap);
      setCategories((catRes.data as Category[]) || []);
      setDatasetTypes((dtRes.data as DatasetType[]) || []);
      setStatuses((stRes.data as Status[]) || []);
      setInstitutions((instRes.data as Institution[]) || []);
      setTags((tagRes.data as Tag[]) || []);
      setIntegrityDomains((idRes.data as IntegrityDomain[]) || []);
      setResearchPaths((rpRes.data as ResearchPath[]) || []);
      setIdentifiers((idnRes.data as Identifier[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  return { settings, categories, datasetTypes, statuses, institutions, tags, integrityDomains, researchPaths, identifiers, loading };
}
