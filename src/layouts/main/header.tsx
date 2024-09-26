const MainLayoutHeader = (props: Props) => {
  const {
    className,
    style,
  } = props;

  return (
    <header
      className={`w-full h-[68px] bg-black ${className}`}
      style={style}
    >
      <div className="w-full h-full px-[40px] flex justify-between items-center">
        <div className="">
          <img src="https://assets.dapdap.net/images/logo.png" alt="" width={120} height={32} />
        </div>
        <div className="text-white">
          Berachain
        </div>
      </div>
    </header>
  );
};

export default MainLayoutHeader;

interface Props {
  className?: string;
  style?: React.CSSProperties;
}
