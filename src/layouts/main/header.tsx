'use client';

import Link from 'next/link';
import ConnectWallet from '@/components/connect-wallet';
import BGT from '@/components/bgt';

const MainLayoutHeader = (props: Props) => {
  const {
    className,
    style,
  } = props;

  const PaintFont = (paintProps: any) => {
    const {
      classname = '',
      wrapperClassName = '',
      children,
      width = 0,
      height = 0
    } = paintProps;
    return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={wrapperClassName}>
      <text
        style={{ paintOrder: 'stroke' }}
        className={`text-[20px] font-[400] stroke-[#000] stroke-[4px] ${classname}`}
        x="2"
        y="0"
        alignmentBaseline="text-before-edge"
        textAnchor="start"
      >
        {children}
      </text>
    </svg>)
  }

  const onDapLink = () => {
    console.log('link to DapDap');
    // window.open('', '_blank');
  }

  return (
    <header
      className={`w-full h-[68px] bg-[#96D6FF] stroke-black sticky font-CherryBomb top-0 z-10 ${className}`}
      style={style}
    >
      <div className="w-full h-full px-[40px] flex justify-between items-center">
        <div className='flex items-center gap-x-[40px]'>
          <Link
            href='/'
            className="flex items-center justify-center flex-col">
            <PaintFont
              classname="fill-[#9F9EFF] leading-[0.9]"
              width={60}
              height={26}
            >
              BERA
            </PaintFont>
            <PaintFont
              wrapperClassName="relative top-[-10px]"
              classname="fill-[#EBF479] leading-[0.8] relative top-[-10px]"
              width={72}
              height={26}
            >
              TOWN
            </PaintFont>
          </Link>
          <button
            onClick={onDapLink}
            className="hover:scale-[1.1] ease-in-out duration-300 before:content-[''] before:block before:absolute before:top-0 before:left-0 before:w-full before:h-[30px] before:rounded-[10px] before:bg-[#CCD55B] before:z-0 relative bg-[#EBF479] rounded-[10px] border border-solid border-black px-[16px] py-[9px] leading-none text-black text-center text-[16px] font-[400]">
            <span className="relative z-10">Go to DapDap</span>
          </button>
        </div>
        <div className="text-white flex items-center gap-x-[17px]">
          <BGT />
          <ConnectWallet />
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
