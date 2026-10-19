export function ExpiredBanner() {
  return (
    <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800">
      <p className="font-semibold">This grant has expired</p>
      <p className="text-sm">
        The deadline for this grant has passed. Check back for new opportunities.
      </p>
    </div>
  );
}
