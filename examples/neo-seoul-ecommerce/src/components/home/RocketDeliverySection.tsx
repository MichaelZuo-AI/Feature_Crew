import Link from 'next/link';
import Image from 'next/image';
import { rocketProducts } from '@/data/mock-data';
import { formatPrice } from '@/lib/format';

export default function RocketDeliverySection() {
  return (
    <section>
      <div className="flex items-center gap-2 px-4 mb-4">
        <h2 className="text-lg font-bold text-on-surface">Rocket Delivery</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
          Arrives Tomorrow
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
        {rocketProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex-shrink-0 w-32"
          >
            <div className="relative aspect-square bg-white rounded-lg p-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2"
                sizes="128px"
              />
              <span
                className="material-symbols-outlined absolute bottom-1 right-1 text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                rocket_launch
              </span>
            </div>

            <p className="mt-2 text-[11px] text-on-surface leading-tight line-clamp-2">
              {product.name}
            </p>

            <p className="mt-1 text-sm font-bold text-on-surface">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
