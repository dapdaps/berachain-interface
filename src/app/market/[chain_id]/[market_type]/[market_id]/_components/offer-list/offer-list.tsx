import cn from 'clsx';
import React from "react";
import { useActiveMarket } from "../hooks";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";

import { SpringNumber } from "@/components/composables";
import { AlertIndicator } from "@/components/common";
import { FallMotion } from "@/components/animation";
import { RoycoMarketType } from "@/sdk/market";

export const CentralBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentMarketData, marketMetadata } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-none shrink-0 flex-row items-center justify-between border-y border-divider",
        BASE_PADDING_LEFT,
        BASE_PADDING_RIGHT,
        "py-2",
        className
      )}
      {...props}
    >
      <SecondaryLabel className="font-medium text-black">
        {/**
         * @TODO
         * For Recipe, this should be currentMarketData.quantity_value_usd
         * For Vault, this needs to be calculated
         */}
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
          useGrouping: true,
        }).format(
          marketMetadata.market_type === RoycoMarketType.recipe.id
            ? (currentMarketData?.quantity_ap_usd ?? 0) +
                (currentMarketData?.quantity_ip_usd ?? 0)
            : (currentMarketData?.quantity_ap_usd ?? 0)
        )}
      </SecondaryLabel>

      <SecondaryLabel className="font-medium text-black">MARKET</SecondaryLabel>
    </div>
  );
});

const OfferListRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type: "ap" | "ip";
    indexKey: string;
    customKey: string;
    keyInfo: {
      previousValue: number;
      currentValue: number;
    };
    valueInfo: {
      previousValue: number;
      currentValue: number;
    };
    delay?: number;
  }
