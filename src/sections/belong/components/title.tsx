import clsx from "clsx";

const BelongTitle = (props: any) => {
  const { className, style, children } = props;

  return (
    <div className={clsx("uppercase text-center text-[#FFAF0C] text-[36px] md:text-[26px] font-[400] [text-shadow:0px_4px_0px_#471C1C] font-CherryBomb leading-[80%] mt-[4px] text-stroke-1-4b371f", className)} style={style}>
      {children}
    </div>
  );
};

export default BelongTitle;
