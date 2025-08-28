import { motion } from "framer-motion";
import LootboxSeasonTitle from "../../components/title";
import LootboxSeasonButton from "../../components/button";

const LootboxSeasonGems = (props: any) => {
  const { onNext, points } = props;

  return (
    <div className="w-full">
      <div className="relative w-full h-[378px] bg-[url('/images/guiding-tour/lootbox-season/bg@2x.png')] bg-no-repeat bg-top bg-cover pt-[32px]">
        <LootboxSeasonTitle className="relative z-[2]">
          Good Luck!
        </LootboxSeasonTitle>
        <motion.img
          src="/images/guiding-tour/lootbox-season/light@2x.png"
          alt=""
          className="w-[529px] h-[342px] shrink-0 object-center object-contain absolute z-[1] top-0 left-1/2 -translate-x-1/2"
          animate={{
            opacity: [1, 0.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
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
          <motion.img
            src="/images/guiding-tour/lootbox-season/gems@2x.png"
            alt=""
            className="w-[166px] h-[97px] shrink-0 object-center object-contain absolute z-[1] top-[90px]"
            animate={{
              transform: [`translateY(0px)`, `translateY(10px)`, `translateY(0)`],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
      <div className="w-full mt-[36px] font-Montserrat text-[16px] leading-[150%] text-black font-[500] px-[26px] text-center">
        <div className="text-[24px font-[900] leading-[120%]">
          You’ve got {points} Gems
        </div>
        <div className="mt-[18px]">
          Want more lootbox? Complete daily missions
        </div>
      </div>
      <div className="w-full mt-[62px] flex justify-center pb-[32px]">
        <LootboxSeasonButton
          className=""
          onClick={onNext}
        >
          Check daily missions
        </LootboxSeasonButton>
      </div>
    </div>
  );
};

export default LootboxSeasonGems;
