import { motion } from "framer-motion";
import LootboxSeasonTitle from "../../components/title";
import LootboxSeasonButton from "../../components/button";
import useAccount from "@/hooks/use-account";
import { useEffect } from "react";

const LootboxSeasonStart = (props: any) => {
  const { onNext, hadUserCategory } = props;

  const { account } = useAccount();

  useEffect(() => {
    if (!window) return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full h-[378px] bg-[url('/images/guiding-tour/lootbox-season/bg2@2x.png')] bg-no-repeat bg-top bg-cover pt-[32px]">
        <LootboxSeasonTitle>
          Incentivise Everything
        </LootboxSeasonTitle>
        <motion.img
          src="/images/guiding-tour/lootbox-season/book2@2x.png"
          alt=""
          className="w-[498px] h-[440px] shrink-0 object-center object-contain absolute bottom-0 right-[30px]"
          animate={{
            transform: [`translateY(0)`, `translateY(10px)`, `translateY(0)`],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.img
          src="/images/guiding-tour/lootbox-season/book@2x.png"
          alt=""
          className="w-[139px] h-[158px] shrink-0 object-center object-contain absolute top-[92px] left-[64px]"
          animate={{
            transform: [`translateY(0)`, `translateY(10px)`, `translateY(0)`],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.img
          src="/images/guiding-tour/lootbox-season/arrow@2x.png"
          alt=""
          className="w-[75px] h-[47px] shrink-0 object-center object-contain absolute bottom-[71px] left-[74px]"
          animate={{
            transform: [`translateY(0)`, `translateY(10px)`, `translateY(0)`],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <div className="w-full mt-[4px] font-Montserrat text-[16px] leading-[150%] text-black font-[500] px-[26px]">
        <div className="text-[24px] font-[900] leading-[120%]">
          Beratown ‘Incentivise Everything’ Begins!
        </div>
        <div className="mt-[11px]">
          Da town just received a glow-up. We are adding a new incentivise layer that rewards all your usual DeFi activity.<br /> And guess what? McBera left you a free lootbox just for showing up. No catch, just connect your wallet.
        </div>
      </div>
      <div className="w-full mt-[29px] flex justify-center pb-[30px] md:pl-[40px]">
        <LootboxSeasonButton
          className="!px-[100px]"
          onClick={onNext}
        >
          {
            !!account && !hadUserCategory && (
              <img
                src="/images/guiding-tour/lootbox-season/box@2x.png"
                alt=""
                className="w-[82px] h-[66px] shrink-0 object-center object-contain absolute left-[-40px]"
              />
            )
          }
          <div className="">
            {
              !account ? "Connect Wallet" : (hadUserCategory ? "Daily missions" : "Earn Lootbox")
            }
          </div>
        </LootboxSeasonButton>
      </div>
    </div>
  );
};

export default LootboxSeasonStart;
