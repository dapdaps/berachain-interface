import useIsMobile from '@/hooks/use-isMobile';
import clsx from 'clsx';

const Laptop = ({ children, className }: any) => {
  return (
    <div className={clsx('relative items-stretch translate-y-[1.5px] flex', className)}>
      {children}
    </div>
  );
};

const Mobile = ({ children, className }: any) => {
  return (
    <div className={clsx('w-[calc(100%-30px)] ml-[15px] h-[66px] rounded-[20px] border border-black bg-[#FFFDEB] p-[5px] hidden md:flex', className)}>
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
