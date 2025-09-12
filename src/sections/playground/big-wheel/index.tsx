import { numberFormatter } from "@/utils/number-formatter";
import { useRequest } from "ahooks";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import { random } from "lodash";
import { useMemo, useRef, useState } from "react";
import RedeemSpinModal from "./components/redeem-spin/modal";
import { WheelResultData, WheelUserData } from "./config";
import { get, post } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useToast from "@/hooks/use-toast";
import Big from "big.js";
import CheckInRewardModal from "@/components/check-in/reward";
import { RewardType } from "@/components/check-in/config";
import { usePlaygroundContext } from "../context";
import { SpinUserData } from "../lucky-bera/config";
import { useCoinExplosion } from "../hooks/use-coin-explosion";
import "./index.css";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import useUser from "@/hooks/use-user";

const WheelList = [
  {
    key: 1,
    code: 1,
    value: 5,
  },
  {
    key: 2,
    code: 2,
    value: 10,
  },
  {
    key: 3,
    code: 3,
    value: 30,
  },
  {
    key: 4,
    code: 4,
    value: 1,
  },
  {
    key: 5,
    code: 5,
    value: 5,
  },
  {
    key: 6,
    code: 6,
    value: 10,
  },
  {
    key: 7,
    code: 7,
    value: 30,
  },
  {
    key: 8,
    code: 8,
    value: 1,
  },
];
const WheelSpace = 360 / WheelList.length;
const WheelDeadArea = 5;
const EXPLOSION_COIN_SIZE = 100;

const getRandomWheelSpace = (index: number) => {
  const rotationStart = index * WheelSpace;
  const rotationEnd = (index + 1) * WheelSpace;
  return {
    start: rotationStart,
    end: rotationEnd,
    value: random(rotationStart + WheelDeadArea, rotationEnd - WheelDeadArea),
  };
};

