import IconReload from "@public/images/home/christmas/icon-reload.svg";
import BoxTitle from "@/sections/activity/christmas/components/box-title";
import Button from "@/sections/activity/christmas/components/button";
import BasicButton from "../task-modal/button";
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

const GiftBox = () => {
  const {
    followXQuest,
    handleQuest,
    getQuestVisited,
    handleQuestCheck,
    questVisited,
    questList,
    userInfo,
    userInfoLoading,
    getUserInfo,
    currentDailyTimestamp,
    setShowSwapModal,
  } = useContext(ChristmasContext);

  const remainBox = useMemo(
    () => (userInfo?.total_box || 0) - (userInfo?.used_box || 0),
    [userInfo]
  );
  const [openType, setOpenType] = useState(0);
  const [openData, setOpenData] = useState<any>();
  const { loading: opening, onOpen } = useOpenBox((args: any) => {
    setOpenData(args);
    getUserInfo?.();
  });
  const list = [...new Array(remainBox || 0)]
    .slice(0, 21)
    .map((_, i) => ({
      id: i + 1,
      status: "un_open"
    }));
  const sortedList = createPyramid(list);

  const todayQuest = useMemo(() => {
    if (!questList || !currentDailyTimestamp || !questList.length) return void 0;
    return questList.find((it) => it.timestamp === currentDailyTimestamp);
  }, [currentDailyTimestamp, questList]);

  const followXVisited = useMemo(() => {
    return getQuestVisited?.(followXQuest?.id);
  }, [questVisited, followXQuest]);

  const todayQuestVisited = useMemo(() => {
    return getQuestVisited?.(todayQuest?.id);
  }, [questVisited, todayQuest]);

  const handleFollowX = () => {
    handleQuest?.(followXQuest);
  };

  const handleFollowXCheck = () => {
    handleQuestCheck?.(followXQuest);
  };

  const handleReloadYourBox = () => {
    getUserInfo?.();
  };

  const handleTodayQuest = () => {
    handleQuest?.(todayQuest);
  };

  const handleTodayQuestCheck = () => {
    handleQuestCheck?.(todayQuest);
  };

  return (
    <div className="">
      <div className="flex justify-center items-center gap-[249px] mt-[20px]">
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
          value={userInfo?.used_box || 0}
          total={userInfo?.total_box || 0}
          valueClassName="translate-x-[-20px]"
        >
          <div className="flex items-center gap-[18px]">
            <BasicButton
              className="!bg-black border-[#FFDC50] !text-[#FFDC50]"
              loading={userInfoLoading}
              onClick={() => {
                getUserInfo?.();
                setOpenType(3);
              }}
            >
              Check My Gift
            </BasicButton>
            <BasicButton
              onClick={() => {
                setOpenType(2);
                onOpen(true);
              }}
              loading={openType === 2 && opening}
              className="relative"
            >
              <div>Open 10 Boxes</div>
              <img
                src="/images/activity/christmas/star-your-box.svg"
                alt=""
                className="absolute left-[108px] top-[-40px] animate-blink w-[47px] h-[59px]"
              />
            </BasicButton>
          </div>
        </BoxTitle>
        <BoxTitle label="Your $Snowflake" value={userInfo?.total_token || 0}>
          <Button
            onClick={() => {
              setShowSwapModal?.(true);
            }}
            addon="arrow"
          >
            Trade now
          </Button>
        </BoxTitle>
      </div>
      <div className="relative h-[43vw] bg-[url('/images/activity/christmas/bg-gift-box.svg')] bg-no-repeat bg-cover bg-bottom">
        <Pyramid
          list={sortedList}
          onBoxClick={() => {
            onOpen(false);
            setOpenType(1);
          }}
        />
        <div className="absolute flex flex-col items-center px-[24px] pt-[34px] left-[40px] bottom-[296px] w-[175px] h-[172px] bg-[url('/images/activity/christmas/bg-gift-follow.svg')] bg-no-repeat bg-cover bg-center">
          <div
            className="text-[16px] cursor-pointer text-black font-CherryBomb leading-[90%] font-[400] text-center"
            onClick={handleFollowX}
          >
            Follow <span className="underline decoration-solid">BeraTown</span>{" "}
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
        <div className="absolute right-[19px] bottom-[311px] w-[334px] h-[333px] bg-[url('/images/activity/christmas/bg-gift-retweet.svg')] bg-no-repeat bg-cover bg-center">
          <div className="absolute flex flex-col items-center gap-[13px] right-[15px] bottom-[-12px]">
            <div className="text-[16px] text-black font-CherryBomb leading-[90%] font-[400] text-center">
              <div className="opacity-50">
                Quest of <br /> the day
              </div>
              <div
                className="underline decoration-solid mt-[15px] cursor-pointer"
                onClick={handleTodayQuest}
              >
                {todayQuest?.name}
              </div>
            </div>
            <SocialTask
              className=""
              onClick={handleTodayQuestCheck}
              complete={todayQuest?.completed}
              checking={todayQuest?.checking}
              disabled={!todayQuestVisited}
            >
              <div className="">
                {todayQuest?.total_box} / {todayQuest?.box} boxes
              </div>
            </SocialTask>
          </div>
        </div>
      </div>
      {!!openData && openType === 1 && (
        <OpenModal
          open={openType === 1}
          onClose={() => {
            setOpenType(0);
            setOpenData(null);
          }}
          remainBox={remainBox}
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
    </div>
  );
};

export default GiftBox;
