import IconReload from '@public/images/home/christmas/icon-reload.svg';
import BoxTitle from '@/sections/activity/christmas/components/box-title';
import Button from '@/sections/activity/christmas/components/button';
import SocialTask from '@/sections/activity/christmas/components/social-task';
import Pyramid, { createPyramid } from '@/sections/activity/christmas/components/pyramid';

const GiftBox = () => {
  const list = [...new Array(21)].map((_, i) => ({
    id: i + 1,
    status: i % 5 === 0 ? 'opened' : 'un_open',
  }));
  const sortedList = createPyramid(list);

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
              >
                <IconReload className="animate-rotate origin-[12px_12px]" />
              </button>
            </>
          )}
          value={15}
          total={30}
          valueClassName="translate-x-[-20px]"
        >
          <div className="flex items-center gap-[18px]">
            <Button
              type="black"
              onClick={() => {
              }}
            >
              Check My Gift
            </Button>
            <Button
              onClick={() => {
              }}
            >
              <div>Open them all</div>
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
          value="6,023"
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
          <div className="text-[16px] text-black font-CherryBomb leading-[90%] font-[400] text-center">
            Follow <span className="underline decoration-solid">BeraTown</span> on X
          </div>
          <SocialTask className="mt-[7px]">
            <div className="">
              1/1 box
            </div>
          </SocialTask>
        </div>
        <div className="absolute right-[19px] bottom-[311px] w-[334px] h-[333px] bg-[url('/images/activity/christmas/bg-gift-retweet.svg')] bg-no-repeat bg-cover bg-center">
          <div className="absolute flex flex-col items-center gap-[13px] right-[15px] bottom-[-12px]">
            <div className="text-[16px] text-black font-CherryBomb leading-[90%] font-[400] text-center">
              <div className="opacity-50">
                Quest of <br /> the day
              </div>
              <div className="underline decoration-solid mt-[15px]">
                Retweet
              </div>
            </div>
            <SocialTask className="">
              <div className="">
                3 / 6 boxes
              </div>
            </SocialTask>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftBox;
