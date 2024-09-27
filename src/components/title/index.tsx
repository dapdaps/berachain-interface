const PageTitle = (props: Props) => {
  const { children, className, style } = props;

  return (
    <h2 className={`text-black text-[60px] font-[400] font-CherryBomb text-center leading-[1] ${className}`} style={style}>
      {children}
    </h2>
  );
};

export default PageTitle;

interface Props {
  children: any;
  className?: string;
  style?: React.CSSProperties;
}
