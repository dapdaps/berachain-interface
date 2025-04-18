import Modal from "@/components/modal";
import useClickTracking from '@/hooks/use-click-tracking';
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';
import clsx from "clsx";
import { differenceInSeconds } from 'date-fns';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import DappsModal from "./components/DappsModal";
interface Props {
  location: { x: number, y: number },
  link?: string;
  msg: {
    img: string;
    name: string;
    content: string;
    link: string;
    btnText: string;
    dapps: Array<{
      icon: string,
      name: string,
      link: string
    }>;
    isChristmas?: boolean;
  }
  disabled?: boolean;
  transferItem?: any;
}

const textMap: any = {
  'Bridge': 'Bridging',
  'Swap': 'Swapping',
  'Delegate': 'Delegating',
  'Lending': 'Lending'
}

export default function Tips({ location, msg, transferItem, disabled }: Props) {
  const [modalShow, setModalShow] = useState(false)
  const router = useRouter()
  const { setTransferItemsVisible } = useTransferItemsStore();
  const { handleReport, handleReportWithoutDebounce } = useClickTracking();

  if (!msg) {
    return null
  }
  const isTransfer = false //!msg.isChristmas && transferItem?.pc_item && !transferItem.transfer_to;

  function getTimeRemaining(startDate, endDate) {
    const totalSeconds = Math.max(differenceInSeconds(endDate, startDate), 0); // 确保非负
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const pad = (num) => num.toString().padStart(2, '0');
    return `Starts in ${days > 0 ? days + "d " : ""}${pad(hours)}h`;
  };
  function doReport(value: string) {
    switch (value) {
      case "Swap":
        handleReportWithoutDebounce("1024-022")
        break;
      case "Liquidty":
        handleReportWithoutDebounce("1024-024")
        break;
      case "Bridge or bintent":
        handleReportWithoutDebounce("1024-025")
        break;
      case "Lending":
        handleReportWithoutDebounce("1024-023")
        break;
      case "Stake in Vaults":
        handleReportWithoutDebounce("1024-026")
        break;
      default:
        break;
    }
  }
  return (
    <>
      <div
        style={{
          left: location.x,
          top: location.y,
        }}
        onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}
        className="absolute w-[166px] min-h-[180px] pb-[17px] rounded-[13px] z-20 border-[3px] border-[#C7FF6E] bg-[#00000080] backdrop-blur-[10px]"
      >
        <div className="flex items-center justify-center w-[75px] h-[75px] text-center m-auto mt-[5px]">
          <img src={msg?.img} className="max-w-[100%] max-h-[100%]" />
        </div>
        <div className="text-[18px] text-[#F7F9EA] font-CherryBomb text-center " style={{ WebkitTextStroke: '1px #4B371F' }}>{msg.name}</div>
        {
          Date.now() > transferItem?.start_time * 1000 && (
            <div className="text-[#fff] font-Montserrat text-[12px] px-[10px] mt-[5px] leading-[120%]">{msg.content}</div>
          )
        }

        {
          Date.now() < transferItem?.start_time * 1000 ? (
            <div className="flex items-center justify-center rounded-[31px] h-[32px] px-[5px] mx-[10px] bg-white border-[2px] border-[#4B371F] text-[#F7F9EA] mt-[15px] font-CherryBomb text-stroke-1-4b371f">{getTimeRemaining(Date.now(), transferItem?.start_time * 1000)}</div>
          ) : (

            <div
              style={{
                opacity: msg.btnText === 'Delegate' ? 0.3 : 1,
                cursor: msg.btnText === 'Delegate' ? 'default' : 'pointer'
              }}
              onClick={() => {
                if (disabled) return;
                doReport(msg.btnText)
                if (msg.btnText === 'Join') {
                  router.push("/activity/christmas")
                } else if (msg.dapps && msg?.dapps?.length > 0) {
                  setModalShow(true);
                } else {
                  router.push(msg.link);
                }
              }}
              className={clsx("bg-[#FFF5A9] text-[#F7F9EA] mt-[15px] font-CherryBomb border-[2px] border-[#4B371F] text-center mx-[10px] rounded-[31px] h-[32px] text-stroke-1-4b371f", msg.btnText === 'Delegate' ? 'cursor-default' : 'cursor-pointer')}
            >
              {msg.btnText}
            </div>
          )
        }

        {/* {
          isTransfer && (
            <button
              type="button"
              className="w-full underline decoration-solid whitespace-nowrap text-[12px] text-center text-white font-[400] mt-[11px]"
              onClick={() => {
                setTransferItemsVisible(true);
              }}
            >
              Transfer to <strong className="font-[700]">Beraciaga</strong>
            </button>
          )
        } */}
      </div >
      <DappsModal
        open={modalShow}
        onClose={() => {
          setModalShow(false);
        }}
        dapps={msg.dapps}
        text={msg.btnText}
      />
    </>
  );
}