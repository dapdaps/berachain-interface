import { motion, useAnimate, useMotionValue } from 'framer-motion';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { SPIN_CATEGORIES, SPIN_XP_REWARD_CATEGORIES, SpinCategory, SpinResultData, SpinXpRewardCategory } from '../config';
import LightingButton from './lighting-button';
import { numberFormatter } from '@/utils/number-formatter';
import useToast from '@/hooks/use-toast';
import Big from 'big.js';
import { useDebounceFn, useRequest } from 'ahooks';
import clsx from 'clsx';
import LuckyBeraRecordsModal from './records/modal';
import { useCoinExplosion } from '../../hooks/use-coin-explosion';

const WHEEL_SIZE = 500;
const WHEEL_AREA = 120;
const WHEEL_CENTER_OFFSET = 110;
const WHEEL_ICON_SIZE = 60;
const SPIN_PROGRESS_BASE = 10; // percent
const EXPLOSION_COIN_SIZE = 100;

const TOTAL_SPINS = 50;

const SpinCategories = Object.values(SPIN_CATEGORIES);
const SpinCategoryRotation = WHEEL_AREA / SpinCategories.length;
const SpinBase = 10;

const WheelInfinityDelay = 0.3;
const WheelInfinitySlowDuration = 20;
const WheelInfinityAnimation: any = {
  duration: WheelInfinityDelay,
  ease: 'linear',
  repeat: Infinity,
};

