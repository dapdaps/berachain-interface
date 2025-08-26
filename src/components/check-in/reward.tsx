import clsx from "clsx";
import Modal from "../modal";
import { motion } from "framer-motion";
import { RewardType } from "./config";

const CheckInReward = (props: any) => {
  const { open, onClose, data } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[-14px] !top-[-8px]"
    >
      <div
        className={clsx(
          "w-[340px] pb-[24px] min-h-[400px] bg-[url('/images/check-in/open-light.png')] bg-no-repeat bg-top bg-contain relative shrink-0 rounded-[16px] border-[2px] border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black text-center font-Montserrat text-[16px] font-medium leading-[120%]"
        )}
      >
        <div className="absolute flex justify-center items-center left-1/2 -translate-x-1/2 top-[-104px] w-[255px] h-[242px] bg-[url('/images/check-in/box-open.png')] bg-no-repeat bg-center bg-contain">
          {
            data?.map((item: any, index: number) => {
              if (item.type === RewardType.Gem) {
                return (
                  <img
                    src="/images/check-in/gem.png"
                    alt=""
                    className={clsx("w-[60px] h-[70px] object-center object-contain shrink-0", data.length > 1 ? "rotate-[10deg]" : "")}
                  />
                );
              }
              if (item.type === RewardType.Spin && data.length === 1) {
                return (
                  <img
                    src="/images/check-in/lucky777.png"
                    alt=""
                    className="w-[117px] h-[88px] object-center object-contain shrink-0 translate-y-[-10px]"
                  />
                );
              }
              if (item.type === RewardType.Spin) {
                return (
                  <img
                    src="/images/check-in/spin.png"
                    alt=""
                    className="w-[82px] h-[84px] object-center object-contain shrink-0"
                  />
                );
              }
            })
          }
          <motion.img
            src="/images/check-in/stars.png"
            alt=""
            className="absolute z-[1] w-[158px] h-[102px] object-center object-contain shrink-0 translate-y-[-20px]"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
        <div className="font-CherryBomb text-[26px] font-[400] leading-[90%] text-center mt-[177px]">
          Good Luck!
        </div>
        <div className="text-center mt-[20px]">
          You’ve got
        </div>
        <div className="mt-[9px] flex flex-col items-center gap-[10px] text-[20px] font-[700] leading-[120%] text-center">
          {
            data?.map((item: any, index: number) => (
              <div key={index} className="">
                {item.label}
              </div>
            ))
          }
        </div>
        <div className="mt-[20px] flex justify-center items-center px-[25px] flex-col gap-[24px]">
          {
            data?.length === 1 ? (
              <>
                <button
                  type="button"
                  className="w-full h-[50px] shrink-0 rounded-[10px] border border-black bg-[#FFDC50] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black text-center font-Montserrat text-[16px] font-bold leading-[150%]"
                >
                  {data[0].type === RewardType.Spin ? "Play Lucky 777" : "Check all Lootboxes"}
                </button>
                {data[0].type === RewardType.Spin && (
                  <button
                    type="button"
                    className="w-full shrink-0 rounded-[10px text-black text-center font-Montserrat text-[16px] font-bold leading-[150%]"
                  >
                    Check all Lootboxes
                  </button>
                )
                }
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="w-full h-[50px] shrink-0 rounded-[10px] border border-black bg-[#FFDC50] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black text-center font-Montserrat text-[16px] font-bold leading-[150%]"
                >
                  Play Lucky 777
                </button>
                <button
                  type="button"
                  className="w-full shrink-0 rounded-[10px text-black text-center font-Montserrat text-[16px] font-bold leading-[150%]"
                >
                  Check all Lootboxes
                </button>
              </>
            )
          }
        </div>
      </div>
    </Modal>
  );
};

export default CheckInReward;
