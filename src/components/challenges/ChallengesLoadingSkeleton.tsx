export function ChallengesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-line p-6 animate-pulse">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 w-24 mb-2" />
              <div className="h-6 bg-gray-200 w-full mb-2" />
              <div className="h-4 bg-gray-200 w-3/4" />
            </div>
          </div>
          
          {/* Meta */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 w-1/2" />
            <div className="h-4 bg-gray-200 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
