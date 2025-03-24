import Empty from "@/components/empty"
import FlexTable from "@/components/flex-table"
import SwitchTabs from "@/components/switch-tabs"
import useCustomAccount from "@/hooks/use-account"
import { numberFormatter } from "@/utils/number-formatter"
import { formatLongText } from "@/utils/utils"
import { memo, useState } from "react"
import useRanks from "../hooks/use-ranks"
import useYourRank from "../hooks/use-your-rank"

export default memo(function Leaderboard() {
  const { account } = useCustomAccount()
  const [currentTab, setCurrentTab] = useState("volume")
  const { ranks, loading: loadingRanks } = useRanks(currentTab)
  const { yourRank, loading: loadingYourRank } = useYourRank(currentTab)

  const COLUMNS = [{
    title: 'ranking',
    dataIndex: 'ranking',
    align: 'left',
    width: '10%',
    render: (text, record, index) => {
      return (
        <div className="flex items-center justify-center w-[26px] h-[26px] bg-center bg-no-repeat" style={{ backgroundImage: index < 3 ? "url('/images/campaign/star_" + (index + 1) + ".svg')" : "" }}>
          <div className="text-black font-Montserrat font-semibold">{index + 1}</div>
        </div>
      )
    }
  }, {
    title: 'address',
    dataIndex: 'address',
    align: 'left',
    width: '75%',
    render: (text, record, index) => {
      return (
        <div className="text-black font-Montserrat font-medium">{formatLongText(record?.address, 5, 5)}</div>
      )
    }
  }, , {
    title: 'volume',
    dataIndex: 'volume',
    align: 'right',
    width: '15%',
    render: (text, record, index) => {
      return (
        <div>{numberFormatter(record?.[currentTab], 2, true, { isShort: true, prefix: currentTab === "volume" ? "$" : "" })}</div>
      )
    }
  },]

  return (
    <div className="m-[0_auto_39px] relative w-[720px] h-[732px] p-[12px] border-[2px] border-[#7F6C41] rounded-[10px] bg-[linear-gradient(180deg,_#D4A20C_0%,_#FFCC34_100%)]">
      <div className="absolute left-1/2 -top-[39px] -translate-x-1/2 w-[379px] h-[77px] bg-[url('/images/campaign/task_board_bg.svg')] bg-no-repeat bg-center flex items-center justify-center text-[#F7F9EA] text-stroke-2 font-CherryBomb text-[32px] uppercase">
        Leaderboard
      </div>
      <div className="h-full p-[50px_16px_16px] rounded-[10px] border-[2px] border-[#E5C375] bg-[#FFF1C7]">
        <SwitchTabs
          tabs={[
            { label: "Volume Rank", value: "volume" },
            { label: "Trades Rank", value: "transactions" }
          ]}
          onChange={(val) => {
            setCurrentTab(val)
          }}
          current={currentTab}
          className="mx-auto w-[665px]"
        />
        <div className="m-[20px_0_85px] min-h-[400px]">
          <FlexTable
            loading={loadingRanks}
            columns={COLUMNS}
            showHeader={false}
            list={ranks}
            bodyClass={"rounded-[2px] py-0 h-[40px] flex flex-col justify-center"}
            renderEmpty={() => (
              <div className='mt-[50px] w-full flex justify-center items-center'>
                <Empty desc='No asset found' />
              </div>
            )}
          />
        </div>
        <div className="relative h-[80px] rounded-[12px] bg-[#FFDC50] border border-black p-[23px_17px_18px]">
          {
            yourRank?.away_top_volume && (
              <div className="absolute left-1/2 -top-[44px] -translate-x-1/2 w-[520px] h-[54px] bg-[url('/images/campaign/ribbon.svg')] bg-center bg-no-repeat">
                <div className="p-[12px_44px_0] flex items-center justify-center gap-[17px]">
                  <span className="text-black text-[14px] font-Montserrat font-bold whitespace-nowrap">You're only {numberFormatter(yourRank?.away_top_volume ?? 0, 2, true, { isShort: true })} in PnL away from a top 10 spot.</span>
                </div>
              </div>
            )
          }
          <div className="text-black font-Montserrat text-[16px] font-semibold ">Your Rank</div>
          <div className="flex items-center gap-[13px]">
            <div className="text-black font-Montserrat text-[14px] font-semibold">{yourRank?.rank_volume}</div>
            <div className="text-black font-Montserrat text-[14px] font-medium">{formatLongText(account, 5, 5)}</div>
          </div>
          <div className="absolute right-[16px] bottom-[24px] text-black font-Montserrat text-[14px] font-medium">{numberFormatter(yourRank?.[currentTab], 2, true, { isShort: true, prefix: "$" })}</div>
        </div>
      </div>
    </div>
  )
})
