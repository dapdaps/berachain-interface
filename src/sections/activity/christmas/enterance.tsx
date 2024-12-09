import { useRouter } from "next-nprogress-bar";
import { useEffect, useMemo, useState } from "react";
import BearSnow from "@public/images/home/christmas/bear-snow.svg";
import GiftBox from "@public/images/home/christmas/gift-box.svg";
import IconReload from "@public/images/home/christmas/icon-reload.svg";
import useHomepageData from "./hooks/use-homepage-data";
import clsx from "clsx";
import BoxModal from "./box-modal";
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import Big from 'big.js';
export default function Enterance({ path }: any) {
  const router = useRouter();
  const { loading, data, onQuery } = useHomepageData();
  const [openModal, setOpenModal] = useState(false);

  const remainBox = useMemo(
    () => (data?.total_box || 0) - (data?.used_box || 0),
    [data]
  );

  const handleOpen = (e: any) => {
    if (Big(remainBox || 0).lte(0)) return;
    e.stopPropagation();
    setOpenModal(true);
  };

  useEffect(() => {
    if (remainBox > 0) {
      setOpenModal(true);
    }
  }, [remainBox]);

  return (
    <>
      <div
        className="cursor-pointer absolute right-[10px] bottom-[10px] z-10 hover:scale-105 transition-transform duration-500"
        onClick={() => {
          router.push(path);
        }}
      >
        <div className="relative z-[1]">
          <BearSnow />
        </div>
        <div className="absolute left-[0px] bottom-[36px] z-[2] w-[139px] h-[58px] rounded-[29px]">
          <Popover
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.TopRight}
            offset={40}
            contentClassName="!z-[12]"
            content={Big(remainBox || 0).gt(0) && (
              <Card className="w-[173px] !p-[8px_4px_10px_16px]">
                You’ve got {remainBox} Unopened boxes, {data?.total_box} boxes in total. Click to open.
              </Card>
            )}
          >
            <div
              className="absolute left-[27px] bottom-[23px] z-[1] animate-shake"
              onClick={handleOpen}
            >
              <GiftBox />
            </div>
          </Popover>

          <div className="absolute z-[2] left-[17px] bottom-[7px] h-[30px] rounded-[15px] p-[2px] bg-white">
            <div className="w-full h-full bg-[#C8D060] rounded-[13px] border-[2px] border-black pb-[3px]">
              <div className="w-full h-full pl-[8px] bg-[#EBF479] rounded-[10px] flex items-center justify-between">
                <div className="flex items-center gap-[1px] text-[#909649] text-[14px] font-[400] font-CherryBomb leading-[90%]">
                  <div className="text-black">{remainBox}</div>
                  <div>/</div>
                  <div>{data?.total_box}</div>
                </div>
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onQuery();
                  }}
                  className="translate-y-[2.8px] translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain"
                >
                  <IconReload
                    className={clsx(
                      "origin-[12px_12px]",
                      loading && "animate-rotate"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BoxModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        remainBox={remainBox}
        onSuccess={() => {
          onQuery();
        }}
      />
    </>
  );
}