export default memo(function Tiger(props: any) {
  const {
    spinMultiplier,
    toggleSpinMultiplier,
    spinUserData,
    lastSpinResult,
    handleSpinResult,
    openBuySpinsModal,
  } = props;

  const toast = useToast();
  const { createCoinsExplosion } = useCoinExplosion();

  const [leftWheel, leftWheelAnimate] = useAnimate();
  const leftWheelRotation = useMotionValue(SpinCategoryRotation);
  const [centerWheel, centerWheelAnimate] = useAnimate();
  const centerWheelRotation = useMotionValue(0);
  const [rightWheel, rightWheelAnimate] = useAnimate();
  const rightWheelRotation = useMotionValue(SpinCategoryRotation * 2);
  const spinRef = useRef<any>();
  const spinXpRef = useRef<any>();
  const spinXpRewardRef = useRef<any>();
  const spinTimerInfinityLeft = useRef<any>();
  const spinTimerInfinityCenter = useRef<any>();
  const spinTimerInfinityRight = useRef<any>();

  const [openRecordsModal, setOpenRecordsModal] = useState(false);

  const startCoinExplosion = (params: SpinResultData) => {
    const { draw_reward } = params;

    const currCategory = SPIN_CATEGORIES[draw_reward as SpinCategory];

    if (!spinRef.current || !currCategory) {
      startSlowScrollDebounce();
      return;
    }

    // Calculate center position for coin explosion
    const rect = spinRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 - EXPLOSION_COIN_SIZE / 2;
    const startY = rect.top + rect.height / 2 - EXPLOSION_COIN_SIZE;

    const isRocket = draw_reward === SpinCategory.Rocket;

    createCoinsExplosion(startX, startY, currCategory.icon, {
      size: EXPLOSION_COIN_SIZE,
      ref: isRocket ? spinXpRef : void 0,
      offsetX: -40,
      offsetY: -40,
      delayBetweenCoins: 150,
    });

    if (isRocket) {
      const xpRewardRect = spinXpRewardRef.current.getBoundingClientRect();
      const startXpRewardX = xpRewardRect.left + xpRewardRect.width / 2 - EXPLOSION_COIN_SIZE / 2;
      const startXpRewardY = xpRewardRect.top + xpRewardRect.height / 2 - EXPLOSION_COIN_SIZE;
      const xpRewardIcon = SPIN_XP_REWARD_CATEGORIES[spinUserData?.game_xp?.reward as SpinXpRewardCategory]?.icon;
      createCoinsExplosion(startXpRewardX, startXpRewardY, xpRewardIcon, {
        size: EXPLOSION_COIN_SIZE / 3 * 2,
        customPosition: {
          x: window.innerWidth / 2,
          y: -100,
        },
        coinCount: 5,
        delayBetweenCoins: 500,
      });
    }
  };

  const startSlowScroll = () => {
    leftWheelAnimate(leftWheel.current, {
      rotateX: [leftWheelRotation.get(), leftWheelRotation.get() + 360]
    }, {
      ...WheelInfinityAnimation,
      duration: WheelInfinitySlowDuration,
    });
    centerWheelAnimate(centerWheel.current, {
      rotateX: [centerWheelRotation.get(), centerWheelRotation.get() + 360]
    }, {
      ...WheelInfinityAnimation,
      duration: WheelInfinitySlowDuration,
    });
    rightWheelAnimate(rightWheel.current, {
      rotateX: [rightWheelRotation.get(), rightWheelRotation.get() + 360]
    }, {
      ...WheelInfinityAnimation,
      duration: WheelInfinitySlowDuration,
    });
  };

  const { run: startSlowScrollDebounce, cancel: cancelStartSlowScrollDebounce } = useDebounceFn(startSlowScroll, { wait: 5000 });

  const startInfinityScroll: () => Promise<any> = () => new Promise((resolve) => {
    let leftWheelAnimation: any;
    let centerWheelAnimation: any;
    let rightWheelAnimation: any;
    leftWheelAnimation = leftWheelAnimate(leftWheel.current, {
      rotateX: [leftWheelRotation.get(), leftWheelRotation.get() + 360]
    }, WheelInfinityAnimation);
    spinTimerInfinityLeft.current = setTimeout(() => {
      clearTimeout(spinTimerInfinityLeft.current);
      centerWheelAnimation = centerWheelAnimate(centerWheel.current, {
        rotateX: [centerWheelRotation.get(), centerWheelRotation.get() + 360]
      }, WheelInfinityAnimation);
    }, WheelInfinityDelay * 1000);
    spinTimerInfinityCenter.current = setTimeout(() => {
      clearTimeout(spinTimerInfinityCenter.current);
      rightWheelAnimation = rightWheelAnimate(rightWheel.current, {
        rotateX: [rightWheelRotation.get(), rightWheelRotation.get() - 360]
      }, WheelInfinityAnimation);
    }, WheelInfinityDelay * 1000 * 2);

    spinTimerInfinityRight.current = setTimeout(() => {
      clearTimeout(spinTimerInfinityRight.current);
      resolve({
        leftWheelAnimation,
        centerWheelAnimation,
        rightWheelAnimation,
      });
    }, WheelInfinityDelay * 3 * 1000);
  });

  const startWheelResultScroll: (params: any) => Promise<any> = (params) => new Promise((resolve) => {
    // calc wheel position
    const { draw_codes } = params.data as SpinResultData;
    const [leftCode, centerCode, rightCode] = draw_codes;

    const leftCategoryIndex = SpinCategories.findIndex((it) => it.code === leftCode);
    const centerCategoryIndex = SpinCategories.findIndex((it) => it.code === centerCode);
    const rightCategoryIndex = SpinCategories.findIndex((it) => it.code === rightCode);

    console.log(
      "lottery code is left: %o(%o), center: %o(%o), right: %o(%o)",
      leftCode,
      SpinCategories[leftCategoryIndex].value,
      centerCode,
      SpinCategories[centerCategoryIndex].value,
      rightCode,
      SpinCategories[rightCategoryIndex].value,
    );

    const baseRotation = 360 * SpinBase;

    const leftWheelCodeRotation = baseRotation + (WHEEL_AREA - leftCategoryIndex * SpinCategoryRotation) - 1;
    const centerWheelCodeRotation = baseRotation + (WHEEL_AREA - centerCategoryIndex * SpinCategoryRotation) - 1;
    const rightWheelCodeRotation = baseRotation + (WHEEL_AREA - rightCategoryIndex * SpinCategoryRotation) - 1;

    leftWheelAnimate(leftWheel.current, {
      rotateX: [leftWheelRotation.get(), leftWheelCodeRotation]
    }, {
      type: "spring",
      onComplete: () => {
        centerWheelAnimate(centerWheel.current, {
          rotateX: [centerWheelRotation.get(), centerWheelCodeRotation]
        }, {
          type: "spring",
          onComplete: () => {
            rightWheelAnimate(rightWheel.current, {
              rotateX: [rightWheelRotation.get(), rightWheelCodeRotation]
            }, {
              type: "spring",
              onComplete: () => {
                resolve({});
              },
            });
          },
        });
      },
    });
    // spinTimerResult.current = setTimeout(() => {
    //   clearTimeout(spinTimerResult.current);
    //   resolve({});
    // }, WheelInfinityDelay * 3 * 1000);
  });

  const { run: handleSpin, loading: spinning } = useRequest<any, any>(async () => {
    if (!spinUserData?.spin_balance) {
      openBuySpinsModal();
      return;
    }

    cancelStartSlowScrollDebounce();

    // start wheel scroll
    const animations = await startInfinityScroll();

    // request api
    const res = await handleSpinResult();
    if (!res) {
      // animations.leftWheelAnimation.pause();
      // animations.centerWheelAnimation.pause();
      // animations.rightWheelAnimation.pause();
      startSlowScroll();
      return;
    }

    await startWheelResultScroll({
      ...animations,
      data: res,
    });

    startCoinExplosion(res);
  }, {
    manual: true,
  });

  const spinProgress = useMemo(() => {
    const progress = +Big(SPIN_PROGRESS_BASE).plus(Big(spinUserData?.spin_balance ?? 0).div(TOTAL_SPINS).times(Big(100).minus(SPIN_PROGRESS_BASE))).toFixed(2);
    return Math.min(Math.max(progress, 0), 100);
  }, [spinUserData]);

  useEffect(() => {
    startSlowScroll();

    return () => {
      clearTimeout(spinTimerInfinityLeft.current);
      clearTimeout(spinTimerInfinityCenter.current);
      clearTimeout(spinTimerInfinityRight.current);
    };
  }, []);

  return (
    <div className="w-full min-h-[100dvh] flex items-end justify-center">
      <div className="relative flex flex-col items-center justify-center scale-90 origin-bottom z-[2]">
        <div className="relative z-[3] w-[608px] h-[506px] max-w-full bg-[url('/images/playground/lucky-bera/bear-top.png')] bg-center bg-contain">
          <div className="flex justify-center items-start absolute z-[2] w-full top-[20px] pointer-events-none">
            <img
              src="/images/playground/lucky-bera/title.png"
              alt="title"
              className="w-[480px] h-[145px] object-center object-contain"
            />
          </div>
          <div className="absolute z-[1] top-[140px] left-0 right-0 flex flex-col items-center">
            <div className="flex items-center justify-center gap-[4px] w-[301px] h-[43px] bg-[url('/images/playground/lucky-bera/amount-bg.svg')] bg-no-repeat bg-center bg-contain">
              {
                !!lastSpinResult?.draw_reward_amount && (
                  <>
                    {
                      !!SPIN_CATEGORIES[lastSpinResult.draw_reward as SpinCategory] && (
                        <div className="w-[22px]">
                          <img
                            src={SPIN_CATEGORIES[lastSpinResult.draw_reward as SpinCategory].icon}
                            alt={SPIN_CATEGORIES[lastSpinResult.draw_reward as SpinCategory].value}
                            className="translate-y-0.5"
                          />
                        </div>
                      )
                    }
                    <div className="text-[#FFF4C2] text-stroke-2 text-[24px] font-CherryBomb">
                      {numberFormatter(lastSpinResult.draw_reward_amount, 2, true)}
                    </div>
                  </>
                )
              }
            </div>
            <div ref={spinXpRef} className="m-[14px_0_18px] relative pl-[4px] w-[200px] h-[25px] flex items-center  rounded-[10px] border-2 border-[#E49F63] bg-[#582911]">
              <img
                src="/images/playground/lucky-bera/icon-rocket.png"
                alt="theme"
                className="w-[50px] h-[50px] object-center object-contain shrink-0 absolute -left-[15px]"
              />
              <motion.div
                className="h-[18px] rounded-[6px] border-2 border-[#F8C200] bg-[#FFE380] shadow-[0px_4px_0px_0px_rgba(255, 255, 255, 0.50)_inset]"
                animate={{
                  width: Big(spinUserData?.xp_balance ?? 0).gt(0) ? Big(spinUserData?.xp_balance ?? 0).div(spinUserData?.game_xp?.xp ?? 0).times(100).toFixed(2) + "%" : "0%"
                }}
              />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(180deg,_#926D48_0%,_#221911_100%)] bg-clip-text [-webkit-text-fill-color:_transparent] text-[12px] font-CherryBomb [-webkit-text-stroke-width:_1px] [-webkit-text-stroke-color:_#FFF4C2] font-[400] leading-[100%] text-center">
                {numberFormatter(spinUserData?.xp_balance, 2, true)} / {numberFormatter(spinUserData?.game_xp?.xp, 2, true)}
              </div>

              {
                !!spinUserData?.game_xp && (
                  <div className="absolute -right-[30px] -top-[8px]">
                    <img
                      ref={spinXpRewardRef}
                      src={SPIN_XP_REWARD_CATEGORIES[spinUserData?.game_xp?.reward as SpinXpRewardCategory]?.icon}
                      alt=""
                      className="w-[55px] h-[46px] object-center object-contain shrink-0"
                    />
                    <div className="absolute whitespace-nowrap left-1/2 -translate-x-1/2 bottom-[4px] font-CherryBomb text-[16px] text-[#FFE7A5] [text-shadow:0_2px_0_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_#4B371F] leading-none">
                      {spinUserData?.game_xp?.rewardAmount}{spinUserData?.game_xp?.reward}
                    </div>
                  </div>
                )
              }
            </div>
            <div className="relative flex items-center w-[353px] h-[188px] bg-[url('/images/playground/lucky-bera/turntable_bg.svg')] bg-center bg-contain bg-no-repeat">
              <div className="absolute top-1/2 translate-x-[-40px] -translate-y-1/2">
                <img
                  src="/images/playground/lucky-bera/pointer.svg"
                  alt="pointer"
                  className="w-[57px] h-[43px] object-center object-contain"
                />
              </div>
              <div className="absolute rotate-180 -right-[2px] top-1/2 translate-x-[35px] -translate-y-1/2">
                <img
                  src="/images/playground/lucky-bera/pointer.svg"
                  alt="pointer"
                  className="w-[57px] h-[43px] object-center object-contain"
                />
              </div>

              <div className="absolute left-[6px] right-[6px] top-[5px] bottom-[5px] overflow-hidden">
                {/*#region Left*/}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translateX(calc(-50% - ${WHEEL_CENTER_OFFSET}px)) translateY(-50%) perspective(1000px)`,
                    width: WHEEL_SIZE,
                    height: WHEEL_SIZE,
                  }}
                >
                  <motion.div
                    ref={leftWheel}
                    className="w-full h-full relative [transform-style:preserve-3d]"
                    style={{
                      rotateX: leftWheelRotation,
                    }}
                  >
                    {
                      new Array(360 / WHEEL_AREA).fill(null).map((_, index) => SpinCategories.map((item, idx) => (
                        <div
                          key={`${index}-${idx}`}
                          className="absolute rounded-full top-1/2 left-1/2 origin-center opacity-100 -mt-[30px] -ml-[30px] [backface-visibility:hidden]"
                          style={{
                            transform: `rotateX(${index * WHEEL_AREA + idx * SpinCategoryRotation}deg) translateZ(${WHEEL_SIZE * 0.7 / 2}px) translateY(${item.centerY}px)`,
                            width: WHEEL_ICON_SIZE * item.centerScale,
                            height: WHEEL_ICON_SIZE * item.centerScale,
                          }}
                        >
                          <img src={item.icon} alt="" className="w-full" />
                        </div>
                      )))
                    }
                  </motion.div>
                </motion.div>
                {/*#endregion*/}
                {/*#region Center*/}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: "translateX(calc(-50%)) translateY(-50%) perspective(1000px)",
                    width: WHEEL_SIZE,
                    height: WHEEL_SIZE,
                  }}
                >
                  <motion.div
                    ref={centerWheel}
                    className="w-full h-full relative [transform-style:preserve-3d]"
                    style={{
                      rotateX: centerWheelRotation,
                    }}
                  >
                    {
                      new Array(360 / WHEEL_AREA).fill(null).map((_, index) => SpinCategories.map((item, idx) => (
                        <div
                          key={`${index}-${idx}`}
                          className="absolute rounded-full top-1/2 left-1/2 origin-center opacity-100 -mt-[30px] -ml-[30px] [backface-visibility:hidden]"
                          style={{
                            transform: `rotateX(${index * WHEEL_AREA + idx * SpinCategoryRotation}deg) translateZ(${WHEEL_SIZE * 0.7 / 2}px) translateY(${item.centerY}px)`,
                            width: WHEEL_ICON_SIZE * item.centerScale,
                            height: WHEEL_ICON_SIZE * item.centerScale,
                          }}
                        >
                          <img src={item.icon} alt="" className="w-full" />
                        </div>
                      )))
                    }
                  </motion.div>
                </motion.div>
                {/*#endregion*/}
                {/*#region Right*/}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translateX(calc(-50% + ${WHEEL_CENTER_OFFSET}px)) translateY(-50%) perspective(1000px)`,
                    width: WHEEL_SIZE,
                    height: WHEEL_SIZE,
                  }}
                >
                  <motion.div
                    ref={rightWheel}
                    className="w-full h-full relative [transform-style:preserve-3d]"
                    style={{
                      rotateX: rightWheelRotation,
                    }}
                  >
                    {
                      new Array(360 / WHEEL_AREA).fill(null).map((_, index) => SpinCategories.map((item, idx) => (
                        <div
                          key={`${index}-${idx}`}
                          className="absolute rounded-full top-1/2 left-1/2 origin-center opacity-100 -mt-[30px] -ml-[30px] [backface-visibility:hidden]"
                          style={{
                            transform: `rotateX(${index * WHEEL_AREA + idx * SpinCategoryRotation}deg) translateZ(${WHEEL_SIZE * 0.7 / 2}px) translateY(${item.centerY}px)`,
                            width: WHEEL_ICON_SIZE * item.centerScale,
                            height: WHEEL_ICON_SIZE * item.centerScale,
                          }}
                        >
                          <img src={item.icon} alt="" className="w-full" />
                        </div>
                      )))
                    }
                  </motion.div>
                </motion.div>
                {/*#endregion*/}
              </div>

              <div className="absolute left-[4.25px] top-[4px] right-[5.11px] bottom-[5px] z-10 bg-[url('/images/playground/lucky-bera/turntable_masker.svg')] bg-no-repeat bg-cover bg-center">
                {/* <img
                src="/images/playground/lucky-bera/turntable_masker.svg"
                alt="turntable_masker"
                className="w-[339px] h-[180px] object-center object-contain"
              /> */}
              </div>
            </div>
          </div>
          {/* <LightingButton
            outerClassName="absolute bottom-[20px] w-[192px] h-[48px] left-1/2 -translate-x-1/2"
            className="flex justify-center items-center gap-[3px]"
            onClick={toggleSpinMultiplier}
          >
            <div className="text-[18px]">
              BET X{numberFormatter(spinMultiplier, 0, true, { isShort: true, isShortUppercase: true })}
            </div>
            <img src="/images/playground/lucky-bera/icon-flash.png" alt="" className="w-[16px] shrink-0 h-[25px] object-center object-contain bg-no-repeat" />
          </LightingButton> */}
        </div>
        <div className="relative z-[2] flex justify-center w-full h-[276px] translate-y-[-15px] overflow-hidden">
          <div className="relative z-[2] flex flex-col items-center w-[616px] max-w-full h-full bg-[url('/images/playground/lucky-bera/bear-bottom.png')] bg-top bg-contain bg-no-repeat">
            <motion.button
              ref={spinRef}
              type="button"
              disabled={spinning}
              className="w-[185px] h-[93px] bg-[url('/images/playground/lucky-bera/spin-button.svg')] bg-no-repeat bg-center bg-contain disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={spinning ? {} : {
                scaleY: 0.9,
              }}
              style={{
                transformOrigin: "center bottom",
                y: 25,
              }}
              onClick={handleSpin}
            />
            <div className="absolute bottom-[45px] flex items-center justify-center gap-[10px]">
              <div className="relative flex items-center gap-[15px] h-[50px]">
                <div className="text-[#B76F39] font-CherryBomb font-[400] text-[16px] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F]">
                  Spin Tickets
                </div>
                <div className="w-[200px] flex justify-between items-center pr-[14px] text-[#FFF4C2] text-[24px] font-CherryBomb [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F] font-[400] h-full border-[2px] border-[#AD885E] rounded-[10px] bg-[#322C2C] shadow-[2px_7px_0_0_rgba(0,_0,_0,_0.25)_inset]">
                  <img
                    src="/images/playground/lucky-bera/ticket-spin.png"
                    alt=""
                    className="w-[70px] h-[56px] object-center object-contain translate-y-[2px]"
                  />
                  <div className="">
                    {numberFormatter(spinUserData?.spin_balance, 0, true)}
                  </div>
                </div>
              </div>
              <LightingButton
                outerClassName="!h-[47px]"
                className="!px-[29px]"
                onClick={openBuySpinsModal}
              >
                BUY
              </LightingButton>
            </div>
          </div>
        </div>
        <img
          src="/images/playground/lucky-bera/bear-bottom-coins-left.svg"
          alt=""
          className="absolute translate-x-[-230px] bottom-[170px] z-[1] w-[164px] h-[165px] object-center object-contain pointer-events-none"
        />
        <img
          src="/images/playground/lucky-bera/bear-bottom-coins-right.svg"
          alt=""
          className="absolute translate-x-[270px] bottom-[170px] z-[1] w-[240px] h-[197px] object-center object-contain pointer-events-none"
        />
        <button
          type="button"
          className="absolute z-[1] translate-x-[310px] hover:translate-x-[320px] transition-all duration-150 bottom-[70px] w-[125px] h-[50px] bg-[url('/images/playground/lucky-bera/btn-history.png')] bg-no-repeat bg-center bg-contain"
          onClick={() => {
            setOpenRecordsModal(true);
          }}
        />
      </div>
      <LuckyBeraRecordsModal
        open={openRecordsModal}
        onClose={() => {
          setOpenRecordsModal(false);
        }}
      />
    </div>
  )
});
