import IconReload from '@public/images/home/christmas/icon-reload.svg';
import BoxTitle from '@/sections/activity/christmas/components/box-title';
import Button from '@/sections/activity/christmas/components/button';
import SocialTask from '@/sections/activity/christmas/components/social-task';
import Pyramid, { createPyramid } from '@/sections/activity/christmas/components/pyramid';
import { useContext, useMemo } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';

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
    currentTimestamp,
  } = useContext(ChristmasContext);
  const list = [...new Array(userInfo?.total_box || 0)].map((_, i) => ({
    id: i + 1,
    status: 'un_open',
  }));
  const sortedList = createPyramid(list);

  const todayQuest = useMemo(() => {
    if (!questList || !currentTimestamp || !questList.length) return void 0;
    return questList.find((it) => it.timestamp === currentTimestamp);
  }, [currentTimestamp, questList]);

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
          label={(
            <>
              <div className="">Your Box</div>
              <button
                type="button"
                className="translate-y-[2.8px] translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain"
                onClick={handleReloadYourBox}
              >
                <IconReload className={`${userInfoLoading ? 'animate-rotate origin-[12px_12px]' : ''}`} />
              </button>
            </>
          )}
          value={userInfo?.used_box || 0}
          total={userInfo?.total_box || 0}
          valueClassName="translate-x-[-20px]"
        >
          <div className="flex items-center gap-[18px]">
            <Button
              type="black"
              onClick={() => {
                getUserInfo?.();
              }}
            >
              Check My Gift
            </Button>
            <Button
              onClick={() => {
              }}
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
          label="Your $Snowflake"
          value={userInfo?.total_token || 0}
        >
          <Button
            onClick={() => {
            }}
            addon="arrow"
          >
            Trade now
          </Button>
        </BoxTitle>
      </div>
      <div className="relative h-[800px] bg-[url('/images/activity/christmas/bg-gift-box.svg')] bg-no-repeat bg-cover bg-bottom">
        <Pyramid list={sortedList} />
        <div className="absolute flex flex-col items-center px-[24px] pt-[34px] left-[40px] bottom-[296px] w-[175px] h-[172px] bg-[url('/images/activity/christmas/bg-gift-follow.svg')] bg-no-repeat bg-cover bg-center">
          <div
            className="text-[16px] cursor-pointer text-black font-CherryBomb leading-[90%] font-[400] text-center"
            onClick={handleFollowX}
          >
            Follow <span className="underline decoration-solid">BeraTown</span> on X
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
    </div>
  );
};

export default GiftBox;
