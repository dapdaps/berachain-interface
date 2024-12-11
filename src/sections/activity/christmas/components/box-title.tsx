const BoxTitle = (props: any) => {
  const { children, label, value, total, className, style, valueClassName, childrenClassName } = props;

  return (
    <div style={style} className={className}>
      <div className="flex flex-col items-center gap-[7px]">
        <div className="flex items-center gap-[13px] text-[26px] font-CherryBomb font-[400] text-white leading-[100%] md:text-[16px]">
          {label}
        </div>
        <div className={`text-white text-[26px] md:text-[18px] font-CherryBomb font-[400] flex items-center gap-[6px] leading-[100%] ${valueClassName}`}>
          {
            total ? (
              <>
                <div className="text-[36px] md:text-[26px]">{value}</div>
                <div className="">/</div>
                <div className="">{total}</div>
              </>
            ) : (
              <div className="text-[36px] md:text-[26px]">{value}</div>
            )
          }
        </div>
      </div>
      <div className={`mt-[20px] ${childrenClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default BoxTitle;
