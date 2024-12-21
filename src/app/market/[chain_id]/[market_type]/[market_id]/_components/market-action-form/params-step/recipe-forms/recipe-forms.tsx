import React from "react";
import cn from 'clsx';
import { useActiveMarket } from "../../../hooks";
import {
  MarketFundingType,
  MarketOfferType,
  MarketUserType,
  useMarketManager,
} from "@/stores";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { z } from "zod";
import { SlideUpWrapper } from "@/components/animation";
import {
  FundingVaultSelector,
  IncentivesAmountSelector,
  InputAmountWrapper,
  InputExpirySelector,
} from "../composables";

export const RecipeForms = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { userType, offerType, fundingType } = useMarketManager();

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <div className="h-12 grow overflow-x-hidden overflow-y-scroll pb-2">
        {/**
         * Funding Vault Selector
         */}
        {userType === MarketUserType.ap.id && (
          <SlideUpWrapper
            layout="position"
            layoutId="motion:market:funding-vault-selector"
            delay={0.2}
            className="mb-5"
          >
            <FundingVaultSelector
              address=""
              currentValue={marketActionForm.watch("funding_vault") ?? ""}
              setCurrentValue={(value) => {
                marketActionForm.setValue("funding_vault", value);
              }}
            />
          </SlideUpWrapper>
        )}

        {/**
         * Quantity Selector for AP
         */}
        {userType === MarketUserType.ap.id && (
          <InputAmountWrapper
            marketActionForm={marketActionForm}
            delay={fundingType === MarketFundingType.wallet.id ? 0.3 : 0.4}
          />
        )}

        {/**
         * Quantity Selector for IP
         */}
        {userType === MarketUserType.ip.id && (
          <InputAmountWrapper marketActionForm={marketActionForm} delay={0.2} />
        )}

        {/**
         * Incentives Amount Selector
         */}
        {userType === MarketUserType.ap.id &&
          offerType === MarketOfferType.limit.id && (
            <IncentivesAmountSelector
              marketActionForm={marketActionForm}
              delayTitle={0.4}
              delayContent={0.5}
            />
          )}

        {userType === MarketUserType.ip.id &&
          offerType === MarketOfferType.limit.id && (
            <IncentivesAmountSelector
              marketActionForm={marketActionForm}
              delayTitle={0.3}
              delayContent={0.4}
            />
          )}

        {offerType === MarketOfferType.limit.id && (
          <InputExpirySelector
            delay={0.5}
            marketActionForm={marketActionForm}
          />
        )}
      </div>
    </div>
  );
});
