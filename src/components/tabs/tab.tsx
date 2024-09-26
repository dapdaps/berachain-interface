const Offset = 20;

const Tab = (props: Props) => {
  const { children, width, height, onClick } = props;

  return (
    <div
      className="relative z-[0]"
      style={{
        width,
        height,
        left: 0,
        paddingTop: Offset,
      }}
    >
      <div
        className="w-full flex justify-center items-center bg-[#E9E3B5] rounded-[20px] border border-black cursor-pointer"
        style={{
          paddingBottom: Offset * 1.5,
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
