import { motion } from "framer-motion";
import LootboxSeasonTitle from "../../components/title";
import LootboxSeasonButton from "../../components/button";
import { useMemo } from "react";
import { Reward, RewardType } from "@/components/check-in/config";
import { numberFormatter } from "@/utils/number-formatter";

const LootboxSeasonGems = (props: any) => {
  const { onNext, data } = props;

  const { reward_spin_amount, reward_gem_amount } = data ?? {};

  const rewards = useMemo(() => {
    const _rewards: Reward[] = [];
    if (reward_gem_amount) {
      _rewards.push({
        type: RewardType.Gem,
        amount: reward_gem_amount,
        label: `You’ve received ${numberFormatter(reward_gem_amount, 0, true)} points`,
      });
    }
    if (reward_spin_amount) {
      _rewards.push({
        type: RewardType.Spin,
        amount: reward_spin_amount,
        label: `You’ve received ${numberFormatter(reward_spin_amount, 0, true)} Spins`,
      });
    }
    return _rewards;
  }, [reward_spin_amount, reward_gem_amount]);

  return (
    <div className="w-full">
      <div className="relative w-full h-[378px] bg-[url('/images/guiding-tour/lootbox-season/bg@2x.png')] bg-no-repeat bg-top bg-cover pt-[32px]">
        <LootboxSeasonTitle className="relative z-[2]">
          Henlo!
        </LootboxSeasonTitle>
        <div className="w-[529px] h-[342px] shrink-0 absolute z-[1] top-0 left-1/2 -translate-x-1/2 overflow-hidden flex justify-center items-center opacity-40">
          <motion.img
            src="/images/guiding-tour/lootbox-season/light-full@2x.png"
            alt=""
            className="object-center object-contain w-[528px] h-[554px] min-w-[528px] min-h-[554px]"
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
        <div className="absolute z-[2] flex justify-center items-start bottom-0 left-1/2 -translate-x-1/2 w-[357px] h-[342px] bg-[url('/images/guiding-tour/lootbox-season/box-opened@2x.png')] bg-no-repeat bg-top bg-contain">
          <motion.img
            src="/images/guiding-tour/lootbox-season/stars@2x.png"
            alt=""
            className="w-[217px] h-[101px] shrink-0 object-center object-contain absolute z-[2] translate-y-[50px]"
            animate={{
              opacity: [1, 0.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute z-[1] top-[90px] shrink-0"
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
              rewards?.some((reward) => reward.type === RewardType.Gem) && (
                <motion.img
                  src="/images/guiding-tour/lootbox-season/gems@2x.png"
                  alt=""
                  className="w-[166px] h-[97px] shrink-0 object-center object-contain"
                  style={{
                    left: rewards?.length > 1 ? "20px" : "unset",
                  }}
                  animate={{
                    transform: [`translateY(0px)`, `translateY(10px)`, `translateY(0)`],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )
            }
            {
              rewards?.some((reward) => reward.type === RewardType.Spin) && (
                <motion.img
                  src="/images/check-in/ticket-spin.png"
                  alt=""
                  className="w-[150px] h-[122px] shrink-0 object-center object-contain"
                  style={{
                    right: rewards?.length > 1 ? "20px" : "unset",
                  }}
                  animate={{
                    transform: [`translateY(0px)`, `translateY(10px)`, `translateY(0)`],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )
            }
          </motion.div>
        </div>
      </div>
      <div className="w-full mt-[36px] font-Montserrat text-[16px] leading-[150%] text-black font-[500] px-[26px] text-center">
        {
          rewards.map((reward) => (
            <div className="text-[24px font-[900] leading-[120%]" key={reward.type}>
              {reward.label}
            </div>
          ))
        }
        <div className="mt-[18px]">
          Want  to earn  more lootboxes?<br />
          Easy! Check out  your  daily  missions.
        </div>
      </div>
      <div className="w-full mt-[62px] flex justify-center pb-[32px]">
        <LootboxSeasonButton
          className=""
          onClick={onNext}
        >
          Daily missions
        </LootboxSeasonButton>
      </div>
    </div>
  );
};

export default LootboxSeasonGems;
