"use client";

import Ramen from "@/sections/ramen/";
import useIsMobile from '@/hooks/use-isMobile';
import Tabs from '@/components/tabs';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const isMobile = useIsMobile();
  const search = useSearchParams();

  let defaultTab = search.get("tab");
  defaultTab =
    defaultTab && ["current", "past"].includes(defaultTab)
      ? defaultTab
      : "current";

  const [currentTab, setCurrentTab] = useState<string>(defaultTab);

  return isMobile ? (
    <div className="relative w-full mx-auto">
      <Tabs
        isCard
        currentTab={currentTab}
        tabs={[
          {
            key: 'current',
            label: (
              <div className="absolute left-[12px] whitespace-nowrap text-center z-10 text-[14px] font-[700] leading-[100%]">
                <div>Current & Upcoming</div>
                <div>Launches</div>
              </div>
            ),
            children: <Ramen tab={currentTab} />,
          },
          {
            key: 'past',
            label: (
              <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center z-10 text-[14px] font-[700] leading-[100%]">
                Past Launches
              </div>
            ),
            children: <Ramen tab={currentTab} />,
          },
        ]}
        onChange={(key) => setCurrentTab(key as string)}
        className="h-full"
      />
    </div>
  ) : (
    <Ramen />
  );
}
