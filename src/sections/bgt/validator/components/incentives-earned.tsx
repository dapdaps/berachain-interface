import useCustomAccount from "@/hooks/use-account"
import { get } from "@/utils/http"
import { memo, useEffect, useState } from "react"

export default memo(function IncentivesEarned() {

  const { account } = useCustomAccount()
  const [incentives, setIncentives] = useState()
  async function getIncentives() {
    const result = await get(
      "/api.hub.berachain/api/portfolio/incentives/?account=" + account,
      null,
      {
        isSkipFormatUrl: true
      })

    console.log("====result", result)
  }

  useEffect(() => {
    account && getIncentives()
  }, [account])
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">Incentives Earned</span>
        <span className="text-[#3D405A]">$0.01</span>
      </div>
    </div>

  )
})
