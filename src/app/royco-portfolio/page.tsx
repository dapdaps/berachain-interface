'use client'
import "./local.css";

import cn from 'clsx';
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import { PositionsTable } from "./_components/positions-table";
import { MarketManagerStoreProvider } from "@/stores";
import { PortfolioStats } from "./_components/portfolio-stats";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const Content = () => {
    return (
      <MarketManagerStoreProvider>
        <div className="pt-[30px] pl-[12px] bg-[#FBFBF8]">
            <div onClick={() => router.back()}
                className={cn(
                  "flex cursor-pointer flex-row items-center gap-0 font-Montserrat text-xl font-light text-secondary  transition-all duration-200 ease-in-out hover:opacity-80"
                )}
                >
                <ChevronLeftIcon
                  strokeWidth={1.5}
                  className="-ml-2 h-6 w-6 text-secondary"
                />

                <div className="flex h-4">
                  <span className={cn("leading-5")}>Explore</span>
                </div>
            </div>
            </div>
        <div className="hide-scrollbar flex flex-col items-center bg-[#FBFBF8] px-3 md:px-12">
          {/**
           * @title Header Bar
           * @description Header Tilte + Tagline + Stats
           */}
          <div
            className={cn(
              "mt-9 flex w-full shrink-0 flex-col items-center justify-between  px-3 pt-3 md:mt-12 md:px-12 lg:flex-row",
              "gap-7 md:gap-3 xl:gap-12",
              MAX_SCREEN_WIDTH,
              "px-0 md:px-0"
            )}
          >
            <div className="flex w-full shrink flex-col items-start lg:w-1/2">
              <h2 className="heading-2 text-black">Portfolio</h2>

              <div className="body-1 mt-2 text-secondary">
                View your active positions and track your earnings across all
                markets.
              </div>
            </div>

            <PortfolioStats />
          </div>

          <div
            className={cn(
              "hide-scrollbar flex w-full flex-row items-start space-x-0 p-3 pb-12 md:p-12 lg:space-x-3",
              "mt-7 md:mt-0",
              MAX_SCREEN_WIDTH,
              "px-0 md:px-0"
            )}
          >
            <PositionsTable />
          </div>
        </div>
      </MarketManagerStoreProvider>
    );
  };

    return <Content />;
};

export default Page;
