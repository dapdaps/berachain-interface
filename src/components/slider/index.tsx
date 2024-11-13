import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";
export default memo(function Slider({
  percentage,
  ranges,
  rangeIndex,
  onChange
}: IProps) {

  const [sliderPercentage, setSliderPercentage] = useState(percentage)
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseMove = (event: any) => {
    if (!isDragging) return;
    const slider: any = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    let newPercentage: any = Math.round((x / width) * 100);
    newPercentage = Math.max(0, Math.min(100, newPercentage));
    setSliderPercentage(newPercentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    setSliderPercentage(percentage)
  }, [percentage])

  useEffect(() => {
    if (isDragging) {
      onChange && onChange(sliderPercentage)
    }
  }, [sliderPercentage, isDragging])

  return (
    <div className='flex items-center gap-[24px]'>
      {
        ranges?.length > 0 && (
          <div className='flex items-center gap-[8px]'>
            {
              ranges.map((range: number, index: number) => (
                <div
                  key={index}
                  className={clsx(
                    ['cursor-pointer w-[48px] h-[22px] flex items-center justify-center rounded-[6px] border border-[#373A53] text-black font-Montserrat text-[14px]',
                      index === rangeIndex ? 'bg-[#FFDC50]' : ""]
                  )}
                  onClick={() => {
                    onChange && onChange(range)
                  }}
                >{range === 100 ? 'Max' : range + '%'}</div>
              ))
            }
          </div>
        )
      }

      <div className='cursor-pointer flex items-center flex-1 h-[8px] rounded-[12px] bg-[#DFDCC4]' ref={sliderRef} onMouseDown={handleMouseDown}>
        <div className='relative bg-[#FFDC50] h-full rounded-[12px]' style={{ width: sliderPercentage + '%' }}>
          <div
            className='absolute right-[-5px] top-[-5px] w-[18px] h-[18px] rounded-full bg-[#FFDC50] border border-black'
          />
        </div>
      </div>
    </div>

  )
})
interface IProps {
  percentage: string;
  ranges?: number[];
  rangeIndex?: number;
  onChange: (percentage: string) => void
}