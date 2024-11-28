"use client";

import React from "react";
import { useActiveMarket } from "../hooks";
import { useAccount } from "wagmi";
import { useEnrichedPositionsVault } from "@/sdk/hooks";
import { StatsDataTable } from "./stats-data-table";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator } from "@/components/common";
import { positionsVaultColumns } from "./positions-vault-columns";
import { useMarketManager } from "@/stores";
import { RoycoMarketUserType } from "@/sdk/market";

export const PositionsVaultTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  const { userType } = useMarketManager();

  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { isLoading, data, isError } = useEnrichedPositionsVault({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: (address?.toLowerCase() as string) ?? "",
    offer_side:
      userType === RoycoMarketUserType.ap.id
        ? RoycoMarketUserType.ap.value
        : RoycoMarketUserType.ip.value,
  });

  let totalCount = data ? data.length : 0;

  if (isLoading) {
    return (
      <div className="flex w-full grow flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (totalCount === 0) {
    return (
      <div className="flex w-full grow flex-col place-content-center items-center">
        <AlertIndicator>No positions found</AlertIndicator>
      </div>
    );
  } else {
    return (
      <StatsDataTable
        pagination={{
          currentPage: 0,
          totalPages: 1,
          setPage: () => {},
        }}
        columns={positionsVaultColumns}
        data={data ?? []}
      />
    );
  }
});
