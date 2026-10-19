import { LucideIcon, LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
}

/**
 * Icon component wrapper for consistent icon usage
 * Uses Lucide React icons with default size and stroke width
 * 
 * @example
 * <Icon icon={Search} className="text-muted" />
 * <Icon icon={Home} size={24} />
 */
export function Icon({ icon: IconComponent, size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return <IconComponent size={size} strokeWidth={strokeWidth} {...props} />;
}
