import clsx from "clsx";
import "./index.css";
export default function Range({ value, onChange, style, className }: any) {
  return (
    <div
      style={style}
      className={clsx("range relative", className)}
    >
      <input
        type="range"
        value={Number(value)}
        onChange={onChange}
        className="appearance-none"
      />
      <div
        className={clsx(
          "absolute top-0 left-0 h-[8px] rounded-[16px] bg-[#ffdc50]"
        )}
        style={{ width: Number(value) + "%" }}
      />
    </div>
  );
}
