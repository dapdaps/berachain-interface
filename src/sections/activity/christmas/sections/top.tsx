import Moon from "@/sections/activity/christmas/components/moon";

const Top = (props: any) => {
  const { children, onOpenRules } = props;

  return (
    <div className="relative">
      <div className="w-full absolute left-0 top-[-260px] h-[334px] md:h-[115px] flex justify-center items-center md:top-[-30px]">
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
              src="/images/activity/christmas/star-left-top.svg"
              alt=""
              className="absolute -left-[110px] -top-[40px] md:left-[-60px] md:top-[-70px] animate-blink"
              style={{ animationDelay: "0", animationDuration: "7s" }}
            />
            <img
              src="/images/activity/christmas/star-left-bot.svg"
              alt=""
              className="absolute -left-[20px] bottom-[55px] md:left-0 animate-blink"
              style={{ animationDelay: '2s', animationDuration: '3s' }}
            />
            <img
              src="/images/activity/christmas/star-center-top.svg"
              alt=""
              className="absolute left-[160px] bottom-[155px] md:left-[100px] md:top-[-20px] animate-blink"
              style={{ animationDelay: '0', animationDuration: "10s" }}
            />
            <img
              src="/images/activity/christmas/star-right-top.svg"
              alt=""
              className="absolute right-[80px] bottom-[120px] md:top-0 animate-blink"
              style={{ animationDelay: "1s", animationDuration: "8s" }}
            />
            <img
              src="/images/activity/christmas/star-right-bot.svg"
              alt=""
              className="absolute -right-[70px] bottom-[10px] md:right-[-15px] md:top-[10px] animate-blink"
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
