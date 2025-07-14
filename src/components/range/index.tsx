import clsx from "clsx";
import { useDebounceFn } from "ahooks";
import "./index.css";
import { useEffect, useState } from "react";

export default function Range({ value, onChange, style, className, debounceWait = 1000, color = "#ffdc50", inputClassName, activeBarClassName }: any) {
  const [inputValue, setInputValue] = useState(value);

  const { run: onRangeChange, cancel: cancelRangeChange } = useDebounceFn(onChange, { wait: debounceWait });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      cancelRangeChange();
    };
  }, []);

  return (
    <div
      style={style}
      className={clsx("range relative", className)}
    >
      <input
        type="range"
        value={inputValue}
        onChange={(e) => {
          if (debounceWait <= 0) {
            onChange(e);
          } else {
            onRangeChange(e);
          }
          setInputValue(e.target.value);
        }}
        className={clsx("appearance-none", inputClassName)}
      />
      <div
        className={clsx(
          "absolute top-0 left-0 h-[8px] rounded-[16px] bg-[#ffdc50]",
          activeBarClassName
        )}
        style={{ width: inputValue + "%", background: color }}
      />
    </div>
  );
}
