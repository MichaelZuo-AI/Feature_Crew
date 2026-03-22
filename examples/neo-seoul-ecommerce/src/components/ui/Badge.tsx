import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant: 'discount' | 'rocket' | 'gold' | 'tag';
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  discount: 'bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm',
  rocket: 'bg-secondary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase',
  gold: 'bg-secondary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase',
  tag: 'bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-sm',
};

export default function Badge({ children, variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
