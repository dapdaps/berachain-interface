import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Mask } from "./Mask";
import { MaskPlacement } from "./getStyleRect";
import IconRight from '@public/images/icon-right.svg'
import { useGuidingTour } from '@/stores/useGuidingTour';

export interface IGuidingTourProps {
  steps: GuidingTourStepConfig[];
  step?: number;
  getContainer?: () => HTMLElement;
  onStepsEnd?: () => void;
  forceShow?: boolean; 
}

export interface GuidingTourStepConfig {
  selector: () => HTMLElement | null;
  placement?: MaskPlacement;
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  renderContent?: () => React.ReactNode;
  beforeForward?: (currentStep: number) => void;
  beforeBack?: (currentStep: number) => void;
}

const GuidingTour: FC<IGuidingTourProps> = (props) => {
  const { step = 0, steps, onStepsEnd, getContainer } = props;
  const { hasShownTour, setHasShownTour } = useGuidingTour();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const currentSelectedElement = steps[currentStep]?.selector();
  const currentContainerElement = getContainer?.() || document.body;
  const [done, setDone] = useState(false);
  const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);
  const [, setRenderTick] = useState<number>(0);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);

  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const back = async () => {
    if (currentStep === 0) {
      return;
    }

    const { beforeBack } = getCurrentStep();
    await beforeBack?.(currentStep);
    setCurrentStep(currentStep - 1);
  };

  const handleTourEnd = useCallback(async () => {
    setIsResetting(true);
    await onStepsEnd?.();
    setDone(true);
    setHasShownTour(true);
    setContentSize({ width: 0, height: 0 });
  }, [onStepsEnd, setHasShownTour]);

  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await handleTourEnd();
      return;
    }

    const { beforeForward } = getCurrentStep();
    await beforeForward?.(currentStep);
    setCurrentStep(currentStep + 1);
  };

  const cancel = async () => {
    await handleTourEnd();
    setCurrentStep(0);
    setIsMaskMoving(false);
  };

  useEffect(() => {
    setCurrentStep(step!);
  }, [step]);

  useEffect(() => {
    if (popoverRef.current) {
      setContentSize({
        width: popoverRef.current.offsetWidth,
        height: popoverRef.current.offsetHeight,
      });
    }
  }, [currentStep]);

  const renderPopover = (wrapper: React.ReactNode) => {
    const config = getCurrentStep();

    if (!config) {
      return wrapper;
    }

    const { title, content } = config;

    const operation = (
      <div className="w-full flex justify-between mt-2 items-center">
        {currentStep !== 0 && (
          <button className={"mr-3 min-w-[80px] hidden"} onClick={() => back()}>
            {"back"}
          </button>
        )}
        {<button className="text-white font-Montserrat text-sm font-[600] hover:cursor-pointer" onClick={() => cancel()}>Skip</button>}
        <button style={{
          border: '1px solid #000',
          boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 0.25)'
        }} className="px-3 py-[10px] bg-[#FFFDEB] flex items-center justify-center text-sm rounded-[20px] text-black font-[600]" onClick={() => forward()}>
          {currentStep === steps.length - 1 ? "Done" : <div className="flex gap-1 items-center"><span>{currentStep + 1}/{steps.length} Next</span><IconRight /></div>}
        </button>
      </div>
    );

    return isMaskMoving ? (
      wrapper
    ) : (
      <div ref={popoverRef} className="max-w-[386px]">
        {config.renderContent ? (
          config.renderContent()
        ) : (
          <>
            <div
              className="bg-[#FFFDEB] rounded-[20px] p-[18px] border border-[#000] w-full"
              style={{
                boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              {title && (
                <div className="text-[18px] font-bold mb-2 font-CherryBomb">
                  {typeof title === "string" ? <span>{title}</span> : title}
                </div>
              )}
              {content && (
                <div className="text-[14px]">
                  {typeof content === "string" ? (
                    <span>{content}</span>
                  ) : (
                    content
                  )}
                </div>
              )}
            </div>
            {operation}
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    setRenderTick(1);
  }, []);

  if ((!props?.forceShow && hasShownTour) || !currentSelectedElement || done) {
    return null;
  }

  const mask = (
    <Mask
      reset={isResetting}
      onAnimationStart={() => {
        setIsMaskMoving(true);
      }}
      onAnimationEnd={() => {
        setIsMaskMoving(false);
      }}
      placement={getCurrentStep().placement as unknown as MaskPlacement}
      container={currentContainerElement}
      element={currentSelectedElement}
      renderMaskContent={(wrapper) => renderPopover(wrapper)}
      contentWidth={contentSize.width}
      contentHeight={contentSize.height}
    />
  );

  return createPortal(mask, currentContainerElement);
};

export default GuidingTour;
