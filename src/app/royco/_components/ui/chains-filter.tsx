"use client";

import { Fragment } from "react";

import cn from "clsx";

import { useBaseChains } from "@/sdk/hooks";

import { FilterWrapper } from "../composables";

export const ChainsFilter = () => {
  const { data } = useBaseChains();

  return (
    <Fragment>
      {data.map((chain) => {
        // TODO: Royco when mainnet- Remove this check
        // const shouldHide =
        //   process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "TESTNET" &&
        //   chain?.testnet === true;
        const shouldHide = false;

        return (
          <div
            className={cn(shouldHide && "hidden")}
            key={`filter-wrapper:chains:${chain.id}`}
          >
            <FilterWrapper
              filter={{
                id: "chain_id",
                value: chain.id,
              }}
              token={chain}
            />
          </div>
        );
      })}
    </Fragment>
  );
};
