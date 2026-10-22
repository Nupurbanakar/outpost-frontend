import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

/**
 * Standardized page header following Outpost design system
 * - Serif font for title (text-4xl)
 * - Muted text for description
 * - Optional action button/element on the right
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-2">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-muted-text">
            {description}
          </p>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
