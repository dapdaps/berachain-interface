import Modal from "@/components/modal";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';

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

  if (!msg) {
    return null
  }

  const isTransfer = !msg.isChristmas && transferItem?.pc_item && !transferItem.transfer_to;

  return (
    <>
      <div
        style={{
          left: location.x,
          top: location.y,
        }}
        onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}
        className={`absolute w-[166px] ${isTransfer ? 'h-[237px]' : 'h-[220px]'} rounded-[13px] z-20 border-[3px] border-[#C7FF6E] bg-[#00000080] backdrop-blur-[10px]`}
      >
        <div className="flex items-center justify-center w-[75px] h-[75px] text-center m-auto mt-[5px]">
          <img src={msg?.img} className="max-w-[100%] max-h-[100%]" />
        </div>
        <div className="text-[18px] text-[#F7F9EA] font-CherryBomb text-center " style={{ WebkitTextStroke: '1px #4B371F' }}>{msg.name}</div>
        <div className="text-[#fff] font-Montserrat text-[12px] px-[10px] mt-[5px] leading-[120%]">{msg.content}</div>
        <div
          onClick={() => {
            if (disabled) return;
            if (msg.btnText === 'Delegate') {
              router.push('/bgt')
            } else if (msg.btnText === 'Join') {
              router.push("/activity/christmas")
            } else {
              setModalShow(true);
            }
          }}
          className="bg-[#FFF5A9] text-[#F7F9EA] mt-[15px] font-CherryBomb border-[2px] border-[#4B371F] text-center mx-[10px] rounded-[31px] cursor-pointer h-[32px] "
        >
          <span style={{ WebkitTextStroke: '1px #4B371F' }}>
            {msg.btnText}
          </span>
        </div>
        {
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
        }
      </div>
      <Modal
        open={modalShow}
        closeIconClassName="right-[-10px] top-[-10px]"
        onClose={() => {
          setModalShow(false);
        }}
      >
        <div className=" border-[#000] rounded-[20px] bg-[#FFFDEB] p-[20px]">
        <div className="text-[20px] font-bold">Select dApp for {textMap[msg.btnText]}</div>
          <div className="flex mt-[10px] justify-center">
            {
              msg.dapps?.map(item => {
                return (
                  <Link
                    href={item.link}
                    key={item.name}
                  >
                    <div
                      onClick={() => {
                      }}
                      className="rounded-[10px] w-[134px] h-[134px] cursor-pointer flex items-center justify-center flex-col hover:bg-[#0000000F]"
                      key={item.name}
                    >
                      <img src={item.icon} className="w-[42px] h-[42px]" />
                      <div className="text-[16px] font-[600] mt-[5px]">{item.name}</div>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </Modal>
    </>
  );
}