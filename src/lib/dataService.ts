import { loadCSV, toBool, toNum, toStr, type CSVParsedRow } from './csv';
import type {
  Category, DatasetType, Status, Institution, Tag, Setting,
  IntegrityDomain, ResearchPath, Identifier,
  Dataset, DatasetWithRelations, Resource,
} from '@/types';

export async function loadSettings(): Promise<Record<string, string>> {
  const rows = await loadCSV<Setting>('settings.csv', (r) => ({
    key: r.key,
    value: toStr(r.value),
    value_json: null,
    updated_at: '',
  }));
  const map: Record<string, string> = {};
  rows.forEach((s) => { if (s.value) map[s.key] = s.value; });
  return map;
}

export async function loadCategories(): Promise<Category[]> {
  return loadCSV<Category>('categories.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    description: toStr(r.description),
    icon_name: r.icon_name,
    color: r.color,
    display_order: toNum(r.display_order),
    is_active: true,
    created_at: '',
    updated_at: '',
  }));
}

export async function loadDatasetTypes(): Promise<DatasetType[]> {
  return loadCSV<DatasetType>('dataset_types.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    description: toStr(r.description),
    icon_name: r.icon_name,
    display_order: toNum(r.display_order),
    is_active: true,
    created_at: '',
  }));
}

export async function loadStatuses(): Promise<Status[]> {
  return loadCSV<Status>('statuses.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    description: toStr(r.description),
    color: r.color,
    icon_name: r.icon_name,
    display_order: toNum(r.display_order),
    is_active: true,
    created_at: '',
  }));
}

export async function loadInstitutions(): Promise<Institution[]> {
  return loadCSV<Institution>('institutions.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    acronym: toStr(r.acronym),
    description: toStr(r.description),
    logo_url: null,
    website: toStr(r.website),
    email: null,
    phone: null,
    is_active: true,
    display_order: toNum(r.display_order),
    created_at: '',
    updated_at: '',
  }));
}

export async function loadTags(): Promise<Tag[]> {
  return loadCSV<Tag>('tags.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    created_at: '',
  }));
}

export async function loadIntegrityDomains(): Promise<IntegrityDomain[]> {
  return loadCSV<IntegrityDomain>('integrity_domains.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    description: toStr(r.description),
    question: toStr(r.question),
    icon_name: r.icon_name,
    color: r.color,
    display_order: toNum(r.display_order),
    is_active: true,
    created_at: '',
    updated_at: '',
  }));
}

export async function loadResearchPaths(): Promise<ResearchPath[]> {
  return loadCSV<ResearchPath>('research_paths.csv', (r) => ({
    id: r.title,
    title: r.title,
    description: toStr(r.description),
    icon_name: r.icon_name,
    destination_url: toStr(r.destination_url),
    related_domain_id: null,
    display_order: toNum(r.display_order),
    published: true,
    created_at: '',
  }));
}

export async function loadIdentifiers(): Promise<Identifier[]> {
  return loadCSV<Identifier>('identifiers.csv', (r) => ({
    id: r.slug,
    name: r.name,
    slug: r.slug,
    description: toStr(r.description),
    display_order: toNum(r.display_order),
    is_active: true,
    created_at: '',
  }));
}

export async function loadResources(): Promise<(Resource & { dataset_slug: string })[]> {
  return loadCSV<Resource & { dataset_slug: string }>('resources.csv', (r) => ({
    id: `${r.dataset_slug}-${r.name}`,
    dataset_id: r.dataset_slug,
    dataset_slug: r.dataset_slug,
    name: r.name,
    description: toStr(r.description),
    type: r.type,
    format: toStr(r.format),
    url: toStr(r.url),
    file_path: toStr(r.file_path),
    file_size: r.file_size ? toNum(r.file_size) : null,
    mime_type: toStr(r.mime_type),
    last_updated: toStr(r.last_updated),
    is_active: toBool(r.is_active),
    display_order: toNum(r.display_order),
    created_at: '',
  }));
}

export async function loadDatasetTags(): Promise<{ dataset_slug: string; tag_name: string; tag_slug: string }[]> {
  return loadCSV<{ dataset_slug: string; tag_name: string; tag_slug: string }>('dataset_tags.csv', (r) => ({
    dataset_slug: r.dataset_slug,
    tag_name: r.tag_name,
    tag_slug: r.tag_slug,
  }));
}

export async function loadDatasetsRaw(): Promise<CSVParsedRow[]> {
  const { parseCSV } = await import('./csv');
  const res = await fetch('/data/datasets.csv');
  const text = await res.text();
  return parseCSV(text);
}

