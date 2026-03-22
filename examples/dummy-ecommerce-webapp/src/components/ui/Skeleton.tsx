export default function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-low rounded-lg overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-surface-container" />
          <div className="p-3 space-y-2">
            <div className="h-2.5 w-16 bg-surface-container rounded" />
            <div className="h-3 w-full bg-surface-container rounded" />
            <div className="h-3 w-3/4 bg-surface-container rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
