import Image from 'next/image';
import { banners } from '@/data/mock-data';

export default function HeroBanner() {
  const banner = banners[0];

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-cover"
        sizes="(max-width: 448px) 100vw, 448px"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 gap-2">
        <span className="self-start px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
          {banner.title}
        </span>

        <h2 className="text-white text-2xl font-extrabold leading-tight">
          {banner.cta_label}
        </h2>

        <p className="text-white/80 text-xs">
          {banner.subtitle}
        </p>
      </div>
    </div>
  );
}
