const Category = (props: Props) => {
  const { children, style, className } = props;

  return (
    <span
      style={style}
      className={`h-[22px] lending-[20px] px-[6px] text-center rounded-[8px] border border-[#373A53] bg-[#FFFDEB] text-[#3D405A] text-[14px] font-[500] ${className}`}>
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