>(
  (
    {
      className,
      delay,
      indexKey,
      type,
      customKey,
      keyInfo,
      valueInfo,
      ...props
    },
    ref
  ) => {
    return (
      <FallMotion
        delay={delay}
        key={indexKey}
        ref={ref}
        customKey={customKey}
        height="1rem"
        className={cn("w-full", className)}
        contentClassName="flex flex-row items-center justify-between w-full h-4 text-sm"
        {...props}
      >
        <SecondaryLabel>
          <SpringNumber
            defaultColor={type === "ap" ? "text-success" : "text-error"}
            previousValue={keyInfo.previousValue}
            currentValue={keyInfo.currentValue}
            numberFormatOptions={{
              style: "currency",
              notation: "compact",
              useGrouping: true,
              currency: "USD",
            }}
          />
        </SecondaryLabel>
        <SecondaryLabel>
          <SpringNumber
            previousValue={valueInfo.previousValue}
            currentValue={valueInfo.currentValue}
            numberFormatOptions={{
              style: "percent",
              notation: "compact",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
          />
        </SecondaryLabel>
      </FallMotion>
    );
  }
);

export const OfferList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    marketMetadata,
    currentMarketData,
    propsHighestOffers,
    currentHighestOffers,
    previousHighestOffers,
  } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-[18rem] w-full shrink-0 grow flex-col overflow-hidden",
        marketMetadata.market_type === RoycoMarketType.recipe.id && "pb-5",
        // marketMetadata.market_type === RoycoMarketType.vault.id && "pb-2",
        className
      )}
      {...props}
    >
      <TertiaryLabel className={cn("flex-none shrink-0", BASE_PADDING)}>
        OFFER LIST
      </TertiaryLabel>

      <div
        className={cn(
          "flex w-full flex-none shrink-0 flex-row justify-between",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT
        )}
      >
        <TertiaryLabel className="text-tertiary">SIZE</TertiaryLabel>
        <TertiaryLabel className="text-tertiary">APR</TertiaryLabel>
      </div>

      {/**
       * Show IP offers only for recipe markets
       */}
      {marketMetadata.market_type === RoycoMarketType.recipe.id && (
        <div
          className={cn(
            "flex flex-1 flex-col-reverse overflow-y-scroll",
            "gap-2 py-2",
            BASE_PADDING_LEFT,
            BASE_PADDING_RIGHT,
            BASE_MARGIN_TOP.SM
          )}
        >
          {!!currentHighestOffers &&
          !!currentHighestOffers.ip_offers &&
          currentHighestOffers.ip_offers.length !== 0 ? (
            currentHighestOffers?.ip_offers.map((offer, offerIndex) => {
              const BASE_KEY = `market:offer:${offer.offer_id}-${offer.offer_side}`;
              const INDEX_KEY = `market:offer:${offer.offer_side}:${offerIndex}`;

              const keyInfo = {
                previousValue:
                  !!previousHighestOffers &&
                  offerIndex < previousHighestOffers.ip_offers.length
                    ? (previousHighestOffers?.ip_offers[offerIndex]
                        .quantity_value_usd ?? 0)
                    : 0,

                currentValue: offer.quantity_value_usd as number,
              };

              const valueInfo = {
                previousValue:
                  !!previousHighestOffers &&
                  offerIndex < previousHighestOffers.ip_offers.length
                    ? (previousHighestOffers?.ip_offers[offerIndex]
                        .annual_change_ratio ?? 0)
                    : 0,
                currentValue: offer.annual_change_ratio as number,
              };

              return (
                <OfferListRow
                  key={`offer-list-row:${offer.offer_id}`}
                  type="ap"
                  customKey={`${BASE_KEY}:${keyInfo.previousValue}:${keyInfo.currentValue}:${valueInfo.previousValue}:${valueInfo.currentValue}`}
                  indexKey={INDEX_KEY}
                  keyInfo={keyInfo}
                  valueInfo={valueInfo}
                />
              );
            })
          ) : (
            <AlertIndicator className="h-full">No offers yet</AlertIndicator>
          )}
        </div>
      )}

      {/**
       * Central Bar
       */}
      {marketMetadata.market_type === RoycoMarketType.recipe.id && (
        <CentralBar />
      )}

      <div
        className={cn(
          "flex flex-1 flex-col overflow-y-scroll",
          "gap-2 py-2",
          BASE_PADDING_LEFT,
          BASE_PADDING_RIGHT
        )}
      >
        {!!currentHighestOffers &&
        !!currentHighestOffers.ap_offers &&
        currentHighestOffers.ap_offers.length !== 0 ? (
          currentHighestOffers?.ap_offers.map((offer, offerIndex) => {
            const BASE_KEY = `market:offer:${offer.offer_id}-${offer.offer_side}`;
            const INDEX_KEY = `market:offer:${offer.offer_side}:${offerIndex}`;

            const keyInfo = {
              previousValue:
                !!previousHighestOffers &&
                offerIndex < previousHighestOffers.ap_offers.length
                  ? (previousHighestOffers?.ap_offers[offerIndex]
                      .quantity_value_usd ?? 0)
                  : 0,

              currentValue: offer.quantity_value_usd as number,
            };

            const valueInfo = {
              previousValue:
                !!previousHighestOffers &&
                offerIndex < previousHighestOffers.ap_offers.length
                  ? (previousHighestOffers?.ap_offers[offerIndex]
                      .change_ratio ?? 0)
                  : 0,
              currentValue: offer.annual_change_ratio as number,
            };

            return (
              <OfferListRow
                type="ip"
                customKey={`${BASE_KEY}:${keyInfo.previousValue}:${keyInfo.currentValue}:${valueInfo.previousValue}:${valueInfo.currentValue}`}
                indexKey={INDEX_KEY}
                keyInfo={keyInfo}
                valueInfo={valueInfo}
              />
            );
          })
        ) : (
          <AlertIndicator className="h-full">No offers yet</AlertIndicator>
        )}
      </div>

      {marketMetadata.market_type === RoycoMarketType.vault.id && (
        <CentralBar className="h-9 border-b-0" />
      )}
    </div>
  );
});
