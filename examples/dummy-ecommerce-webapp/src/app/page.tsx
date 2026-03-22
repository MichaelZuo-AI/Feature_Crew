'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopAppBar from '@/components/layout/TopAppBar';
import CategoryTabs from '@/components/home/CategoryTabs';
import HeroBanner from '@/components/home/HeroBanner';
import GoldBoxSection from '@/components/home/GoldBoxSection';
import ExpressDeliverySection from '@/components/home/ExpressDeliverySection';
import WeeklyEdit from '@/components/home/WeeklyEdit';
import FAB from '@/components/layout/FAB';

// Tab indices: 0=Home(all), 1=Fresh Market, 2=Best, 3=Gold Box, 4=Express Delivery
export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="pt-16 pb-24">
      <TopAppBar title="The Curator" showSearch showCart />
      <CategoryTabs activeIndex={activeTab} onTabChange={setActiveTab} />

      {/* Home tab shows everything */}
      {(activeTab === 0 || activeTab === 1) && (
        <div className="px-4 mt-4">
          <Link href="/flash-sale">
            <HeroBanner />
          </Link>
        </div>
      )}

      {(activeTab === 0 || activeTab === 3) && (
        <div className="mt-8 px-4">
          <GoldBoxSection />
        </div>
      )}

      {(activeTab === 0 || activeTab === 4) && (
        <div className="mt-8">
          <ExpressDeliverySection />
        </div>
      )}

      {(activeTab === 0 || activeTab === 2) && (
        <div className="mt-8">
          <WeeklyEdit />
        </div>
      )}

      <FAB />
    </div>
  );
}
