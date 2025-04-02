import clsx from 'clsx';

const SignpostBubble = (props: any) => {
  const { children, className, leftArrowY } = props;

  return (
    <div className={clsx("relative w-[304px] h-[186px] flex-shrink-0 bg-[#FFFDEB] border border-black shadow-[10px_10px_0px_rgba(0,0,0,0.25)] rounded-[20px] text-black font-CherryBomb text-[16px] font-normal leading-[120%] p-[15px_18px_20px_18px]", className)}>
      <img
        src="/images/home-earth/signpost-bubble-arrow.svg"
        alt=""
        className="absolute left-[-10px] top-[82px] w-[11px] h-[15px] pointer-events-none"
        style={leftArrowY ? {
          top: `${leftArrowY}px`,
        } : {}}
      />
      {children}
    </div>
  );
};

export default SignpostBubble;
