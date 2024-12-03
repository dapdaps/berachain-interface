import IconReload from '@public/images/home/christmas/icon-reload.svg';
import BoxTitle from '@/sections/activity/christmas/components/box-title';
import Button from '@/sections/activity/christmas/components/button';

const GiftBox = () => {
  return (
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
            onClick={() => {}}
          >
            Check My Gift
          </Button>
          <Button
            onClick={() => {}}
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
          onClick={() => {}}
          addon="arrow"
        >
          Trade now
        </Button>
      </BoxTitle>
    </div>
  );
};

export default GiftBox;
