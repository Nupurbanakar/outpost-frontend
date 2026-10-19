import { Building2 } from 'lucide-react';

interface GrantHeaderProps {
  title: string;
  type: 'GRANT' | 'SUBSIDY' | 'SCHEME' | 'INCENTIVE';
  issuingBody: string;
}

export function GrantHeader({ title, type, issuingBody }: GrantHeaderProps) {
  return (
    <header className="mb-8">
      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide border bg-[#f0f9f4] text-[#2d6a4f] border-[#95d5b2]">
          {type}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-3">
        {title}
      </h1>

      {/* Issuing Body */}
      <p className="text-lg text-muted-text flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        {issuingBody}
      </p>
    </header>
  );
}
