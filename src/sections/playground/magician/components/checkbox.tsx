import clsx from "clsx";
import { useEffect, useState } from "react";

const Checkbox = (props: any) => {
  const { value, onChange, checked, className } = props;

  const [checkedInner, setCheckedInner] = useState(checked);

  const handleChange = (_checked: boolean) => {
    setCheckedInner(_checked);
    onChange?.({
      value,
      checked: _checked,
    });
  };

  useEffect(() => {
    setCheckedInner(checked);
  }, [checked]);

  return (
    <button
      type="button"
      className={clsx(
        "w-[26px] h-[26px] rounded-full border-[2px] border-white shrink-0 flex justify-center items-center transition-all duration-300",
        checkedInner ? "bg-[#7EA82B]" : "bg-[#BC9549]",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        handleChange(!checkedInner);
      }}
    >
      {
        checkedInner && (
          <img
            src="/images/playground/magician/icon-check-white.png"
            alt=""
            className="w-[12px] h-[9px] object-center object-contain shrink-0"
          />
        )
      }
    </button>
  );
};

export default Checkbox;
