import clsx from "clsx";
import { useDebounceFn } from "ahooks";
import "./index.css";
import { useEffect, useState } from "react";

export default function Range({ value, onChange, style, className, debounceWait = 1000 }: any) {
  const [inputValue, setInputValue] = useState(value);

  const { run: onRangeChange, cancel: cancelRangeChange } = useDebounceFn(onChange, { wait: debounceWait });

  useEffect(() => {
    setInputValue(Number(value));
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
          onRangeChange(e);
          setInputValue(e.target.value);
        }}
        className="appearance-none"
      />
      <div
        className={clsx(
          "absolute top-0 left-0 h-[8px] rounded-[16px] bg-[#ffdc50]"
        )}
        style={{ width: inputValue + "%" }}
      />
    </div>
  );
}
