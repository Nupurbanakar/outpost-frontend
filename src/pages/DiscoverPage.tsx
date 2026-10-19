import { AppLayout } from '@/components/AppLayout';

export default function DiscoverPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-serif text-ink mb-4">
          Discover
        </h1>
        <p className="text-muted-text">
          Welcome to T-Hub Founders platform! This is the discover page.
        </p>
      </div>
    </AppLayout>
  );
}
