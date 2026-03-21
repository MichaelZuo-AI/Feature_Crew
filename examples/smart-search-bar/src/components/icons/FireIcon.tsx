'use client';

interface FireIconProps {
  className?: string;
}

export default function FireIcon({ className }: FireIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1c0 3.5-3 5.5-3 9a5 5 0 0 0 10 0c0-3.5-3-5.5-3-9a3 3 0 0 1-2 3 3 3 0 0 1-2-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
