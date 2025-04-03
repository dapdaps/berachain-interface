import Card from "@/components/card"
import Modal from "@/components/modal"
import { useBintent } from "@/stores/bintent"
import clsx from "clsx"
import { memo, useState } from "react"

export default memo(function Rules() {
  const store = useBintent()
  return (
    <Modal
      open={store.showRulesModal}
      onClose={() => {
        store.set({
          showRulesModal: false
        })
      }}
    >
      <Card className="md:w-full w-[585px] p-[24px_22px_34px]">
        <div className="text-black font-CherryBomb text-[26px] mb-[10px]">Bound for Berachain</div>

        <div className="flex flex-col gap-[10px]">
          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">Duration: April 3 - April 17</div>
          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">How to Participate</div>

          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">1.</span>Visit the Beratown campaign and access Bintent.</div>
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">2.</span>Trade in Bintent’s Trading Challenge mode.</div>
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">3.</span>Only trades using BERA are counted.</div>
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">4.</span>Complete tasks, climb the leaderboard, and earn rewards.</div>
          </div>

          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">Rewards</div>
          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Top 10 by volume share $5,000 in NEAR.</div>
            <div className="pl-[6px]">
              <div>- 1st Trader: $2,500</div>
              <div>- 2nd Trader: $1,250</div>
              <div>- 3rd Trader: $750</div>
              <div>- 4th - 10th Trader: $100 each.</div>
            </div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Top 50 by transaction count get a Beraciaga NFT whitelist spot.</div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Complete 25 trades ($50+ each) to earn 1 BERA  and complete 5 trades  ($20+ each) to earn 0.2 BERA (Total pool: $5,000 BERA, first come, first served).</div>
          </div>


          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">Join now and trade your way to the top!</div>
        </div>
      </Card>
    </Modal>
  )
})
