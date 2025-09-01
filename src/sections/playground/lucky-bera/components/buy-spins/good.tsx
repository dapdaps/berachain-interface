import LightingButton from "../lighting-button";

const SpinGood = (props: any) => {
  const { className, costToken } = props;

  return (
    <div
      className="w-[100px] h-[153px] flex flex-col items-center flex-shrink-0 rounded-[16px] border-[2px] border-[#D7C69D] bg-[#FFFAEA] text-[#BB7AFF] text-center font-CherryBomb text-[24px] font-normal leading-[100%] tracking-[2.4px] uppercase"
      style={{
        textShadow: '0 2px 0 #7940B4',
        WebkitTextStrokeWidth: '2px',
        WebkitTextStrokeColor: '#4B371F',
      }}
    >
      <div className="text-center flex justify-center items-end gap-[2px] rotate-[-6deg]">
        <div className="">50</div>
        <div
          className="text-[#F7F9EA] text-center font-CherryBomb text-[12px] font-normal leading-[100%] tracking-[1.2px] uppercase"
          style={{
            WebkitTextStrokeWidth: '2px',
            WebkitTextStrokeColor: '#4B371F',
          }}
        >
          +10%
        </div>
      </div>
      <img
        src="/images/playground/lucky-bera/icon-spins.png"
        alt=""
        className="w-[70px] h-[70px] shrink-0 object-center object-contain mt-[5px]"
      />
      <LightingButton
        outerClassName="w-full mt-auto !h-[48px]"
        className="flex-col !gap-[2px] whitespace-nowrap !leading-[100%]"
      >
        <div className="text-[10px] line-through [text-decoration-color:red] [text-decoration-thickness:2px]">
          10 {costToken.symbol}
        </div>
        <div className="flex justify-center items-center gap-[4px]">
          <img
            src={costToken.icon}
            alt=""
            className="w-[16px] h-[16px] rounded-full object-center object-contain"
          />
          <div className="">
            10
          </div>
        </div>
      </LightingButton>
    </div>
  );
};

export default SpinGood;
