'use client';

interface SpellCorrectionBannerProps {
  corrected: string;
  original: string;
  onSearchOriginal: (query: string) => void;
}

export default function SpellCorrectionBanner({
  corrected,
  original,
  onSearchOriginal,
}: SpellCorrectionBannerProps) {
  return (
    <p className="text-sm text-[#888]">
      Showing results for{' '}
      <span className="font-medium text-[#E8E8E8]">&lsquo;{corrected}&rsquo;</span>.
      Search instead for{' '}
      <button
        type="button"
        className="text-[#818CF8] underline cursor-pointer bg-transparent border-none p-0 text-sm"
        onClick={() => onSearchOriginal(original)}
      >
        &lsquo;{original}&rsquo;
      </button>
    </p>
  );
}
