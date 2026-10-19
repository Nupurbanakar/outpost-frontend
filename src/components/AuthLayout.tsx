interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

/**
 * AuthLayout - Consistent layout for all authentication pages
 * 
 * Features:
 * - Centered card layout with T-Hub branding
 * - Warm background (#f8f8f5)
 * - White card with subtle shadow
 * - Responsive: full-width on mobile, max-width card on desktop
 * - Footer text
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink mb-4">
            <div className="w-4 h-4 rounded-full border-2 border-gold"></div>
          </div>
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">{title}</h1>
          <p className="text-muted-text">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-text mt-8">
          Exclusive to the T-Hub founder community
        </p>
      </div>
    </div>
  );
}
