import useIsMobile from '@/hooks/use-isMobile';

const Laptop = ({ children }: any) => {
  return (
    <div className='relative items-stretch translate-y-[1.5px] flex'>
      {children}
    </div>
  );
};

const Mobile = ({ children }: any) => {
  return (
    <div className='w-[calc(100%-30px)] ml-[15px] h-[66px] rounded-[20px] border border-black bg-[#FFFDEB] p-[5px] hidden md:flex'>
      {children}
    </div>
  );
};

export default function TabsWrapper(props: any) {
  const isMobile = useIsMobile();
  return isMobile && !props.isCard ? (
    <Mobile {...props} />
  ) : (
    <Laptop {...props} />
  );
}
