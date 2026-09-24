import { DynamicIcon } from '@/components/DynamicIcon';
import type { Status } from '@/types';

interface StatusBadgeProps {
  status?: Status | null;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  if (!status) {
    return (
      <span className="chip bg-gray-100 text-gray-500">
        <span className="h-2 w-2 rounded-full bg-gray-400" />
        Sin estado
      </span>
    );
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${status.color}15`,
        color: status.color,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: status.color }}
      />
      {status.name}
    </span>
  );
}
