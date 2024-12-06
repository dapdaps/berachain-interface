import Moon from '@/sections/activity/christmas/components/moon';

const Top = (props: any) => {
  const { children } = props;

  return (
    <div className="relative">
      <div className="w-full absolute left-0 top-[-260px] h-[334px] flex justify-center items-center">
        <Moon />
      </div>
      <div className="pt-[35px] w-full h-[418px] bg-[url('/images/activity/christmas/bg-cloud.svg')] bg-no-repeat bg-cover bg-top">
        <div className="flex flex-col items-center gap-[0px]">
          <div className="relative w-[791px] h-[254px]">
            <img src="/images/activity/christmas/title.svg" alt="" width={791} height={254} />
            <img
              src="/images/activity/christmas/title-circle-left.svg"
              alt=""
              className="absolute left-[240px] bottom-[100px] animate-blink"
              style={{ animationDelay: '2s', animationDuration: '5s' }}
            />
            <img
              src="/images/activity/christmas/title-circle-right.svg"
              alt=""
              className="absolute right-[247px] bottom-[85px] animate-blink"
              style={{ animationDelay: '0', animationDuration: '8s' }}
            />
            <img
              src="/images/activity/christmas/star-left-top.svg"
              alt=""
              className="absolute left-0 top-0 animate-blink"
              style={{ animationDelay: '0', animationDuration: '7s' }}
            />
            <img
              src="/images/activity/christmas/star-left-bot.svg"
              alt=""
              className="absolute left-[80px] bottom-[55px] animate-blink"
              style={{ animationDelay: '2s', animationDuration: '3s' }}
            />
            <img
              src="/images/activity/christmas/star-center-top.svg"
              alt=""
              className="absolute left-[270px] bottom-[155px] animate-blink"
              style={{ animationDelay: '0', animationDuration: '10s' }}
            />
            <img
              src="/images/activity/christmas/star-right-top.svg"
              alt=""
              className="absolute right-[150px] bottom-[120px] animate-blink"
              style={{ animationDelay: '1s', animationDuration: '8s' }}
            />
            <img
              src="/images/activity/christmas/star-right-bot.svg"
              alt=""
              className="absolute right-[0px] bottom-[10px] animate-blink"
              style={{ animationDelay: '5s', animationDuration: '5s' }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Top;
