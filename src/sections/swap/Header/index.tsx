import Setting from "./Setting";

export default function Header({ showSetting, className, style, title }: any) {
  return (
    <div
      className={`h-[50px] flex justify-end items-center mt-[-20px] md:justify-between md:pt-[18px] md:pb-[12px] ${className}`}
      style={style}
    >
      <div className="text-[18px] font-bold	md:block">{title || "Swap"}</div>
      {showSetting && <Setting />}
    </div>
  );
}
