import Link from 'next/link';

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

const Logo = () => {
  return (
      <Link
        href='/'
        className="flex items-center justify-center flex-col"
      >
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
  )};

export default Logo;