"use client";
import {
  MobileMenu,
  MarketsTable,
  SearchBar,
  RoycoStats,
  TableMenu,
} from "./_components";
import "./local.css";

import { ColumnToggler, Sorter } from "./_components/ui";
import { Pagination } from "./_components/pagination";
import cn from "clsx";
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import BearBackground from "@/components/bear-background";

const Page = () => {
  const Content = () => {
    return (
      <div className="hide-scrollbar flex flex-col items-center bg-[#FBFBF8] px-3 h-full">
        {/**
         * @title Header Bar
         * @description Header Tilte + Tagline + Stats
         */}
        <div
          className={cn(
            "mt-9 flex w-full shrink-0 flex-col items-center justify-between  px-3 pt-3 lg:mt-12 lg:flex-row",
            "gap-7 lg:gap-3 xl:gap-12",
            MAX_SCREEN_WIDTH,
            "px-0 lg:px-0"
          )}
        >
          <div className="flex w-full shrink flex-col items-start lg:w-1/2">
            <h2 className="heading-2 text-black">Discover</h2>

            <div className="body-1 mt-2 text-secondary">
              Browse the Royco ecosystem of projects to find opportunities to
              earn rich incentives.
            </div>
          </div>

          <RoycoStats className="w-full" />
        </div>

        <div
          className={cn(
            "hide-scrollbar flex w-full flex-row items-start space-x-0 p-3 pb-12 lg:p-12 lg:space-x-3",
            "mt-7 lg:mt-0",
            MAX_SCREEN_WIDTH,
            "px-0 lg:px-0"
          )}
        >
          <div
            style={{
              height: "fit-content",
              maxHeight: "80vh",
            }}
            className="hidden w-3/12 lg:max-h-[70vh] lg:block"
          >
            <TableMenu />
          </div>

          <div className="flex h-full w-full shrink-0 flex-col gap-3 lg:h-[70vh] lg:w-9/12">
            <div className="flex w-full flex-col items-center justify-between lg:flex-row">
              <div className="mr-3 hidden lg:hidden">
                <MobileMenu />
              </div>

              <SearchBar />

              <div className="hidden h-[2.875rem] w-fit flex-row items-center space-x-3 lg:flex">
                <Sorter />

                <ColumnToggler />
              </div>

              <div className="mt-3 flex w-full flex-row items-center justify-between space-x-2 lg:hidden">
                <div className="flex h-full flex-row space-x-2">
                  <MobileMenu />
                </div>

                <div className="flex w-fit flex-row items-center space-x-3">
                  <Sorter />
                  <ColumnToggler />
                </div>
              </div>
            </div>

            <MarketsTable />

            <Pagination />
          </div>
        </div>
      </div>
    );
  };

  return (
    <BearBackground>
      <Content />
    </BearBackground>
  );
};

export default Page;
