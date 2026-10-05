export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatasetType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Status {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  acronym: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Dataset {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  icon_type: 'lucide' | 'svg' | 'png' | 'webp';
  icon_name: string;
  icon_url: string | null;
  image_url: string | null;
  category_id: string | null;
  dataset_type_id: string | null;
  institution_id: string | null;
  status_id: string | null;
  is_pida: boolean;
  pida_topic_id: string | null;
  availability: string | null;
  coverage_geo: string | null;
  coverage_temporal: string | null;
  frequency: string | null;
  last_updated_at: string | null;
  license: string | null;
  source_url: string | null;
  source_contact: string | null;
  api_url: string | null;
  api_available: boolean;
  metadata_url: string | null;
  documentation_url: string | null;
  anti_corruption_prevention: boolean;
  anti_corruption_detection: boolean;
  anti_corruption_investigation: boolean;
  anti_corruption_social_control: boolean;
  anti_corruption_traceability: boolean;
  anti_corruption_relevance: string | null;
  openness_level: number;
  published: boolean;
  featured: boolean;
  display_order: number;
  published_at: string | null;
  guatemala_exists: boolean | null;
  guatemala_observations: string | null;
  guatemala_evaluation_date: string | null;
  guatemala_evaluated_by: string | null;
  guatemala_regulatory_framework: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface DatasetWithRelations extends Dataset {
  category?: Category | null;
  dataset_type?: DatasetType | null;
  institution?: Institution | null;
  status?: Status | null;
  tags?: Tag[];
  resources?: Resource[];
}

export interface Resource {
  id: string;
  dataset_id: string;
  name: string;
  description: string | null;
  type: string;
  format: string | null;
  url: string | null;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  last_updated: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string | null;
  value_json: unknown | null;
  updated_at: string;
}

export interface IntegrityDomain {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  question: string | null;
  icon_name: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResearchPath {
  id: string;
  title: string;
  description: string | null;
  icon_name: string;
  destination_url: string | null;
  related_domain_id: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
}

export interface Identifier {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UseCase {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  methodology: string | null;
  results: string | null;
  links: { label: string; url: string }[] | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  datasets?: Dataset[];
}

export interface DataStory {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  cover_image: string | null;
  author: string | null;
  publication_date: string | null;
  published: boolean;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface OpeningAgendaItem {
  id: string;
  dataset_id: string | null;
  information: string;
  situation: string | null;
  institution: string | null;
  priority: string;
  recommendation: string | null;
  progress: number;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}
