import Moon from "@/sections/activity/christmas/components/moon";
import { useContext } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';

const Top = (props: any) => {
  const { children, onOpenRules } = props;

  const { isMobile } = useContext(ChristmasContext);

  return (
    <div className="relative">
      <div className="w-full absolute left-0 top-[-260px] h-[334px] md:h-[115px] flex justify-center items-center md:top-[-30px] pointer-events-none">
        <Moon />
      </div>
      <div className="pt-[90px] md:pt-[117px] w-full h-[418px] md:h-[300px] bg-[url('/images/activity/christmas/bg-cloud.svg')] bg-no-repeat bg-cover bg-top md:bg-contain">
        <div className="flex flex-col items-center gap-[0px]">
          <div className="relative w-[617px] h-[210px] md:w-full md:h-auto md:scale-[0.75]">
            <button
              onClick={() => {
                onOpenRules();
              }}
              className="absolute right-[20px] top-[55px] md:top-[20px] w-[68px] h-[32px] rounded-[20px] border border-black bg-[#B5956E] text-[#FFF5A9] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset]"
            >
              Rules
            </button>
            <img
              src="/images/activity/christmas/title.svg"
              alt=""
              className="w-[617px] h-[210px] md:w-full md:h-auto"
            />
            <img
              src="/images/activity/christmas/title-circle-left.svg"
              alt=""
              className="absolute left-[130px] bottom-[100px] animate-blink"
              style={{ animationDelay: "2s", animationDuration: "5s" }}
            />
            <img
              src="/images/activity/christmas/title-circle-right.svg"
              alt=""
              className="absolute right-[185px] bottom-[85px] animate-blink"
              style={{ animationDelay: "0", animationDuration: "8s" }}
            />
            <img
              src={`/images/activity/christmas/star-left-top${isMobile ? '-mobile' : ''}.svg`}
              alt=""
              className="absolute -left-[110px] -top-[40px] md:left-[-20px] md:top-[-70px] animate-blink"
              style={{ animationDelay: "0", animationDuration: "7s" }}
            />
            <img
              src={`/images/activity/christmas/star-left-bot${isMobile ? '-mobile' : ''}.svg`}
              alt=""
              className="absolute -left-[20px] bottom-[55px] md:left-[20px] animate-blink"
              style={{ animationDelay: '2s', animationDuration: '3s' }}
            />
            <img
              src={`/images/activity/christmas/star-center-top${isMobile ? '-mobile' : ''}.svg`}
              alt=""
              className="absolute left-[160px] bottom-[155px] md:left-[120px] md:top-[-10px] animate-blink"
              style={{ animationDelay: '0', animationDuration: "10s" }}
            />
            <img
              src={`/images/activity/christmas/star-right-top${isMobile ? '-mobile' : ''}.svg`}
              alt=""
              className="absolute right-[82px] bottom-[115px] md:top-0 animate-blink"
              style={{ animationDelay: "1s", animationDuration: "8s" }}
            />
            <img
              src={`/images/activity/christmas/star-right-bot${isMobile ? '-mobile' : ''}.svg`}
              alt=""
              className="absolute -right-[70px] bottom-[10px] md:right-[-5px] md:top-[40px] animate-blink"
              style={{ animationDelay: "5s", animationDuration: "5s" }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Top;
