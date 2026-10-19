import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface KeyInfoCardProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

export function KeyInfoCard({ icon: Icon, label, children }: KeyInfoCardProps) {
  return (
    <div className="bg-paper-light border border-line p-4">
      <div className="flex items-center gap-2 text-muted-text text-sm mb-2">
        <Icon className="w-4 h-4" />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold text-ink">
        {children}
      </div>
    </div>
  );
}
