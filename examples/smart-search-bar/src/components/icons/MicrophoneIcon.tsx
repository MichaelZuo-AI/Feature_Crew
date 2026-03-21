'use client';

interface MicrophoneIconProps {
  className?: string;
}

export default function MicrophoneIcon({ className }: MicrophoneIconProps) {
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
        d="M10 1a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"
        fill="currentColor"
      />
      <path
        d="M15 9a5 5 0 0 1-10 0M10 15v4M7 19h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
