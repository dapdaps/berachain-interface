import Loading from "@/components/loading";
import { useIncentivesContext } from "@/sections/bgt/validator/content/incentives";
import { useHall } from "@/stores/hall";
import { numberFormatter } from "@/utils/number-formatter";
import { memo } from "react";
import IncentivesModal from "./incentives-modal";
import Skeleton from "react-loading-skeleton";

export default memo(function IncentivesEarned() {
  const {
    PAGE_SIZE,
    incentives,
    usd_total_unclaimed,
    claimLoading,
    incentivesLoading,
    setShowModal,
    onClaim,
    handleGetIncentives
  } = useIncentivesContext()
  const store = useHall()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">Incentives Earned</span>
        <span className="text-[#3D405A]">{numberFormatter(usd_total_unclaimed, 2, true, { isShort: true, prefix: '$' })}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2">
          {
            incentivesLoading ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <Skeleton width={24} />
                  <Skeleton width={32} />
                </div>
                <Skeleton width={48} />
              </div>
            ) : incentives?.map(incentive => {
              return (
                <div className="flex items-center justify-between">
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
              )
            })
          }
        </div>
        {
          !incentivesLoading && incentives?.length > 0 && (
            <button
              type="button"
              disabled={claimLoading}
              className="w-full flex justify-center items-center gap-[10px] disabled:opacity-30 disabled:!cursor-not-allowed h-[50px] rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[16px] font-semibold leading-normal"
              onClick={() => {
                if (store?.proofs?.length > PAGE_SIZE) {
                  setShowModal(true)
                } else {
                  onClaim?.()
                }
              }}
            >
              {claimLoading && <Loading size={16} />}
              Claim
            </button>
          )
        }
      </div>
      <IncentivesModal />
    </div>

  )
})
