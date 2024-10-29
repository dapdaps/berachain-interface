const Offset = 20;

const Laptop = (props: Props) => {
  const { children, width, height, onClick } = props;
  return (
    <div
      className='relative z-[0] hidden lg:block'
      style={{
        width,
        height,
        left: 0,
        paddingTop: Offset
      }}
    >
      <div
        className='w-full flex justify-center items-center bg-[#E9E3B5] rounded-[20px] border border-black cursor-pointer'
        style={{
          paddingBottom: Offset * 1.5,
          height: height + Offset
        }}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
};

const Mobile = ({ children, active, onClick }: any) => {
  return (
    <div
      className={`hidden h-[56px] grow rounded-[16px] md:flex ${
        active && 'border border-black bg-[#FFDC50]'
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Tab = (props: Props) => {
  return (
    <>
      <Laptop {...props} />
      <Mobile {...props} />
    </>
  );
};

export default Tab;

interface Props {
  children: any;
  width: number;
  height: number;
  onClick(): void;
  active?: boolean;
}
