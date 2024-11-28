"use client";

import cn from 'clsx';
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  MarketSteps,
  MarketUserType,
  MarketViewType,
  useMarketManager,
} from "@/stores";
import { useActiveMarket } from "../hooks";
import { MarketActionType, MarketOfferType, MarketType } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseFundingVault, useTokenQuotes } from "@/sdk/hooks";
import {
  BASE_UNDERLINE,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { Button } from "@/components/ui/button";
import { ErrorAlert, HorizontalTabs } from "@/components/composables";
import toast from "react-hot-toast";
import { useAccount, useSwitchChain } from "wagmi";
import { ParamsStep } from "./params-step";
import { PreviewStep } from "./preview-step";
import { ChevronLeftIcon } from "lucide-react";
import { WithdrawSection } from "./withdraw-section"; // @todo fix it
import { useMarketFormDetails } from "./use-market-form-details";
import { SlideUpWrapper } from "@/components/animation";
import { OfferTypeSelector } from "./offer-type-selector";
import { MarketActionFormSchema } from "./market-action-form-schema";
import { useAppKit } from '@reown/appkit/react';

export const MarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    marketStep,
    setMarketStep,
    transactions,
    setTransactions,
    actionType,
    setActionType,
    userType,
    setUserType,
    viewType,
    offerType,
    setOfferType,
  } = useMarketManager();
  const { address, isConnected, chainId } = useAccount();
  const modal = useAppKit();

  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { switchChain } = useSwitchChain();

  const marketActionForm = useForm<z.infer<typeof MarketActionFormSchema>>({
    resolver: zodResolver(MarketActionFormSchema as any),
    defaultValues: {
      funding_vault: "" as string,
      incentive_tokens: [],
      no_expiry: true,
    },
  });

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      currentMarketData?.input_token_id ?? "",
      ...marketActionForm.watch("incentive_tokens").map((token) => token.id),
    ].filter(Boolean),
  });

  const {
    isLoading,
    isValid,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentiveData,
  } = useMarketFormDetails(marketActionForm);

  const handleNextStep = async () => {
    try {
      if (!isConnected) {
        modal.open();
      } else if (
        // @ts-ignore
        chainId !== marketMetadata.chain_id
      ) {
        try {
          await switchChain({
            chainId: marketMetadata.chain_id,
          });
        } catch (error) {}
      } else if (marketStep === MarketSteps.params.id) {
        if (isValid.status) {
          onSubmit(marketActionForm.getValues());
        } else {
          toast.custom(<ErrorAlert message={isValid.message} />);
        }
      } else if (
        marketStep === MarketSteps.preview.id &&
        canBePerformedPartially
      ) {
        setTransactions(writeContractOptions);
      }
    } catch (error) {
      toast.custom(<ErrorAlert message="Error submitting offer" />);
    }
  };

  const nextLabel = () => {
    if (!address) {
      return "Connect wallet";
    } else if (
      // @ts-ignore
      chainId !== marketMetadata.chain_id
    ) {
      return "Switch chain";
    } else if (marketStep === MarketSteps.params.id) {
      return "Preview offer";
    } else if (marketStep === MarketSteps.preview.id) {
      return "Confirm offer";
    } else {
      return "Offer in progress";
    }
  };

  const onSubmit = (data: any) => {
    if (isValid.status) {
      setMarketStep(MarketSteps.preview.id);
    }
  };

  useEffect(() => {
    if (viewType === MarketViewType.simple.id) {
      setUserType(MarketUserType.ap.id);
    }
  }, [viewType]);

  useEffect(() => {
    if (
      userType === MarketUserType.ip.id &&
      actionType === MarketActionType.withdraw.id
    ) {
      setActionType(MarketActionType.supply.id);
    }
  }, [userType]);

  if (!!currentMarketData) {
    return (
      <div
        key={`market-action-form:container:${marketStep}:${viewType}`}
        ref={ref}
        className={cn(
          "flex w-full shrink-0 grow flex-col",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        {marketStep !== MarketSteps.params.id && (
          <SlideUpWrapper
            layout="position"
            layoutId={`motion:market:back-button:${marketStep}`}
            className={cn(
              "mt-5 flex w-full flex-row place-content-start items-center px-5 pb-3 text-left"
            )}
          >
            <div
              onClick={() => setMarketStep(MarketSteps.params.id)}
              className={cn(
                BASE_UNDERLINE.MD,
                "flex flex-row place-content-start items-center space-x-1 text-left decoration-transparent",
                "transition-all duration-200 ease-in-out hover:text-black hover:decoration-tertiary"
              )}
            >
              <ChevronLeftIcon
                strokeWidth={1}
                className="h-5 w-5 text-secondary"
              />
              <SecondaryLabel className="mt-[0.15rem] flex h-4 leading-none">
                OFFER PARAMS
              </SecondaryLabel>
            </div>
          </SlideUpWrapper>
        )}

        {marketStep !== MarketSteps.params.id && (
          <SlideUpWrapper
            layout="position"
            layoutId={`motion:market:form-label:${marketStep}`}
            delay={0.2}
          >
            <TertiaryLabel className={cn("px-5 pt-5")}>
              {MarketSteps[marketStep].label}
            </TertiaryLabel>
          </SlideUpWrapper>
        )}

        {/**
         * @note: New version
         * User Type (Simple / Advanced)
         */}
        {marketStep === MarketSteps.params.id && (
          <SlideUpWrapper
            className={cn("flex flex-row items-center justify-between")}
          >
            <TertiaryLabel
              /**
               * @note Commented out for now because user type switch is moved to top
               */
              // onClick={() => {
              //   setUserType(MarketUserType.ap.id);
              // }}
              className={cn(
                "cursor-pointer px-5 pt-5",
                "transition-all duration-200 ease-in-out hover:text-primary"
                /**
                 * @note Commented out for now because user type switch is moved to top
                 */
                // userType === MarketUserType.ap.id && BASE_UNDERLINE.MD
              )}
            >
              TRANSACT
            </TertiaryLabel>

            {/**
             * @note Commented out for now because user type switch is moved to top
             */}
            {/* {viewType === MarketViewType.advanced.id && (
              <TertiaryLabel
                onClick={() => {
                  setActionType(MarketActionType.supply.id);
                  setUserType(MarketUserType.ip.id);
                }}
                className={cn(
                  "cursor-pointer px-5 pt-5",
                  "transition-all duration-200 ease-in-out hover:text-primary",
                  userType === MarketUserType.ip.id && BASE_UNDERLINE.MD
                )}
              >
                INCENTIVIZE
              </TertiaryLabel>
            )} */}
          </SlideUpWrapper>
        )}

        {/**
         * Action Type (Supply / Withdraw)
         */}
        {marketStep === MarketSteps.params.id &&
          userType === MarketUserType.ap.id && (
            <SlideUpWrapper
              layout="position"
              layoutId="motion:market:action-type"
              className={cn("mt-5 flex flex-col px-5")}
            >
              <HorizontalTabs
                className={cn("")}
                size="sm"
                key="market:action-type:container"
                baseId="market:action-type"
                tabs={Object.values(MarketActionType)}
                activeTab={actionType}
                setter={setActionType}
              />
            </SlideUpWrapper>
          )}

        {marketStep === MarketSteps.params.id &&
          actionType === MarketActionType.supply.id && (
            <SlideUpWrapper
              layout="position"
              layoutId="motion:market:offer-type-selector"
              className={cn("mt-5 px-5")}
            >
              <OfferTypeSelector />
            </SlideUpWrapper>
          )}

        {/**
         * Withdraw Section (Input Token / Incentives)
         */}
        {actionType === MarketActionType.withdraw.id && (
          <SlideUpWrapper className="mt-5 grow px-5">
            <WithdrawSection />
          </SlideUpWrapper>
        )}

        {/* <WithdrawSection /> */}

        {/**
         * Params Step
         */}
        {marketStep === MarketSteps.params.id &&
          actionType === MarketActionType.supply.id && (
            <ParamsStep
              marketActionForm={marketActionForm}
              className={cn("mt-5 px-5")}
            />
          )}

        {/**
         * Preview Step
         */}
        {marketStep === MarketSteps.preview.id && (
          <PreviewStep
            marketActionForm={marketActionForm}
            className={cn("mt-5 px-5")}
          />
        )}

        {/**
         * Action Button
         */}
        {actionType === MarketActionType.supply.id && (
          <SlideUpWrapper className={cn("mt-5 shrink-0 px-5 pb-5")}>
            <Button
              disabled={
                marketStep === MarketSteps.preview.id &&
                canBePerformedPartially === false
                  ? true
                  : false
              }
              onClick={async () => {
                await handleNextStep();
              }}
              size="sm"
              type="button"
              className="shrink-0"
            >
              {nextLabel()}
            </Button>
          </SlideUpWrapper>
        )}
      </div>
    );
  }
});

