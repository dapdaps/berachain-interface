import { memo, useEffect, useRef, useState } from "react";
export default memo(function Slider({
  percentage,
  onChange,
  className
}: IProps) {
  const [sliderPercentage, setSliderPercentage] = useState<any>(percentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseMove = (event: any) => {
    if (!isDragging) return;
    const slider: any = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    let newPercentage = Math.round((x / width) * 100);
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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    setSliderPercentage(percentage);
  }, [percentage]);

  useEffect(() => {
    if (isDragging) {
      onChange && onChange(sliderPercentage);
    }
  }, [sliderPercentage, isDragging]);

  return (
    <div
      className={`cursor-pointer flex items-center w-[216px] h-[8px] rounded-[12px] bg-[#DFDCC4] ${className}`}
      ref={sliderRef}
      onMouseDown={handleMouseDown}
    >
      <div
        className="relative bg-[#FFDC50] h-full rounded-[12px]"
        style={{ width: sliderPercentage + "%" }}
      >
        <div className="absolute right-[-5px] top-[-5px] w-[18px] h-[18px] rounded-full bg-[#FFDC50] border border-black" />
      </div>
    </div>
  );
});
interface IProps {
  percentage: string;
  onChange: (percentage: string) => void;
  className?: string;
}
