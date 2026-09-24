import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Tag as TagIcon } from 'lucide-react';
import type { DatasetWithRelations } from '@/types';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StatusBadge } from '@/components/StatusBadge';

interface DatasetCardProps {
  dataset: DatasetWithRelations;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Link
      to={`/datasets/${dataset.slug}`}
      className="card group flex flex-col p-5 hover:border-cnc-300"
    >
      {/* Icon + category */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cnc-50 text-cnc-700 group-hover:bg-cnc-100 transition-colors">
          <DynamicIcon
            name={dataset.icon_name}
            url={dataset.icon_url}
            iconType={dataset.icon_type}
            className="h-6 w-6"
          />
        </div>
      </div>

      {/* Name + description */}
      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-cnc-700 transition-colors">
        {dataset.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {dataset.short_description || dataset.description}
      </p>

      {/* Category + type */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {dataset.category && (
          <span className="chip bg-gray-100 text-gray-600">
            {dataset.category.name}
          </span>
        )}
        {dataset.dataset_type && (
          <span className="chip bg-gray-100 text-gray-500">
            {dataset.dataset_type.name}
          </span>
        )}
      </div>

      {/* Institution */}
      {dataset.institution && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Building2 className="h-3.5 w-3.5" />
          <span>{dataset.institution.name}</span>
        </div>
      )}

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dataset.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="inline-flex items-center gap-1 text-xs text-gray-400">
              <TagIcon className="h-3 w-3" />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        <StatusBadge status={dataset.status} />
        <span className="inline-flex items-center gap-1 text-sm font-medium text-cnc-700 group-hover:gap-2 transition-all">
          Ver conjunto
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
