'use client';

interface CameraIconProps {
  className?: string;
}

export default function CameraIcon({ className }: CameraIconProps) {
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
        d="M1 6a2 2 0 0 1 2-2h2.172a2 2 0 0 0 1.414-.586l.828-.828A2 2 0 0 1 8.828 2h2.344a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 14.828 4H17a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="10.5"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