const BigWheel = () => {

  const { accountWithAk, account } = useCustomAccount();
  const connectModal = useConnectModal();
  const toast = useToast();
  const {
    wheelUserData,
    setWheelUserData,
    wheelUserDataLoading,
    getWheelUserData,
    setSpinUserData,
    spinUserData,
    playAudio,
  } = usePlaygroundContext();
  const { createCoinsExplosion } = useCoinExplosion();
  const isMobile = useIsMobile();
  const { getUserInfo } = useUser();

  const [wheelRef, wheelAnimate] = useAnimate();
  const wheelRotation = useMotionValue(0);
  const wheelAnimation = useRef<any>();
  const wheelButtonRef = useRef<any>();

  const [openRedeemSpin, setOpenRedeemSpin] = useState(false);
  const [buySpinsAmount, setBuySpinsAmount] = useState("");
  const [openRewardModal, setOpenRewardModal] = useState(false);

  const WheelValues = useMemo(() => {
    const _wheelValues: any = {};
    WheelList.forEach((it) => {
      if (!_wheelValues[it.value]) {
        _wheelValues[it.value] = [it];
        return;
      }
      _wheelValues[it.value].push(it);
    });
    return _wheelValues;
  }, [WheelList]);

  const wheelRotateTo = (rotate: any, transitions: any) => {
    return new Promise((resolve) => {
      wheelAnimation.current = wheelAnimate(wheelRef.current, {
        rotate: rotate,
      }, {
        ...transitions,
        onComplete: () => {
          resolve(void 0);
        },
      });
    });
  };

  const startRewardExplosion = (params: WheelResultData) => {
    const { } = params;

    if (!wheelButtonRef.current) {
      return;
    }

    // Calculate center position for coin explosion
    const rect = wheelButtonRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 - EXPLOSION_COIN_SIZE / 2;
    const startY = rect.top + rect.height / 2 - EXPLOSION_COIN_SIZE;

    createCoinsExplosion(startX, startY, "/images/playground/lucky-bera/icon-reward/spin.svg", { size: EXPLOSION_COIN_SIZE });
  };

  const { runAsync: onSpin, loading: spinning, data: rewardData } = useRequest(async () => {
    if (!account) {
      connectModal?.openConnectModal?.();
      return;
    }
    if (Big(wheelUserData?.wheel_balance || 0).lte(0)) {
      setOpenRedeemSpin(true);
      playAudio({ type: "failed" });
      return;
    }

    playAudio({ type: "start" });
    playAudio({ type: "wheel", delay: 150 });
    wheelAnimation.current?.stop();
    wheelAnimation.current = wheelAnimate(wheelRef.current, {
      rotate: [wheelRotation.get(), wheelRotation.get() - 360 * 2],
    }, {
      duration: 0.7,
      repeat: Infinity,
      ease: "linear",
    });
    const res = await post("/api/go/game/wheel/draw");
    wheelAnimation.current?.stop();
    if (res.code !== 200) {
      toast.fail({
        title: res.message,
      });
      playAudio({ type: "wheel", action: "pause" });
      playAudio({ type: "failed" });
      return;
    }
    const { reward_spin_amount, wheel_balance } = res.data as WheelResultData;

    const currentReward = WheelValues[reward_spin_amount];

    if (!currentReward) {
      toast.fail({
        title: "No corresponding reward found",
      });
      playAudio({ type: "wheel", action: "pause" });
      playAudio({ type: "failed" });
      return;
    }

    const currentRewardIndex = random(0, currentReward.length - 1);
    const randomReward = currentReward[currentRewardIndex];

    // update wheel user data
    setWheelUserData({
      wheel_balance: wheel_balance,
    });

    const { code } = randomReward;
    const index = WheelList.findIndex((it) => it.code === code);
    const rotation = getRandomWheelSpace(index);
    // Counterclockwise rotation
    const rewardRotation = 360 - rotation.value;
    // Complete the current wheel position to a full circle
    const currentRotation = wheelRotation.get();
    const holeRotation = -(Math.ceil(Math.abs(currentRotation) / 360) * 360 + 20 * 360);
    // Then rotate to the target position
    await wheelRotateTo([currentRotation, holeRotation + rewardRotation], {
      duration: 7,
      ease: [0, 1, 0.2, 1],
    });

    playAudio({ type: "wheel", action: "pause" });
    playAudio({ type: "win" });

    // update user spin data
    setSpinUserData({
      spin_balance: Big(spinUserData?.spin_balance || 0).plus(reward_spin_amount).toNumber(),
    });

    startRewardExplosion(res.data);
    // setOpenRewardModal(true);
    // return [{
    //   type: RewardType.Spin,
    //   amount: reward_spin_amount,
    //   label: `${numberFormatter(reward_spin_amount, 0, true)} spin tickets`,
    // }];
  }, { manual: true });

  const { runAsync: onBuySpins, loading: buyingSpins } = useRequest(async () => {
    if (!account) {
      connectModal?.openConnectModal?.();
      return;
    }
    const res = await post("/api/go/game/wheel/redeem", {
      spin_times: +buySpinsAmount,
    });
    if (res.code !== 200) {
      toast.fail({
        title: res.message,
      });
      return;
    }
    getWheelUserData();
    setOpenRedeemSpin(false);
    // refresh user total points
    getUserInfo();
  }, {
    manual: true,
  });

  return (
    <div className={clsx("w-full min-h-[100dvh] flex items-end justify-center  md:pb-[22vw]", isMobile ? "" : "big-wheel-pb")}>
      <div className="relative flex flex-col items-center z-[2] w-[588px] h-[700px] md:w-[100.00vw] md:h-[119.05vw] bg-[url('/images/playground/big-wheel/bg.png')] bg-no-repeat bg-center bg-contain">
        <div className="relative w-[430px] h-[430px] md:w-[80.00vw] md:h-[80.00vw] mt-[170px] md:mt-[25vw] ml-[20px] md:ml-[3.5vw] flex justify-center items-center">
          <motion.div
            ref={wheelRef}
            className="relative will-change-transform flex justify-center items-center shrink-0 w-full h-full object-center object-contain bg-[url('/images/playground/big-wheel/wheel.png')] bg-no-repeat bg-center bg-contain"
            style={{
              rotate: wheelRotation,
            }}
          >
            {/* {
              WheelList.map((item, index) => (
                <div
                  className="absolute w-[60px] h-[215px] pt-[50px] top-0 font-[700] font-CherryBomb text-red-500 text-center text-[20px] [text-shadow:0_2px_0_#4B371F] [-webkit-text-stroke-width:1px] [-webkit-text-stroke-color:#000]"
                  key={item.key}
                  style={{
                    transformOrigin: "center 215px",
                    transform: `rotate(${index * WheelSpace + WheelSpace / 2}deg)`,
                  }}
                >
                  {item.code}-{item.value}
                </div>
              ))
            } */}
          </motion.div>
          <motion.button
            ref={wheelButtonRef}
            type="button"
            className="flex justify-center items-center shrink-0 absolute z-[2] w-[100px] h-[100px] md:w-[21.33vw] md:h-[21.33vw] bg-[url('/images/playground/big-wheel/btn-spin.png')] bg-no-repeat bg-center bg-contain"
            disabled={spinning || wheelUserDataLoading}
            onClick={onSpin}
            whileTap={!(spinning || wheelUserDataLoading) ? {
              scale: 0.9,
            } : {}}
          >
            {
              (spinning || wheelUserDataLoading) && (
                <div className="w-[98%] h-[98%] rounded-full bg-white/20 absolute z-[1] cursor-not-allowed" />
              )
            }
          </motion.button>
          <motion.img
            src="/images/playground/big-wheel/arrow.png"
            alt=""
            className="shrink-0 absolute z-[1] translate-y-[-60px] md:translate-y-[-13vw] w-[84px] h-[66px] md:w-[18.67vw] md:h-[14.67vw] object-center object-contain"
          />
        </div>
        <div className="w-[275px] h-[72px] md:w-[53.33vw] md:h-[13.96vw] pl-[21px] md:pl-[4vw] pr-[30px] md:pr-[5vw] flex justify-between items-center absolute bottom-[15px] md:bottom-[2vw] bg-[url('/images/playground/big-wheel/foot.png')] bg-no-repeat bg-center bg-contain">
          <div className="flex items-center gap-[5px]">
            <img
              src="/images/check-in/spin.png"
              alt=""
              className="w-[44px] h-[44px] md:w-[9.33vw] md:h-[9.33vw] shrink-0 object-center object-contain"
            />
            <div className="text-[26px] md:text-[5.33vw] text-white font-CherryBomb [text-shadow:0_3px_0_#4B371F] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F]">
              x{numberFormatter(wheelUserData?.wheel_balance, 2, true, { isShort: true, isShortUppercase: true })}
            </div>
          </div>
          <motion.button
            type="button"
            className="w-[36px] h-[36px] md:w-[8.00vw] md:h-[8.00vw] shrink-0 bg-[url('/images/playground/big-wheel/icon-plus.png')] bg-no-repeat bg-center bg-contain"
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => {
              setOpenRedeemSpin(true);
            }}
          />
        </div>
      </div>
      <RedeemSpinModal
        open={openRedeemSpin}
        onClose={() => {
          setOpenRedeemSpin(false);
        }}
        buySpinsAmount={buySpinsAmount}
        setBuySpinsAmount={setBuySpinsAmount}
        onBuySpins={onBuySpins}
        buyingSpins={buyingSpins}
      />
      <CheckInRewardModal
        open={openRewardModal && !!rewardData}
        onClose={() => {
          setOpenRewardModal(false);
        }}
        data={rewardData}
      />
    </div>
  );
};

export default BigWheel;
