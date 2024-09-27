const ActiveTab = (props: Props) => {
  const { children, height, width, isLast, isFirst, className, style, marginWidth } = props;

  return (
    <div
      className={`relative z-[1] flex justify-between items-stretch ${className}`}
      style={{
        width: width + (isLast ? 11 : 0),
        height: height,
        ...style,
      }}
    >
      {
        isFirst ? (
          <div
            className="shrink-0 rounded-tl-[20px] border-t border-l border-black bg-[#FFFDEB]"
            style={{
              width: marginWidth,
              height: height,
            }}
          />
        ) : (
          <div
            className="bg-[url('/images/tabs/icon-tab-left.svg')] shrink-0"
            style={{
              width: marginWidth,
              height: height,
            }}
          />
        )
      }
      <div
        className="bg-[url('/images/tabs/icon-tab-bg.svg')] grow flex justify-center items-center"
        style={{
          height: height,
          paddingRight: isFirst ? marginWidth / 2 : 0,
        }}
      >
        {children}
      </div>
      {
        isLast ? (
          <div
            className="bg-[url('/images/tabs/icon-tab-right-last.svg')] shrink-0"
            style={{
              width: marginWidth,
              height: height,
            }}
          />
        ) : (
          <div
            className="bg-[url('/images/tabs/icon-tab-right.svg')] shrink-0"
            style={{
              width: marginWidth,
              height: height,
            }}
          />
        )
      }
    </div>
  );
};

export default ActiveTab;

interface Props {
  width: number;
  height: number;
  marginWidth: number;
  currentTabIndex: number;
  total: number;
  children: any;
  isLast?: boolean;
  isFirst?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
