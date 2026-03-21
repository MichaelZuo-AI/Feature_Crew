'use client';

interface SearchSkeletonProps {
  isMobile: boolean;
  count?: number;
}

function SkeletonCard({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="bg-[#242424] border border-[#333] rounded-[10px] overflow-hidden">
      {/* Image placeholder */}
      <div
        className={`${isMobile ? 'h-[100px]' : 'h-[140px]'} shimmer`}
      />

      <div className="p-3 space-y-2">
        {/* Title line 1 */}
        <div className="h-3 rounded shimmer" style={{ width: '60%' }} />
        {/* Title line 2 */}
        <div className="h-3 rounded shimmer" style={{ width: '40%' }} />
        {/* Price */}
        <div className="h-4 rounded shimmer mt-1" style={{ width: '30%' }} />
        {/* Rating */}
        <div className="h-3 rounded shimmer" style={{ width: '40%' }} />
      </div>
    </div>
  );
}

export default function SearchSkeleton({
  isMobile,
  count = 4,
}: SearchSkeletonProps) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            #2a2a2a 25%,
            #3a3a3a 50%,
            #2a2a2a 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div
        className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}
      >
        {Array.from({ length: count }, (_, i) => (
          <SkeletonCard key={i} isMobile={isMobile} />
        ))}
      </div>
    </>
  );
}
