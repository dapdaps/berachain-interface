import Card from "@/components/card";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import useCustomAccount from "@/hooks/use-account";
import { useHall } from "@/stores/hall";
import { numberFormatter } from "@/utils/number-formatter";
import { useDebounceFn } from "ahooks";
import Big from "big.js";
import clsx from "clsx";
import { ethers } from "ethers";
import { memo, useMemo, useState } from "react";
import { useIncentivesContext } from "@/sections/bgt/validator/content/incentives";


export default memo(function IncentivesModal() {
  const {
    page,
    max_page,
    pageData,
    showModal,
    page_incentives,
    usd_total_unclaimed,
    claimLoading,
    onClose,
    onClaim,
    onChangePage
  } = useIncentivesContext()
  return (
    <Modal open={showModal} onClose={onClose}>
      <Card>
        <div className="w-[500px] flex flex-col items-center">
          <div>Claim Incentives</div>
          <div>You have multiple incentives periods to be claimed</div>
          <div className="mb-3 flex w-full items-center justify-between rounded-md border border-border px-4 py-2">
            <button
              onClick={() => onChangePage("prev")}
              className={clsx("cursor-pointer inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background bg-transparent border hover:bg-secondary text-md font-semibold leading-7 rounded-sm border-border p-1 text-foreground", page === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <span>{page + 1} of {max_page + 1}</span>
            <button
              disabled={page === max_page}
              onClick={() => onChangePage("next")}
              className={clsx("cursor-pointer inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background bg-transparent border hover:bg-secondary text-md font-semibold leading-7 rounded-sm border-border p-1 text-foreground", page === max_page ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
          <div className="w-full grid grid-cols-1 rounded-md border border-border">
            <div className="flex flex-col items-center border-b border-border py-4">
              <div className="mb-3 w-8 rounded-full overflow-hidden">
                <img src={pageData?.metadata?.logoURI} alt={pageData?.metadata?.name} />
              </div>
              <div className="cursor-pointer truncate font-semibold hover:underline">{pageData?.metadata?.name}</div>
              <div className="text-xs text-muted-foreground">Current</div>
              <div className="relative text-nowrap mt-2 text-lg font-semibold">{numberFormatter(usd_total_unclaimed, 2, true, { isShort: true, prefix: '$' })}</div>
            </div>
            <div className="w-full overflow-hidden rounded-b-md">
              <div className="flex max-h-[140px] flex-col items-center gap-2 overflow-y-auto py-4 font-medium">
                {
                  page_incentives?.map(incentive => (
                    <div className="flex w-full justify-between px-4" key={`${incentive?.symbol}|${page}`}>
                      <div className="flex items-center gap-[8px]">
                        {
                          incentive?.icon ? (
                            <div className="w-[24px] rounded-full overflow-hidden">
                              <img src={incentive?.icon} alt={incentive?.symbol} />
                            </div>
                          ) : (
                            <div className="w-[24px] h-[24px] rounded-full overflow-hidden flex items-center justify-center bg-black/50  text-[8px] text-white">{incentive?.symbol?.slice(0, 3)}</div>
                          )
                        }
                        <span>{incentive?.symbol}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{numberFormatter(incentive?.total_unclaimed ?? 0, 2, true, { isShort: true })} {incentive?.symbol}</span>
                        <span>({numberFormatter(incentive?.usd_total_unclaimed, 2, true, { isShort: true, prefix: "$" })})</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled={claimLoading}
            className="mt-3 w-full flex justify-center items-center gap-[10px] disabled:opacity-30 disabled:!cursor-not-allowed h-[50px] rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[16px] font-semibold leading-normal"
            onClick={onClaim}
          >
            {claimLoading && <Loading size={16} />}
            Claim Period ({page + 1}/{max_page + 1})
          </button>
        </div>
      </Card>
    </Modal>
  )
})
