interface GrantContentSectionProps {
  title: string;
  content: string;
}

export function GrantContentSection({ title, content }: GrantContentSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-serif font-bold text-ink mb-4">{title}</h2>
      <div className="prose max-w-none text-muted-text whitespace-pre-line">
        {content}
      </div>
    </section>
  );
}
