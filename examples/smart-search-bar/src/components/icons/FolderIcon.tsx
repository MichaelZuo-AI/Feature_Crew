'use client';

interface FolderIconProps {
  className?: string;
}

export default function FolderIcon({ className }: FolderIconProps) {
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
        d="M2 5a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 11.828 6H16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
