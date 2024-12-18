const ProgressBar = (props: any) => {
  const { style, className } = props;

  return (
    <div style={style} className={`h-[10px] bg-black rounded-[5px] relative mt-[14px] ${className}`}>
      <div
        className="absolute w-0 h-full rounded-[5px] bg-[#FFDC50] left-0 top-0 z-[1]"
        style={{ width: 20 }}
      />
    </div>
  );
};

export default ProgressBar;
