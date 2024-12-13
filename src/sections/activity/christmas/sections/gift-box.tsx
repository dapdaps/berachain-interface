import IconReload from "@public/images/home/christmas/icon-reload.svg";
import BoxTitle from "@/sections/activity/christmas/components/box-title";
import Button from "@/sections/activity/christmas/components/button";
import SocialTask from "@/sections/activity/christmas/components/social-task";
import Pyramid, {
  createPyramid
} from "@/sections/activity/christmas/components/pyramid";
import { useContext, useMemo, useState } from "react";
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
    snowflakeBalance,
    snowflakeBalanceLoading,
    userRemainBox,
    userInfoLoading,
    getUserInfo,
    currentDailyTimestamp,
    currentUTCZeroTimestamp,
    setShowSwapModal,
    requestCheck,
    handleQuestUpdate,
    isMobile
  } = useContext(ChristmasContext);
  const { open } = useAppKit();
  const { account } = useCustomAccount();

  const [openType, setOpenType] = useState(0);
  const [dailyVisible, setDailyVisible] = useState(false);
  const [dailyChecking, setDailyChecking] = useState(false);
  const [openData, setOpenData] = useState<any>();
  const { loading: opening, onOpen } = useOpenBox((args: any) => {
    setOpenData(args);
    getUserInfo?.();
  });
  const list = [...new Array(userRemainBox || 0)].slice(0, 21).map((_, i) => ({
  // const list = [...new Array(21)].slice(0, 21).map((_, i) => ({
    id: i + 1,
    status: "un_open"
  }));
  const sortedList = createPyramid(list);

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
    getUserInfo?.();
  };

  const handleDailyQuestCheck = async () => {
    if (dailyChecking) return;
    setDailyChecking(true);
    const checks = dailyQuest.map((it) => requestCheck?.(it));
    const res: any = await Promise.all(checks);
    const values = res.map((_res: any, idx: number) => {
      const { total_box } = _res.data || {};
      return {
        total_box: total_box,
        completed: Big(total_box).gte(dailyQuest[idx].box || 0),
      };
    });
    handleQuestUpdate?.(dailyQuest, values);
    getUserInfo?.();
    setDailyChecking(false);
  };

  return (
    <div className="">
      <div className="flex justify-center items-center gap-[249px] mt-[20px] md:gap-[12px] md:items-start">
        <BoxTitle
          label={
            <>
              <div className="">Your Box</div>
              <button
                type="button"
                className="translate-y-[2.8px] translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain"
                onClick={handleReloadYourBox}
              >
                <IconReload
                  className={`${
                    userInfoLoading ? "animate-rotate origin-[12px_12px]" : ""
                  }`}
                />
              </button>
            </>
          }
          value={userRemainBox || 0}
          total={userInfo?.total_box || 0}
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
      <div className={`relative h-[43vw] min-h-[800px] md:min-h-[135dvw] ${isMobile ? "bg-[url('/images/activity/christmas/bg-gift-box-mobile.svg')]" : "bg-[url('/images/activity/christmas/bg-gift-box.svg')]"} bg-no-repeat bg-cover bg-bottom`}>
        <Pyramid
          list={sortedList}
          onBoxClick={() => {
            onOpen(false);
            setOpenType(1);
          }}
          isMobile={isMobile}
          opening={opening}
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
            disabled={!followXVisited}
          >
            <div className="">
              {followXQuest?.total_box}/{followXQuest?.box} box
            </div>
          </SocialTask>
        </div>
        <div id="tour-id-5" className={`absolute right-[19px] bottom-[252px] w-[334px] md:w-[245px] h-[333px] md:h-[168px] ${isMobile ? "bg-[url('/images/activity/christmas/bg-gift-retweet-mobile.svg')]" : "bg-[url('/images/activity/christmas/bg-gift-retweet.svg')]"} bg-no-repeat bg-cover bg-center md:right-0 md:bottom-[38px]`}>
          <div className="absolute flex flex-col items-center gap-[13px] right-[15px] bottom-[-12px] md:right-0">
            <div className="text-[16px] text-black font-CherryBomb leading-[90%] font-[400] text-center md:text-[14px] md:translate-y-[5px]">
              <div className="opacity-50">
                Quest of <br /> the day
              </div>
              <button
                type="button"
                className="underline decoration-solid mt-[15px] cursor-pointer disabled:opacity-50 !disabled:cursor-not-allowed md:mt-[0]"
                onClick={() => {
                  setDailyVisible(true);
                }}
                disabled={questLoading || !dailyQuest.length}
              >
                Check
              </button>
            </div>
            <SocialTask
              className="md:pl-[4px]"
              onClick={handleDailyQuestCheck}
              complete={dailyQuestCounts.completed}
              checking={dailyChecking}
              disabled={dailyChecking || questLoading || !dailyQuest.length}
            >
              <div className="">
                {dailyQuestCounts.total_box} / {dailyQuestCounts.box} boxes
              </div>
            </SocialTask>
          </div>
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
