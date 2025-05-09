import Modal from "@/components/modal";
import useUserPoints from "@/hooks/use-user-points";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import clsx from "clsx";
import DropdownSelector from "./dropdown-selector";
import PointsChart from "./history-chart";
import { useState } from "react";

const ModalPointsInfrared = ({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { loading: pointsLoading, userPoints = { points: 0 }, userHistoryPoints } = useUserPoints()
  const [timeRange, setTimeRange] = useState('Last 3 months')
  
  const onTimeRangeChange = (selected: string) => {
    setTimeRange(selected)
  }

  return (<Modal 
    open={open}
    onClose={onClose}
    isMaskClose={false}
  >
    <div className='p-[40px] w-[950px] h-[456px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)]'>
        <div className="font-CherryBomb text-[32px] leading-[90%] font-400 mb-[34px]">Infrared Points</div>
        <div className="w-full flex justify-between">
        <div className={clsx("flex md:justify-between gap-[60px] text-black font-Montserrat md:text-[14px] text-[16px] font-medium leading-[100%] md:w-full md:text-white md:p-[11px_20px_13px] md:rounded-[10px] md:bg-black/50")}>
            <div className="flex flex-col gap-[8px]">
            <span className="font-Montserrat text-[14px] text-[#3D405A] font-[500]">Points</span>
            <div className="flex items-center gap-1">
                <img src="/db3/dapp/infrared.png" className="w-6 h-6 rounded-full" alt="" />
                <span className="leading-[40px] md:leading-[100%] font-[700]">{Big(userPoints?.points ?? 0).toFixed(0)}</span>
            </div>
            </div>
            <div className="flex flex-col gap-[8px]">
            <span className="font-Montserrat text-[14px] text-[#3D405A] font-[500]">24hr change</span>
            <div className="flex items-center gap-1 text-[#00830b]">
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.13397 0.5C5.51887 -0.166667 6.48113 -0.166667 6.86603 0.5L11.1962 8C11.5811 8.66667 11.0999 9.5 10.3301 9.5H1.66987C0.900073 9.5 0.418948 8.66667 0.803848 8L5.13397 0.5Z" fill="#7EA82B"/>
                </svg>
                <span className="leading-[40px] md:leading-[100%] font-[700]">{numberFormatter(Big(userPoints?.change_24h_percent ?? 0).times(100).toFixed(), 2, true,)}%</span>
            </div>
            </div>
            <div className="flex flex-col gap-[8px]">
            <span className="font-Montserrat text-[14px] text-[#3D405A] font-[500]">Rank</span>
            <span className="leading-[40px] md:leading-[100%] font-[700]">{userPoints?.rank}</span>
            </div>
        </div>
        <div className="flex items-center">
          <DropdownSelector onSelect={onTimeRangeChange} defaultValue="Last 3 months" />
        </div>
        </div>
        {
          userHistoryPoints && userHistoryPoints?.length > 0 && (
            <PointsChart timeRange={timeRange} history={userHistoryPoints}></PointsChart>
          ) 
        }
    </div>
  </Modal>)
}

export default ModalPointsInfrared;
