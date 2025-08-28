import React, { useEffect, useMemo, useRef, useState } from "react";
import LootboxSeasonGuideCard from "./card";
import LootboxSeasonGuideButton from "./button";
import PointsEntry from "@/components/points/entry";

const steps = [
  {
    index: 0,
    id: "lootboxSeasonCheckInEntry",
    description: "☕️ Daily check-in to get gems and lootbox",
    cardPosition: {
      left: "-120px",
      bottom: "-160px",
    },
    icon: (style?: React.CSSProperties) => (
      <img
        src="/images/guiding-tour/lootbox-season/checkin@2x.png"
        alt=""
        className="w-full h-full shrink-0 object-contain object-center"
        style={style}
      />
    ),
    arrow: (style?: React.CSSProperties) => (
      <img
        src="/images/guiding-tour/lootbox-season/arrow2@2x.png"
        alt=""
        className="w-[45px] h-[35px] bottom-[-40px] left-[-50px] shrink-0 object-contain object-center absolute"
        style={style}
      />
    ),
  },
  {
    index: 1,
    id: "lootboxSeasonGemsEntry",
    description: "💎 Your collected gems will be shown here",
    cardPosition: {
      left: "-80px",
      bottom: "-165px",
    },
    icon: (style?: React.CSSProperties) => (
      <PointsEntry isGuide />
    ),
    arrow: (style?: React.CSSProperties) => (
      <img
        src="/images/guiding-tour/lootbox-season/arrow4@2x.png"
        alt=""
        className="w-[45px] h-[35px] bottom-[-40px] left-[40px] shrink-0 object-contain object-center absolute"
        style={style}
      />
    ),
  },
  {
    index: 2,
    id: "lootboxSeasonTreasureBookEntry",
    description: "📖 Check your lootbox &rewards anytime. Do daily missions to get more rewards.",
    cardPosition: {
      left: "-320px",
      top: "-20px",
    },
    icon: (style?: React.CSSProperties) => (
      <img
        src="/images/guiding-tour/lootbox-season/book3@2x.png"
        alt=""
        className="w-full h-full shrink-0 object-contain object-center"
        style={style}
      />
    ),
    arrow: (style?: React.CSSProperties) => (
      <img
        src="/images/guiding-tour/lootbox-season/arrow3@2x.png"
        alt=""
        className="w-[64px] h-[27px] top-1/2 -translate-y-1/2 left-[-70px] shrink-0 object-contain object-center absolute"
        style={style}
      />
    ),
  },
];

const LootboxSeasonGuideContent = (props: any) => {
  const { open, onClose } = props;
  const [elementPosition, setElementPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const [currentStep, setCurrentStep] = useState(steps[0]);
  const currentStepIndex = useMemo(() => {
    return steps.findIndex(step => step.index === currentStep.index);
  }, [currentStep]);

  // Find element position
  const findElementPosition = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setElementPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
      });
    } else {
      console.log('Element not found');
    }
  };

  // Window resize listener
  const handleResize = () => {
    findElementPosition(currentStep.id);
  };

  const onSkip = () => {
    onClose();
  };

  const onNext = () => {
    if (currentStepIndex >= steps.length - 1) {
      onSkip();
      return;
    }
    setCurrentStep(steps[currentStepIndex + 1]);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!currentStep || !open) return;


    // Initial element position lookup
    findElementPosition(currentStep.id);

    // Add window resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentStep, open]);

  return (
    <div className="fixed w-full h-full lef-0 top-0 z-[200] bg-black/50 overflow-hidden">
      {elementPosition && (
        <>
          {/* <div className="text-white p-4">
            <p>Element Position Info:</p>
            <p>X: {elementPosition.x}</p>
            <p>Y: {elementPosition.y}</p>
            <p>Width: {elementPosition.width}</p>
            <p>Height: {elementPosition.height}</p>
          </div> */}
          {
            currentStep && (
              <div
                className="absolute z-[1]"
                style={{
                  left: elementPosition.x,
                  top: elementPosition.y,
                  width: elementPosition.width,
                  height: elementPosition.height,
                }}
              >
                {currentStep.icon()}
                {currentStep.arrow()}
                <LootboxSeasonGuideCard
                  className="w-[241px] absolute"
                  style={currentStep.cardPosition}
                >
                  <div className="">
                    {currentStep.description}
                  </div>
                  <div className="flex justify-end items-center gap-[7px] mt-[13px]">
                    <LootboxSeasonGuideButton
                      className=""
                      onClick={onSkip}
                    >
                      Skip
                    </LootboxSeasonGuideButton>
                    <LootboxSeasonGuideButton
                      className=""
                      type="primary"
                      onClick={onNext}
                    >
                      {
                        currentStepIndex >= steps.length - 1
                          ? "Get start"
                          : `${currentStepIndex + 1}/${steps.length} Next`
                      }
                    </LootboxSeasonGuideButton>
                  </div>
                </LootboxSeasonGuideCard>
              </div>
            )
          }
        </>
      )}
    </div>
  );
};

export default LootboxSeasonGuideContent;
