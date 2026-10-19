export function MentorsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-line p-6 animate-pulse">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 w-32 mb-2" />
              <div className="h-4 bg-gray-200 w-full mb-2" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 w-full" />
            <div className="h-4 bg-gray-200 w-5/6" />
          </div>

          {/* Expertise tags */}
          <div className="flex gap-2 flex-wrap mb-4">
            <div className="h-6 bg-gray-200 w-20" />
            <div className="h-6 bg-gray-200 w-24" />
            <div className="h-6 bg-gray-200 w-16" />
          </div>

          {/* Button */}
          <div className="h-10 bg-gray-200 w-full" />
        </div>
      ))}
    </div>
  );
}
