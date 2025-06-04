import useIsMobile from '@/hooks/use-isMobile';
import clsx from 'clsx';

const Offset = 20;

const Laptop = (props: any) => {
  const { children, width, height, onClick, disabled = false, post } = props;
  return (
    <div
      className='relative z-[0]'
      style={{
        width,
        height,
        left: 0,
        paddingTop: Offset
      }}
    >
      <div
        className={clsx(
          'w-full flex justify-center items-center rounded-[20px] md:text-[15px] md:rounded-[16px] border',
          disabled ? '!cursor-not-allowed' : 'cursor-pointer',
          disabled ? 'text-[#b3b1a4]' : '',
          disabled ? 'border-[#373A53]' : 'border-black',
          disabled ? 'bg-[#f0eede]' : 'bg-[#E9E3B5]',
        )}
        style={{
          paddingBottom: Offset * 1.5,
          height: height + Offset,
        }}
        onClick={!disabled && onClick}
      >
        {children}
        {
          post && (<span className='bg-[#FFDC50] font-bold rounded-[10px] text-black py-[2px] px-[4px] font-Montserrat text-[10px] mb-[10px]'>{post}</span>)
        }
      </div>
    </div>
  );
};

const Mobile = ({ children, active, onClick, disabled }: any) => {
  return (
    <div
      className={`flex-1 hidden h-[56px] grow rounded-[16px] md:flex ${
        active && 'border border-black bg-[#FFDC50]'
      } text-[15px] font-[700] leading-[13.5px] text-center font-Montserrat`}
      onClick={!disabled && onClick}
    >
      {children}
    </div>
  );
};

const Tab = (props: Props) => {
  const isMobile = useIsMobile();

  return isMobile && !props.isCard ? (
    <Mobile {...props} />
  ) : (
    <Laptop {...props} />
  );
};

export default Tab;

interface Props {
  children: any;
  onClick(): void;
  active?: boolean;
  isCard?: boolean;
  width: number;
  height: number;
  disabled?: boolean;
  post?: string;
}
