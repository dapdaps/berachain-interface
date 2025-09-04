import clsx from "clsx";
import Modal from "../modal";
import { motion } from "framer-motion";
import { RewardType } from "./config";
import { useRouter } from "next/navigation";
import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";

const CheckInReward = (props: any) => {
  const { open, onClose, data } = props;

  const router = useRouter();
  const { setTreasureBookOpen } = useLootboxSeasonStore();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[-14px] !top-[-8px]"
    >
      <div
        className={clsx(
          "w-[340px] pb-[24px] min-h-[400px] relative shrink-0 rounded-[16px] border-[2px] border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black text-center font-Montserrat text-[16px] font-medium leading-[120%]"
        )}
      >
        <div className="w-full h-[400px] overflow-hidden absolute z-[1] rounded-[16px] left-0 top-0 flex justify-center items-start">
          <motion.img
            src="/images/guiding-tour/lootbox-season/light-full@2x.png"
            alt=""
            className="object-center object-contain w-[528px] h-[554px] min-w-[528px] min-h-[554px] mt-[-180px] opacity-80"
            animate={{
              transform: ["rotate(0deg)", "rotate(360deg)"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        <div className="absolute z-[2] flex justify-center items-center left-1/2 -translate-x-1/2 top-[-104px] w-[255px] h-[242px] bg-[url('/images/check-in/box-open.png')] bg-no-repeat bg-center bg-contain">
          <motion.div
            className="flex justify-center items-center"
            initial={{
              y: 50,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.5,
            }}
          >
            {
              data?.map((item: any, index: number) => {
                if (item.type === RewardType.Gem) {
                  return (
                    <motion.img
                      src="/images/check-in/gem.png"
                      alt=""
                      className={clsx(
                        "w-[60px] h-[70px] object-center object-contain shrink-0",
                        data.length > 1 ? "rotate-[10deg]" : "",
                        (data.length > 1 && index > 0) && "translate-x-[-20px]",
                        (data.length > 1 && index === 0) && "translate-y-[-10px]",
                      )}
                      animate={{
                        transform: [`translateY(0px)`, `translateY(-10px)`, `translateY(0)`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  );
                }
                if (item.type === RewardType.Spin) {
                  return (
                    <motion.img
                      src="/images/playground/lucky-bera/ticket-spin.png"
                      alt=""
                      className={clsx(
                        "w-[99px] h-[81px] object-center object-contain shrink-0",
                        (data.length > 1 && index > 0) && "translate-x-[-20px]",
                        (data.length > 1 && index === 0) && "translate-y-[-10px]",
                      )}
                      animate={{
                        transform: [`translateY(0px)`, `translateY(-10px)`, `translateY(0)`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  );
                }
                if (item.type === RewardType.Box) {
                  return (
                    <motion.img
                      src="/images/check-in/box.png"
                      alt=""
                      className={clsx(
                        "w-[80px] h-[68px] object-center object-contain shrink-0",
                        (data.length > 1 && index > 0) && "translate-x-[-20px]",
                        (data.length > 1 && index === 0) && "translate-y-[-10px]",
                      )}
                      animate={{
                        transform: [`translateY(0px)`, `translateY(-10px)`, `translateY(0)`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  );
                }

                if (item.type === RewardType.Cosmetic) {
                  return (
                    <motion.img
                      src={item.cosmetic}
                      alt=""
                      className={clsx(
                        "w-[80px] h-[68px] object-center object-contain shrink-0",
                        (data.length > 1 && index > 0) && "translate-x-[-20px]",
                        (data.length > 1 && index === 0) && "translate-y-[-10px]",
                      )}
                      animate={{
                        transform: [`translateY(0px)`, `translateY(-10px)`, `translateY(0)`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  );
                }
              })
            }
          </motion.div>
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
        <div className="w-full relative z-[2]">
          <div className="font-CherryBomb text-[26px] font-[400] leading-[90%] text-center mt-[177px]">
            Henlo!
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
                  <RewardButton
                    type="primary"
                    onClick={() => {
                      if (data[0].type === RewardType.Spin) {
                        router.push("/carnival/lucky-bera?from=check-in");
                        return;
                      }
                      onClose();
                      setTreasureBookOpen(true);
                    }}
                  >
                    {data[0].type === RewardType.Spin ? "Play Lucky 777" : "Check all Lootboxes"}
                  </RewardButton>
                  {
                    data[0].type === RewardType.Spin && (
                      <RewardButton
                        onClick={() => {
                          onClose();
                          setTreasureBookOpen(true);
                        }}
                      >
                        Check all Lootboxes
                      </RewardButton>
                    )
                  }
                </>
              ) : (
                <>
                  <RewardButton
                    type="primary"
                    onClick={() => {
                      router.push("/carnival/lucky-bera?from=check-in");
                    }}
                  >
                    Play Lucky 777
                  </RewardButton>
                  <RewardButton
                    onClick={() => {
                      onClose();
                      setTreasureBookOpen(true);
                    }}
                  >
                    Check all Lootboxes
                  </RewardButton>
                </>
              )
            }
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CheckInReward;

const RewardButton = (props: any) => {
  const { type, children, htmlType = "button", ...restProps } = props;

  if (type === "primary") {
    return (
      <button
        type={htmlType}
        className="w-full h-[50px] hover:translate-y-[2px] hover:shadow-[6px_4px_0_0_rgba(0,0,0,0.25)] transition-all duration-150 shrink-0 rounded-[10px] border border-black bg-[#FFDC50] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black text-center font-Montserrat text-[16px] font-bold leading-[150%]"
        {...restProps}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={htmlType}
      className="hover:opacity-80 transition-all duration-150 w-full shrink-0 rounded-[10px text-black text-center font-Montserrat text-[16px] font-bold leading-[150%]"
      {...restProps}
    >
      {children}
    </button>
  );
};