{
  /* <Fragment> */
}
{
  /* {viewType === MarketViewType.simple.id && (
  <div
    className={cn(
      "flex w-full flex-col items-start border-b border-divider",
      BASE_PADDING
    )}
  >
    <div className="flex w-fit max-w-full flex-row items-center font-gt text-lg font-medium text-primary">
      <div className="max-w-full grow overflow-hidden truncate text-ellipsis">
        {propsEnrichedMarket.data.title || "Unknown Market"}
      </div>

      {propsEnrichedMarket.data.title && (
        <div className="ml-2 flex h-5 w-5 shrink-0 flex-col place-content-center items-center rounded-full bg-primary">
          <CheckIcon
            strokeWidth={2.5}
            className="h-5 w-5 p-1 text-white"
          />
        </div>
      )}
    </div>
  </div>
)} */
}

// {viewType === MarketViewType.simple.id && (
//   <div
//     className={cn(
//       "flex w-full flex-row items-center justify-between border-t border-divider",
//       BASE_PADDING
//     )}
//   >
//     <div className="font-gt text-sm font-light text-secondary">
//       Advanced Mode
//     </div>
//     <Switch
//       checked={viewType === MarketViewType.advanced.id}
//       onCheckedChange={() => {
//         setViewType(
//           viewType === MarketViewType.advanced.id
//             ? MarketViewType.simple.id
//             : MarketViewType.advanced.id
//         );
//       }}
//     />
//   </div>
// )}
// </Fragment>
