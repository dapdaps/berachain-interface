import Card from '@/components/card';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import useIsMobile from "@/hooks/use-isMobile";
import BearSnow from "@public/images/home/christmas/bear-snow.svg";
import GiftBox from "@public/images/home/christmas/gift-box.svg";
import IconReload from "@public/images/home/christmas/icon-reload.svg";
import Big from 'big.js';
import clsx from "clsx";
import { useRouter } from "next-nprogress-bar";
import { useContext, useEffect, useMemo, useState } from 'react';
import BoxModal from "./box-modal";
import useHomepageData from "./hooks/use-homepage-data";
import { SceneContext } from '@/context/scene';
import Countdown from '@/sections/activity/christmas/components/countdown';

export default function Enterance({ path }: any) {
  const router = useRouter();
  const { loading, data, onQuery } = useHomepageData();
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useIsMobile();
  const { currentSceneInfoValid } = useContext(SceneContext);

  const remainBox = useMemo(
    () => (data?.total_box || 0) - (data?.used_box || 0),
    [data]
  );

  const handleOpen = (e: any) => {
    if (Big(remainBox || 0).lte(0) || !currentSceneInfoValid) return;
    e.stopPropagation();
    setOpenModal(true);
  };

  useEffect(() => {
    if (remainBox > 0 && currentSceneInfoValid) {
      setOpenModal(true);
    }
  }, [remainBox]);

  return (
    <>
      {
        !isMobile && (
          <div
            className="cursor-pointer absolute right-[10px] bottom-[10px] z-10 hover:scale-105 transition-transform duration-500"
            onClick={() => {
              router.push(path);
            }}
          >
            <div className="relative z-[1]">
              <BearSnow />
              <Countdown />
            </div>
            <div className="absolute left-[0px] bottom-[36px] z-[2] w-[139px] h-[58px] rounded-[29px]">
              <Popover
                trigger={PopoverTrigger.Hover}
                placement={PopoverPlacement.TopRight}
                offset={40}
                contentClassName="!z-[12]"
                content={Big(remainBox || 0).gt(0) && (
                  <Card className="w-[173px] !p-[8px_4px_10px_16px]">
                    {
                      currentSceneInfoValid ?
                        `You’ve got ${remainBox} Unopened boxes, ${data?.total_box} boxes in total. Click to open.` :
                        `Campaign Ended`
                    }
                  </Card>
                )}
              >
                <div
                  className={`absolute left-[27px] bottom-[23px] z-[1] ${currentSceneInfoValid ? 'animate-shake' : ''}`}
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
                      className="translate-y-[2.8px] translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain disabled:opacity-30 disabled:!cursor-not-allowed"
                      disabled={!currentSceneInfoValid}
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
        )
      }
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
