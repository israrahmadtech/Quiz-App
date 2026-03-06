export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin ${className}`} />
  );
};

export const PageSpinner = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <Spinner size="lg" />
    <p className="text-slate-500 text-sm">Loading...</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="card space-y-3 animate-pulse">
    <div className="skeleton h-40 rounded-xl" />
    <div className="skeleton h-4 rounded w-3/4" />
    <div className="skeleton h-3 rounded w-1/2" />
    <div className="flex gap-2">
      <div className="skeleton h-6 rounded-lg w-16" />
      <div className="skeleton h-6 rounded-lg w-16" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);
