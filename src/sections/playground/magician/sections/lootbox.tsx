import { RewardType } from "@/components/check-in/config";
import CheckInRewardModal from "@/components/check-in/reward";
import { GameLootbox } from "@/configs/playground";
import useToast from "@/hooks/use-toast";
import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";
import { get, post } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";
import { useRequest } from "ahooks";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

const Lootbox = (props: any) => {
  const { join, magician } = props;

  const isRewardLootbox = useMemo(() => {
    if (!join.result
      || join.result.view === true
      || !magician.account
      || join.result.address.toLowerCase() === magician.account.toLowerCase()
      || !magician.room?.room_id
    ) {
      return false;
    }
    return true;
  }, [join.result, magician.account, magician.room]);

  const [rewardLootboxData, setRewardLootboxData] = useState<any>();
  const { cancel: cancelGetRewardLootbox } = useRequest(async () => {
    if (!document || !isRewardLootbox) {
      setRewardLootboxData(void 0);
      return;
    }
    console.log("%cPolling lootbox...", "background:#8C00FF;color:#fff;");
    try {
      const res = await get("/api/go/game/rps/box", {
        room_id: magician.room?.room_id,
      });
      if (res.code !== 200) {
        setRewardLootboxData(void 0);
        return;
      }
      if (!res.data?.length) {
        setRewardLootboxData(void 0);
        return;
      }
      const _lootbox = res.data[0];
      _lootbox.img = GameLootbox[_lootbox.category].img;
      _lootbox.imgBox = GameLootbox[_lootbox.category].imgBox;
      _lootbox.imgBoxOpen = GameLootbox[_lootbox.category].imgBoxOpen;
      _lootbox.name = GameLootbox[_lootbox.category].name;
      setRewardLootboxData(_lootbox);
      cancelGetRewardLootbox();
    } catch (error) {
      console.log("get reward lootbox failed: %o", error);
    }
  }, {
    pollingInterval: 2000,
  });

  useEffect(() => {
    return () => {
      console.log("%cStop polling lootbox...", "background:#8C00FF;color:#fff;");
      cancelGetRewardLootbox();
      setRewardLootboxData(void 0);
    };
  }, []);

  // console.log("magician: %o", magician);
  // console.log("join: %o", join);
  // console.log("rewardLootboxData: %o", rewardLootboxData);

  if (!document || !isRewardLootbox || !rewardLootboxData) {
    return null;
  }

  return ReactDOM.createPortal((
    <AnimatePresence>
      <Content
        rewardLootboxData={rewardLootboxData}
        onClose={() => {
          join.onClose();
        }}
      />
    </AnimatePresence>
  ), document.body);
};

export default Lootbox;

const Content = (props: any) => {
  const { rewardLootboxData, onClose } = props;

  const {
    treasureBookOpen,
    setTreasureBookOpen,
    treasureBookTab,
    setTreasureBookTab,
} = useLootboxSeasonStore();

  const toast = useToast();
  const dropdownDustVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!dropdownDustVideoRef.current) return;
    const timer = setTimeout(() => {
      dropdownDustVideoRef.current?.play();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [openRewardModal, setOpenRewardModal] = useState(false);
  const { runAsync: open, loading: opening, data: rewardData } = useRequest(async () => {
    let toastId = toast.loading({ title: "Opening..." });
    try {
      const res = await post("/api/go/box/draw", {
        box: 1,
        category: rewardLootboxData.category,
      });
      toast.dismiss(toastId);
      if (res.code !== 200) {
        toast.fail({ title: res.message });
        return;
      }
      setOpenRewardModal(true);
      const _rewardData: any = [];
      if (res.data.cosmetic && res.data.cosmetic.length > 0) {
        _rewardData.push({
          type: RewardType.Cosmetic,
          amount: res.data.cosmetic.length,
          label: `${numberFormatter(res.data.cosmetic.length, 0, true)} Cosmetic${res.data.cosmetic.length > 1 ? 's' : ''}`,
        });
      }
      if (res.data.gem_amount && res.data.gem_amount > 0) {
        _rewardData.push({
          type: RewardType.Gem,
          amount: res.data.gem_amount,
          label: `${numberFormatter(res.data.gem_amount, 0, true)} Point${res.data.box_balance > 1 ? 's' : ''}`,
        });
      }
      // new nft reward
      if (res.data.reward_amount && res.data.reward_amount > 0) {
        _rewardData.push({
          type: RewardType.NFT,
          amount: res.data.reward_amount,
          img: rewardLootboxData.img,
          label: `${numberFormatter(res.data.reward_amount, 0, true)} ${rewardLootboxData.name}`,
        });
      }

      setTreasureBookOpen(true);
      setTreasureBookTab("partners");

      return _rewardData;
    } catch (error) {
      console.log("open lootbox failed: %o", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Open failed!" });
    }
  }, { manual: true });

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 w-full h-full z-[63] left-0 top-0 overflow-hidden"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <div className="w-[206px] h-[164px] absolute z-[2] left-[240px] bottom-[64px]">
        <motion.button
          type="button"
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url("${rewardLootboxData.imgBox}")`,
          }}
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          onClick={open}
          disabled={opening}
        />
        <motion.img
          src="/images/playground/magician/arrow-left-down.png"
          alt=""
          className="w-[44px] h-[65px] shrink-0 object-center object-contain absolute right-[-40px] top-[-40px]"
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1,
          }}
        />
        <motion.div
          className="w-[300px] absolute right-[-200px] top-[-120px] p-[13px_9px_17px_17px] font-CherryBomb leading-[100%] text-[20px] text-black border border-[#E5C375] rounded-[16px] bg-[#FFF1C7]"
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.3,
          }}
        >
          Don’t worry, {rewardLootboxData.name} brought you something good
        </motion.div>
      </div>
      <motion.video
        ref={dropdownDustVideoRef}
        src="/images/playground/magician/dropdown-dust.webm"
        controls={false}
        autoPlay={false}
        muted
        playsInline
        loop={false}
        className="w-[570px] h-[570px] object-bottom object-contain shrink-0 absolute z-[1] left-[42px] bottom-[-98px] pointer-events-none"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.6,
        }}
      />
      <CheckInRewardModal
        open={openRewardModal && !!rewardData}
        onClose={() => {
          setOpenRewardModal(false);
          onClose();
        }}
        data={rewardData}
        boxStyle={{
          backgroundImage: `url("${rewardLootboxData.imgBoxOpen}")`,
        }}
      />
    </motion.div>
  );
};
