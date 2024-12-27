import IconReload from "@public/images/home/christmas/icon-reload.svg";
import BoxTitle from "@/sections/activity/christmas/components/box-title";
import Button from "@/sections/activity/christmas/components/button";
import SocialTask from "@/sections/activity/christmas/components/social-task";
import Pyramid, {
  createPyramid
} from "@/sections/activity/christmas/components/pyramid";
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChristmasContext } from "@/sections/activity/christmas/context";
import OpenModal from "../box-modal/open-modal";
import OpenMultiModal from "../box-modal/open-multi-modal";
import UserPresentsModal from "../user-presents-modal";
import useOpenBox from "../hooks/use-open-box";
import { getUTCTimestamp } from '@/utils/date';
import DailyQuest from '@/sections/activity/christmas/components/daily-quest';
import Big from 'big.js';
import { useAppKit } from '@reown/appkit/react';
import useCustomAccount from '@/hooks/use-account';
import { numberFormatter } from '@/utils/number-formatter';
import * as dateFns from 'date-fns';
import { motion } from "framer-motion";

const GiftBox = () => {
  const {
    followXQuest,
    handleQuest,
    getQuestVisited,
    handleQuestCheck,
    questVisited,
    questList,
    questLoading,
    userInfo,
    userBox,
    snowflakeBalance,
    snowflakeBalanceLoading,
    userRemainBox,
    userInfoLoading,
    getUserInfo,
    getUserBox,
    userBoxLoading,
    currentDateTime,
    currentUTCString,
    currentUTCZeroTimestamp,
    setShowSwapModal,
    requestCheck,
    handleQuestUpdate,
    isMobile,
    activityInvalid
  } = useContext(ChristmasContext);
  const { open } = useAppKit();
  const { account } = useCustomAccount();

  const [openType, setOpenType] = useState(0);
  const [dailyVisible, setDailyVisible] = useState(false);
  const [dailyChecking, setDailyChecking] = useState(false);
  const [openData, setOpenData] = useState<any>();
  const { loading: opening, onOpen } = useOpenBox((args: any) => {
    setOpenData(args);
    getUserBox?.();
  });
  const list = [...new Array(userRemainBox || 0)].slice(0, 21).map((_, i) => ({
  // const list = [...new Array(21)].slice(0, 21).map((_, i) => ({
    id: i + 1,
    status: "un_open"
  }));
  const sortedList = createPyramid(list);
  const [currentDailyAnimation, setCurrentDailyAnimation] = useState<any>('show');
  const currentDailyTimer = useRef<any>();
  const currentDailyTimerTrigger = useRef<any>();

  const dailyQuest = useMemo(() => {
    if (!questList || !currentUTCZeroTimestamp || !questList.length) return [];
    return questList.filter((it) => {
      return getUTCTimestamp((it.timestamp || 0) * 1000) === currentUTCZeroTimestamp;
    }) || [];
  }, [currentUTCZeroTimestamp, questList]);
  const dailyQuestCounts = useMemo(() => {
    if (!dailyQuest || !dailyQuest.length) return { total_box: 0, box: 0, completed: false };
    const total_box = dailyQuest.map((it) => it.total_box || 0).reduce((a, b) => a + b);
    const box = dailyQuest.map((it) => it.box || 0).reduce((a, b) => a + b);
    return {
      total_box,
      box,
      completed: Big(total_box).gte(box),
    };
  }, [dailyQuest]);

  const followXVisited = useMemo(() => {
    return getQuestVisited?.(followXQuest?.id);
  }, [questVisited, followXQuest]);

  const handleFollowX = () => {
    handleQuest?.(followXQuest);
  };

  const handleFollowXCheck = () => {
    handleQuestCheck?.(followXQuest);
  };

  const handleReloadYourBox = () => {
    getUserBox?.();
  };

  const handleDailyQuestCheck = async () => {
    if (dailyChecking) return;
    setDailyChecking(true);
    const checks = dailyQuest.map((it) => {
      if (getQuestVisited?.(it.id)) {
        return requestCheck?.(it);
      }
      return new Promise((resolve) => {
        const _timer = setTimeout(() => {
          clearTimeout(_timer);
          resolve({ data: { total_box: 0 } });
        }, 600);
      });
    });
    const res: any = await Promise.all(checks);
    const values = res.map((_res: any, idx: number) => {
      const { total_box } = _res.data || {};
      return {
        total_box: total_box,
        completed: Big(total_box).gte(dailyQuest[idx].box || 0),
      };
    });
    handleQuestUpdate?.(dailyQuest, values);
    getUserBox?.();
    setDailyChecking(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(currentDailyTimer.current);
      clearTimeout(currentDailyTimerTrigger.current);
    };
  }, []);

  return (
    <div className="">
      <div className="flex justify-center items-center gap-[249px] mt-[20px] md:gap-[12px] md:items-start">
        <BoxTitle
          label={
            <>
              <div className="">Your Box</div>
              <button
                type="button"
                className="translate-y-[2.8px] translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain disabled:opacity-30 disabled:!cursor-not-allowed"
                onClick={handleReloadYourBox}
                disabled={activityInvalid}
              >
                <IconReload
                  className={`${
                    userBoxLoading ? "animate-rotate origin-[12px_12px]" : ""
                  }`}
                />
              </button>
            </>
          }
          value={userRemainBox || 0}
          total={userBox?.total_box || 0}
          valueClassName="translate-x-[-20px]"
          className="md:flex-1 md:w-0"
          childrenClassName="md:w-full md:pl-[10px]"
        >
          <div className="flex items-center gap-[18px] md:flex-col-reverse md:w-full">
            <Button
              className="!bg-black border-[#FFDC50] !text-[#FFDC50] whitespace-nowrap md:w-full md:!bg-transparent md:underline md:decoration-solid md:border-0 md:shadow-none md:h-[30px] md:leading-[30px]"
              loading={userInfoLoading}
              onClick={() => {
                if (!account) {
                  open({ view: 'Connect' });
                  return;
                }
                getUserInfo?.();
                setOpenType(3);
              }}
            >
              Check My Gift
            </Button>
            <Button
              onClick={() => {
                if (!account) {
                  open({ view: 'Connect' });
                  return;
                }
                setOpenType(2);
                onOpen(true);
              }}
              loading={openType === 2 && opening}
              className="relative whitespace-nowrap md:w-full"
              disabled={activityInvalid}
            >
              <div>Open 10 Boxes</div>
              <img
                src="/images/activity/christmas/star-your-box.svg"
                alt=""
                className="absolute left-[108px] top-[-40px] animate-blink w-[47px] h-[59px]"
              />
            </Button>
          </div>
        </BoxTitle>
        <BoxTitle
          label="Your $SNOWFLAKE"
          value={numberFormatter(snowflakeBalance, 2, true, { isShort: true })}
          loading={snowflakeBalanceLoading}
          valueClassName="md:mt-[9px]"
          className="flex flex-col items-center md:flex-1 md:w-0"
          childrenClassName="md:w-full md:pr-[10px]"
        >
          <Button
            onClick={() => {
              setShowSwapModal?.(true);
            }}
            addon="arrow"
            className="whitespace-nowrap md:w-full md:px-[0]"
          >
            Trade now
          </Button>
        </BoxTitle>
      </div>
      <div className={`relative h-[43vw] min-h-[800px] md:min-h-[150dvw] ${isMobile ? "bg-[url('/images/activity/christmas/bg-gift-box-mobile.svg')]" : "bg-[url('/images/activity/christmas/bg-gift-box.svg')]"} bg-no-repeat bg-cover bg-bottom`}>
        <Pyramid
          list={sortedList}
          onBoxClick={() => {
            onOpen(false);
            setOpenType(1);
          }}
          isMobile={isMobile}
          opening={opening}
          disabled={activityInvalid}
        />
        <div className="absolute flex flex-col items-center px-[24px] pt-[34px] left-[40px] bottom-[296px] w-[175px] h-[172px] bg-[url('/images/activity/christmas/bg-gift-follow.svg')] bg-no-repeat bg-cover bg-center md:scale-[0.71] md:left-0 md:bottom-0 md:origin-left">
          <div
            className="text-[16px] cursor-pointer text-black font-CherryBomb leading-[90%] font-[400] text-center"
            onClick={handleFollowX}
          >
            Follow <span className="underline decoration-solid">BeraTown</span>{' '}
            on X
          </div>
          <SocialTask
            className="mt-[7px]"
            onClick={handleFollowXCheck}
            complete={followXQuest?.completed}
            checking={followXQuest?.checking}
            disabled={!followXVisited || activityInvalid}
          >
            <div className="">
              {followXQuest?.total_box}/{followXQuest?.box} box
            </div>
          </SocialTask>
        </div>
        <div id="tour-id-5" className={`absolute right-[19px] bottom-[360px] w-[428px] md:w-[243px] h-[289px] md:h-[168px] ${isMobile ? "bg-[url('/images/activity/christmas/bg-gift-retweet-mobile.svg')]" : "bg-[url('/images/activity/christmas/bg-gift-retweet.svg')]"} bg-no-repeat bg-cover bg-center md:right-0 md:bottom-[38px]`}>
          <div className="absolute flex flex-col items-center gap-[13px] right-[57px] bottom-[44px] md:right-[20px] md:bottom-[25px] md:gap-[10px]">
            <div className="text-[18px] text-black font-CherryBomb leading-[90%] font-[400] text-center md:text-[14px] md:translate-y-[5px]">
              <div className="">
                Quest of
              </div>
              <button
                type="button"
                className="underline decoration-solid mt-[4px] text-[22px] leading-[90%] font-CherryBomb cursor-pointer disabled:opacity-50 disabled:!cursor-not-allowed md:mt-[0] md:text-[18px]"
                onClick={() => {
                  setDailyVisible(true);
                }}
                disabled={questLoading || !dailyQuest.length || activityInvalid}
              >
                {currentUTCString ? dateFns.format(new Date(currentUTCString), 'MM.dd') : '-.-'}
              </button>
            </div>
            <SocialTask
              className="md:scale-[0.72]"
              onClick={handleDailyQuestCheck}
              complete={dailyQuestCounts.completed}
              checking={dailyChecking}
              disabled={dailyChecking || questLoading || !dailyQuest.length || activityInvalid}
            >
              <div className="">
                {dailyQuestCounts.total_box} / {dailyQuestCounts.box} boxes
              </div>
            </SocialTask>
          </div>
          <motion.div
            className="absolute w-[136px] h-[107px] left-[50px] top-[-40px] flex flex-col-reverse items-end md:items-start md:left-[100px] md:top-[-45px]"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.6,
                },
              },
            }}
            initial="hidden"
            animate={currentDailyAnimation}
            onAnimationComplete={() => {
              if (currentDailyAnimation === 'show') {
                currentDailyTimer.current = setTimeout(() => {
                  setCurrentDailyAnimation('hidden');
                  currentDailyTimerTrigger.current = setTimeout(() => {
                    setCurrentDailyAnimation('show');
                  }, 1000);
                }, 3000);
              }
            }}
          >
            <motion.img
              src="/images/activity/christmas/bg-gift-retweet-pop-1.svg"
              alt=""
              className="w-[27px] h-[16px]"
              style={{
                x: isMobile ? 10 : -10,
              }}
              variants={bubbleVariants}
            />
            <motion.img
              src="/images/activity/christmas/bg-gift-retweet-pop-2.svg"
              alt=""
              className="w-[48px] h-[25px]"
              style={{
                x: isMobile ? 20 : -20,
              }}
              variants={bubbleVariants}
            />
            <motion.div
              className="font-CherryBomb text-black text-[18px] text-center pt-[7px] font-[400] leading-[120%] w-[142px] h-[72px] bg-[url('/images/activity/christmas/bg-gift-retweet-pop-3.svg')] bg-no-repeat bg-center bg-contain"
              variants={bubbleVariants}
            >
              Who’s a <br /> good bera?
            </motion.div>
          </motion.div>
        </div>
        <img
          src={`/images/activity/christmas/star-gift-box-1${isMobile ? '-mobile' : ''}.svg`}
          alt=""
          className="absolute right-[38vw] top-[60px] animate-blink md:right-[unset] md:left-[4.8dvw] md:top-[-5.3dvw]"
          style={{ animationDelay: '1', animationDuration: '8s' }}
        />
        <img
          src={`/images/activity/christmas/star-gift-box-2${isMobile ? '-mobile' : ''}.svg`}
          alt=""
          className="absolute left-[32vw] top-[123px] animate-blink md:left-[34.7dvw] md:top-[5.3dvw]"
          style={{ animationDelay: '0', animationDuration: '4s' }}
        />
        <img
          src={`/images/activity/christmas/star-gift-box-3${isMobile ? '-mobile' : ''}.svg`}
          alt=""
          className="absolute right-[24vw] top-[250px] animate-blink md:top-[8dvw] md:right-[29.3dvw]"
          style={{ animationDelay: '2', animationDuration: '12s' }}
        />
        <img
          src={`/images/activity/christmas/star-gift-box-4${isMobile ? '-mobile' : ''}.svg`}
          alt=""
          className="absolute right-[31vw] top-[260px] animate-blink md:top-[-2.7dvw] md:right-[14.7dvw]"
          style={{ animationDelay: '4', animationDuration: '6s' }}
        />
        <img
          src={`/images/activity/christmas/star-gift-box-5${isMobile ? '-mobile' : ''}.svg`}
          alt=""
          className="absolute left-[23vw] top-[500px] animate-blink md:top-[18.7dvw] md:left-[21.3dvw]"
          style={{ animationDelay: '1', animationDuration: '5s' }}
        />
      </div>
      {!!openData && openType === 1 && (
        <OpenModal
          open={openType === 1}
          onClose={() => {
            setOpenType(0);
            setOpenData(null);
          }}
          remainBox={userRemainBox}
          onOpen={onOpen}
          data={openData}
          loading={opening}
        />
      )}
      {!!openData && openType === 2 && (
        <OpenMultiModal
          open={openType === 2}
          onClose={() => {
            setOpenType(0);
            setOpenData(null);
          }}
          data={openData}
          loading={opening}
          onOpenSwapModal={() => {
            setShowSwapModal?.(true);
          }}
        />
      )}
      {userInfo && openType === 3 && (
        <UserPresentsModal
          open={openType === 3}
          onClose={() => {
            setOpenType(0);
          }}
          data={userInfo}
          loading={userInfoLoading}
        />
      )}
      <DailyQuest
        visible={dailyVisible}
        onClose={() => {
          setDailyVisible(false);
        }}
        list={dailyQuest}
      />
    </div>
  );
};

export default GiftBox;

const bubbleVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
