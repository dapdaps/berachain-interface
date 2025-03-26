import Empty from "@/components/empty"
import FlexTable from "@/components/flex-table"
import Modal from "@/components/modal"
import SwitchTabs from "@/components/switch-tabs"
import useCustomAccount from "@/hooks/use-account"
import useRanks from "@/sections/bintent-trading-challenge/hooks/use-ranks"
import useYourRank from "@/sections/bintent-trading-challenge/hooks/use-your-rank"
import { useBintent } from "@/stores/bintent"
import { numberFormatter } from "@/utils/number-formatter"
import { formatLongText } from "@/utils/utils"
import { memo, useEffect, useState } from "react"

export default memo(function Rank() {
  const store = useBintent()
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
    width: '70%',
    render: (text, record, index) => {
      return (
        <div className="text-black font-Montserrat font-medium">{formatLongText(record?.address, 5, 5)}</div>
      )
    }
  }, , {
    title: 'volume',
    dataIndex: 'volume',
    align: 'right',
    width: '20%',
    render: (text, record, index) => {
      return (
        <div>{numberFormatter(record?.[currentTab], 2, true, { isShort: true, prefix: currentTab === "volume" ? "$" : "" })}</div>
      )
    }
  },]
  

  useEffect(() => {
    setCurrentTab(store?.showRankModal ? "volume" : "")
  }, [store?.showRankModal])

  return (
    <Modal
      open={store?.showRankModal}
      onClose={() => {
        store.set({
          showRankModal: false
        })
      }}
    >
      <div className="w-[520px] h-[668px] border border-black bg-[#FFFDEB] rounded-[20px] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)]">
        <div className="p-[27px_0_23px_28px] text-black font-Montserrat text-[20px] font-bold leading-[90%]">Rank</div>
        <SwitchTabs
          tabs={[
            { label: "Volume Rank", value: "volume" },
            { label: "Trades Rank", value: "transactions" }
          ]}
          onChange={(val) => {
            setCurrentTab(val)
          }}
          current={currentTab}
          className="mx-auto w-[480px]"
        />
        <div className="mt-[20px]">
          <FlexTable
            loading={loadingRanks}
            columns={COLUMNS}
            showHeader={false}
            list={ranks}
            bodyClass={"rounded-[2px] !p-[0_8px] h-[40px] flex flex-col justify-center"}
            renderEmpty={() => (
              <div className='mt-[50px] w-full flex justify-center items-center'>
                <Empty desc='No asset found' />
              </div>
            )}
          />
          <div className="absolute left-0 right-0 bottom-0 h-[80px] rounded-[0_0_12px_12px] bg-[#FFDC50] border-t border-black p-[23px_17px_18px]">
            <div className="text-black font-Montserrat text-[16px] font-semibold ">Your Rank</div>
            <div className="flex items-center gap-[13px]">
              <div className="text-black font-Montserrat text-[14px] font-semibold">{yourRank?.rank_volume}</div>
              <div className="text-black font-Montserrat text-[14px] font-medium">{formatLongText(account, 5, 5)}</div>
            </div>
            <div className="absolute right-[16px] bottom-[24px] text-black font-Montserrat text-[14px] font-medium">{numberFormatter(yourRank?.[currentTab], 2, true, { isShort: true, prefix: currentTab === "volume" ? "$" : "" })}</div>
          </div>
        </div>
      </div>
    </Modal>
  )
})
