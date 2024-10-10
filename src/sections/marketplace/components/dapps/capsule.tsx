const Capsule = (props: Props) => {
  const { children, className, style } = props;

  return (
    <div
      className={`flex justify-center items-center px-[10px] text-black text-[14px] font-[500] h-[24px] rounded-full bg-white border border-[#373A53] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Capsule;

interface Props {
  children: any;
  style?: React.CSSProperties;
  className?: string;
}
