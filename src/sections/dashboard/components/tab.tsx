import Image from 'next/image';

const DashboardTab = (props: Props) => {
  const { children, icon } = props;

  return (
    <div className='flex justify-center items-center gap-[6px] md:flex-col md:w-full md:gap-0 md:font-bold'>
      <div className='w-[24px] h-[28px] flex items-center'>
        <Image
          src={`/images/dashboard/${icon}`}
          alt=''
          width={24}
          height={28}
        />
      </div>
      <span className='whitespace-nowrap'>{children}</span>
    </div>
  );
};

export default DashboardTab;

interface Props {
  children: any;
  icon: string;
}
