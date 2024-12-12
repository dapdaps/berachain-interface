const Prompt = (props: any) => {
  const { children, style, className } = props;

  return (
    <div style={style} className={`w-full flex p-[10px_10px_7px] justify-between gap-[8px] bg-[#FFFDEB] border border-black rounded-[12px] text-[14px] font-[500] text-black leading-normal ${className}`}>
      <img src="/images/icon-tips.svg" alt="" className="w-[15px] h-[15px] rounded-full" />
      {children}
    </div>
  );
};

export default Prompt;
