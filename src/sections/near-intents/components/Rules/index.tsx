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
      <Card className="w-[585px] p-[24px_22px_34px]">
        <div className="text-black font-CherryBomb text-[26px] mb-[10px]">Bintent Trading Campaign</div>

        <div className="flex flex-col gap-[10px]">
          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">Duration: April 3 - April 17</div>
          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">How to Participate?</div>

          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">1.</span>Visit the Beratown campaign and access Bintent.</div>
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">2.</span>Trade in Bintent’s Trading Challenge mode.</div>
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">3.</span>Only trades using BERA are counted.</div>
            <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">4.</span>Complete tasks, climb the leaderboard, and earn rewards.</div>
          </div>

          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">Rewards?</div>
          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Top 10 by volume share $5,000 in NEAR.</div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Top 50 by transaction count get a Beraciaga NFT whitelist spot.</div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Complete 25 trades ($50+ each) to earn 1 BERA  and complete 5 trades  ($20+ each) to earn 0.2 BERA (Total pool: $5,000 BERA, first come, first served).</div>
          </div>

          <div className="text-black font-CherryBomb text-[16px] leading-[90%]">Bonus Incentives?</div>
          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Early Bird Trader(April 3): +$10 leaderboard boost.</div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Daily Challenges: Trade 3 pairs (+$5), trade in the first hour (+$10), or execute 5 trades at a better price than Shogun(+$5).</div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Trading Streaks: 5 days = 1.2x volume, 10 days = 1.5x volume.</div>
            <div className="flex gap-[6px]"><span className="mt-[6px] min-w-[8px] w-[8px] h-[8px] rounded-full bg-black" />Degen Trading Night (April 9): 24-hour 2x volume multiplier.</div>
          </div>

          <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">Join now and trade your way to the top!</div>
        </div>
      </Card>
    </Modal>
  )
})
