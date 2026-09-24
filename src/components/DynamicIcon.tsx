import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type LucideIcon = React.ComponentType<LucideProps>;

const iconMap = LucideIcons as unknown as Record<string, LucideIcon>;

interface DynamicIconProps extends LucideProps {
  name: string;
  url?: string | null;
  iconType?: 'lucide' | 'svg' | 'png' | 'webp';
}

export function DynamicIcon({ name, url, iconType = 'lucide', className, ...rest }: DynamicIconProps) {
  if (iconType !== 'lucide' && url) {
    return (
      <img
        src={url}
        alt={name}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  const Icon = iconMap[name] || iconMap['Database'];
  if (!Icon) return null;
  return <Icon className={className} {...rest} />;
}
