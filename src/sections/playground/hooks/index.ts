import { useRef, useState } from "react";
import { SpinMultiplier, SpinUserData } from "../lucky-bera/config";
import { useRequest } from "ahooks";
import { get } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import { WheelUserData } from "../big-wheel/config";
import { usePlaygroundStore } from "@/stores/use-playground";
import { AUDIO_CONFIG } from "../config";
import { useAudioStore } from "@/stores/use-audio";

export function usePlayground() {
  const multipliers = Object.values(SpinMultiplier).filter(multiplier => typeof multiplier === "number");

  const { accountWithAk } = useCustomAccount();
  const {
    spinUserData,
    setSpinUserData,
    wheelUserData,
    setWheelUserData,
  } = usePlaygroundStore();
  const audioStore: any = useAudioStore();

  const audioRefs = useRef<Map<string, HTMLAudioElement | null>>(new Map());
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

  const playAudio = (preload: { type: string; action?: "play" | "pause"; }) => {
    if (!audioStore.open) {
      return;
    }

    let { type, action } = preload;
    action = action || "play";

    const audioRef = audioRefs.current.get(type);
    if (!audioRef) {
      return;
    }

    const _play = async () => {
      try {
        const audioConfig = AUDIO_CONFIG.find(config => config.type === type);
        if (audioConfig?.playbackRate) {
          audioRef.playbackRate = audioConfig.playbackRate;
        }

        switch (action) {
          case "play":
            audioRef.currentTime = 0;
            // iOS Safari/Chrome requires user interaction to play audio
            const playPromise = audioRef.play();
            if (playPromise !== undefined) {
              try {
                await playPromise;
              } catch (playError) {
                console.warn(`Failed to play audio ${type}:`, playError);
                // Try to load the audio first if play failed
                audioRef.load();
                try {
                  await audioRef.play();
                } catch (retryError) {
                  console.warn(`Retry play failed for audio ${type}:`, retryError);
                }
              }
            }
            break;
          case "pause":
            audioRef.pause();
            break;
          default:
            break;
        }
      } catch (error) {
        console.warn(`Error in playAudio for ${type}:`, error);
      }
    };

    _play();
  };

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