export async function loadDatasets(): Promise<DatasetWithRelations[]> {
  const [rawDatasets, resources, datasetTags] = await Promise.all([
    loadDatasetsRaw(),
    loadResources(),
    loadDatasetTags(),
  ]);

  return rawDatasets.map((r): DatasetWithRelations => {
    const slug = r.slug;
    const dsResources = resources.filter((res) => res.dataset_slug === slug);

    const base: Dataset = {
      id: slug,
      name: r.name,
      slug: slug,
      short_description: toStr(r.short_description),
      description: toStr(r.description),
      icon_type: (r.icon_type as 'lucide' | 'svg' | 'png' | 'webp') || 'lucide',
      icon_name: r.icon_name || 'Database',
      icon_url: toStr(r.icon_url),
      image_url: toStr(r.image_url),
      category_id: toStr(r.category_slug),
      dataset_type_id: toStr(r.dataset_type_slug),
      institution_id: toStr(r.institution_slug),
      status_id: toStr(r.status_slug),
      is_pida: toBool(r.is_pida),
      pida_topic_id: null,
      availability: toStr(r.availability),
      coverage_geo: toStr(r.coverage_geo),
      coverage_temporal: toStr(r.coverage_temporal),
      frequency: toStr(r.frequency),
      last_updated_at: toStr(r.last_updated_at),
      license: toStr(r.license),
      source_url: toStr(r.source_url),
      source_contact: toStr(r.source_contact),
      api_url: toStr(r.api_url),
      api_available: toBool(r.api_available),
      metadata_url: toStr(r.metadata_url),
      documentation_url: toStr(r.documentation_url),
      anti_corruption_prevention: toBool(r.anti_corruption_prevention),
      anti_corruption_detection: toBool(r.anti_corruption_detection),
      anti_corruption_investigation: toBool(r.anti_corruption_investigation),
      anti_corruption_social_control: toBool(r.anti_corruption_social_control),
      anti_corruption_traceability: toBool(r.anti_corruption_traceability),
      anti_corruption_relevance: toStr(r.anti_corruption_relevance),
      openness_level: toNum(r.openness_level),
      published: toBool(r.published),
      featured: toBool(r.featured),
      display_order: toNum(r.display_order),
      published_at: toStr(r.published_at),
      guatemala_exists: r.guatemala_exists ? toBool(r.guatemala_exists) : null,
      guatemala_observations: toStr(r.guatemala_observations),
      guatemala_evaluation_date: toStr(r.guatemala_evaluation_date),
      guatemala_evaluated_by: toStr(r.guatemala_evaluated_by),
      guatemala_regulatory_framework: toStr(r.guatemala_regulatory_framework),
      created_at: '',
      updated_at: '',
      created_by: null,
    };

    return {
      ...base,
      category: r.category_name ? {
        id: r.category_slug,
        name: r.category_name,
        slug: r.category_slug,
        description: null,
        icon_name: r.category_icon_name,
        color: r.category_color,
        display_order: 0,
        is_active: true,
        created_at: '',
        updated_at: '',
      } : null,
      dataset_type: r.dataset_type_name ? {
        id: r.dataset_type_slug,
        name: r.dataset_type_name,
        slug: r.dataset_type_slug,
        description: null,
        icon_name: r.dataset_type_icon_name,
        display_order: 0,
        is_active: true,
        created_at: '',
      } : null,
      institution: r.institution_name ? {
        id: r.institution_slug,
        name: r.institution_name,
        slug: r.institution_slug,
        acronym: toStr(r.institution_acronym),
        description: null,
        logo_url: null,
        website: toStr(r.institution_website),
        email: null,
        phone: null,
        is_active: true,
        display_order: 0,
        created_at: '',
        updated_at: '',
      } : null,
      status: r.status_name ? {
        id: r.status_slug,
        name: r.status_name,
        slug: r.status_slug,
        description: null,
        color: r.status_color,
        icon_name: r.status_icon_name,
        display_order: 0,
        is_active: true,
        created_at: '',
      } : null,
      tags: datasetTags
        .filter((dt) => dt.dataset_slug === slug)
        .map((dt) => ({ id: dt.tag_slug, name: dt.tag_name, slug: dt.tag_slug, created_at: '' })),
      resources: dsResources.map((res) => ({
        id: res.id,
        dataset_id: slug,
        name: res.name,
        description: res.description,
        type: res.type,
        format: res.format,
        url: res.url,
        file_path: res.file_path,
        file_size: res.file_size,
        mime_type: res.mime_type,
        last_updated: res.last_updated,
        is_active: res.is_active,
        display_order: res.display_order,
        created_at: '',
      })),
    };
  });
}

export async function loadAllPortalData() {
  const [settings, categories, datasetTypes, statuses, institutions, tags, integrityDomains, researchPaths, identifiers, datasets] = await Promise.all([
    loadSettings(),
    loadCategories(),
    loadDatasetTypes(),
    loadStatuses(),
    loadInstitutions(),
    loadTags(),
    loadIntegrityDomains(),
    loadResearchPaths(),
    loadIdentifiers(),
    loadDatasets(),
  ]);

  return { settings, categories, datasetTypes, statuses, institutions, tags, integrityDomains, researchPaths, identifiers, datasets };
}
