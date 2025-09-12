import { useEffect, useRef, useState } from "react";
import { SpinMultiplier, SpinUserData } from "../lucky-bera/config";
import { useRequest } from "ahooks";
import { get } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import { WheelUserData } from "../big-wheel/config";
import { usePlaygroundStore } from "@/stores/use-playground";
import { AUDIO_CONFIG } from "../config";

export function usePlayground() {
  const multipliers = Object.values(SpinMultiplier).filter(multiplier => typeof multiplier === "number");

  const { accountWithAk } = useCustomAccount();
  const {
    spinUserData,
    setSpinUserData,
    wheelUserData,
    setWheelUserData,
  } = usePlaygroundStore();

  const audioRefs = useRef<Map<string, HTMLAudioElement | null>>(new Map());
  const audioTimerRefs = useRef<Map<string, any>>(new Map(AUDIO_CONFIG.map(audio => [audio.type, 0])));
  const [spinMultiplier, setSpinMultiplier] = useState<SpinMultiplier>(SpinMultiplier.X1);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const checkSpinMultiplier = (_spinUserData?: SpinUserData) => {
    if (!_spinUserData?.spin_balance) {
      setSpinMultiplier(SpinMultiplier.X1);
      return;
    }
    let currIndex = multipliers.indexOf(spinMultiplier);
    if (multipliers[currIndex] > _spinUserData.spin_balance) {
      setSpinMultiplier(SpinMultiplier.X1);
    }
  };

  const { runAsync: getSpinUserData, loading: spinUserDataLoading } = useRequest<SpinUserData, any>(async () => {
    if (!accountWithAk) return;
    const res = await get("/api/go/game/777/user");
    if (res.code !== 200) {
      checkSpinMultiplier();
      setSpinUserData(void 0);
      return {};
    }
    checkSpinMultiplier(res.data);
    setSpinUserData(res.data);
    return res.data;
  }, {
    refreshDeps: [accountWithAk],
  });

  const { loading: wheelUserDataLoading, runAsync: getWheelUserData } = useRequest<WheelUserData, any>(async () => {
    if (!accountWithAk) {
      setWheelUserData(void 0);
      return;
    }
    const res = await get("/api/go/game/wheel/user");
    if (res.code !== 200) {
      setWheelUserData(void 0);
      return;
    }
    setWheelUserData(res.data);
    return res.data;
  }, {
    refreshDeps: [accountWithAk],
  });

  const playAudio = (preload: { type: string; action?: "play" | "pause"; delay?: number; }) => {
    let { type, action, delay } = preload;
    action = action || "play";

    const audioRef = audioRefs.current.get(type);
    if (!audioRef) {
      return;
    }

    const _play = () => {
      const audioConfig = AUDIO_CONFIG.find(config => config.type === type);
      if (audioConfig?.playbackRate) {
        audioRef.playbackRate = audioConfig.playbackRate;
      }

      switch (action) {
        case "play":
          audioRef.currentTime = 0;
          audioRef.play();
          break;
        case "pause":
          audioRef.pause();
          break;
        default:
          break;
      }
    };

    if (delay) {
      const timerMap = audioTimerRefs.current;
      const timer = setTimeout(() => {
        clearTimeout(timer);
        _play();
      }, preload.delay);
      clearTimeout(timerMap.get(type));
      timerMap.delete(type);
      timerMap.set(type, timer);
      return;
    }

    _play();
  };

  useEffect(() => {
    return () => {
      audioTimerRefs.current.forEach((timer) => {
        clearTimeout(timer);
      });
      audioTimerRefs.current.clear();
    };
  }, []);

  return {
    multipliers,
    spinMultiplier,
    setSpinMultiplier,
    spinUserData,
    setSpinUserData,
    getSpinUserData,
    spinUserDataLoading,
    wheelUserData,
    setWheelUserData,
    wheelUserDataLoading,
    getWheelUserData,
    showRulesModal,
    setShowRulesModal,
    audioRefs,
    playAudio,
  };
}
