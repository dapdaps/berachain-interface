import { useMemo } from 'react';

const Offset = 10;

const Tab = (props: Props) => {
  const { children, width, height, marginWidth, currentTabIndex, total, index, onClick } = props;

  const left = useMemo(() => {
    if (index > currentTabIndex) {
      if (currentTabIndex > 0) {
        return -marginWidth;
      }
      return -marginWidth / 2;
    }
    return 0;
  }, [currentTabIndex, marginWidth]);

  return (
    <div
      className="relative z-[0]"
      style={{
        width,
        height,
        left: left,
        paddingTop: Offset,
      }}
    >
      <div
        className="w-full flex justify-center items-center bg-[#E9E3B5] rounded-[20px] border border-black cursor-pointer"
        style={{
          paddingBottom: Offset * 2,
          height: height + Offset,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
};

export default Tab;

interface Props {
  children: any;
  width: number;
  height: number;
  marginWidth: number;
  currentTabIndex: number;
  total: number;
  index: number;

  onClick(): void;
}
