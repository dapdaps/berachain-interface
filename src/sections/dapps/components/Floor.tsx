import React from 'react';

const Floor = ({
  className = '',
  sticks = [],
  children,
  style,
}: Props) => {

  return (
    <div className={`${className} relative bg-[#527213] border-black border-[2px] rounded-[30px]`} style={style}>
      {
        sticks?.length > 0 && sticks.map((classname, idx) => (
          <div className={`${classname ?? ''} w-[24px] h-[6px] rounded-[16px] bg-[#7EA82B]`} key={idx} />
        ))
      }
      {children}
    </div>
  )
};

export default Floor;

interface Props {
  className?: string;
  sticks?: string[]; // className
  children?: React.ReactNode;
  style?: React.CSSProperties;
}