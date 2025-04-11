const Category = (props: Props) => {
  const { children, style, className } = props;

  return (
    <span
      style={style}
      className={`h-[22px] md:h-[20px] lending-[20px] md:leading-[18px] px-[6px] md:px-[2px] text-center rounded-[8px] md:rounded-[6px] border border-[#373A53] bg-[#FFFDEB] text-[#3D405A] text-[14px] md:text-[12px] font-[500] ${className}`}>
      {children}
    </span>
  );
};

export default Category;

interface Props {
  children: string;

  style?: React.CSSProperties;
  className?: string;
}
