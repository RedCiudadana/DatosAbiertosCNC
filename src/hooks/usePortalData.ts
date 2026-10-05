import { useEffect, useState } from 'react';
import { loadAllPortalData } from '@/lib/dataService';
import type { Category, DatasetType, Status, Institution, Tag, Setting, IntegrityDomain, ResearchPath, Identifier, DatasetWithRelations } from '@/types';

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
  const [datasets, setDatasets] = useState<DatasetWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadAllPortalData().then((data) => {
      if (cancelled) return;
      setSettings(data.settings);
      setCategories(data.categories);
      setDatasetTypes(data.datasetTypes);
      setStatuses(data.statuses);
      setInstitutions(data.institutions);
      setTags(data.tags);
      setIntegrityDomains(data.integrityDomains);
      setResearchPaths(data.researchPaths);
      setIdentifiers(data.identifiers);
      setDatasets(data.datasets);
      setLoading(false);
    }).catch((err) => {
      console.error('Error loading portal data:', err);
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { settings, categories, datasetTypes, statuses, institutions, tags, integrityDomains, researchPaths, identifiers, datasets, loading };
}
