import clsx from "clsx";
import Label from "./label";

export default function RoundLabel({
  title,
  subTitle,
  className,
  titleClassName,
  subTitleClassName,
  ...rest
}: any) {
  return (
    <Label
      className={clsx("w-[272px] h-[67px] text-white", className)}
      {...rest}
    >
      <div
        className={clsx(
          "text-[26px] font-SquaredPixel pl-[32px] mt-[-4px] md:text-[20px] md:pl-[16px]",
          titleClassName
        )}
        style={{
          textShadow: "2px 0px #000, -2px 0px #000, 0px -2px #000, 0px 2px #000"
        }}
      >
        {title}
      </div>
      {!!subTitle && (
        <div
          className={clsx(
            "text-[18px] font-SquaredPixel mt-[-8px] pl-[32px] md:mt-[4px] md:text-[14px] md:pl-[16px]",
            subTitleClassName
          )}
          style={{
            textShadow:
              "2px 0px #000, -2px 0px #000, 0px -2px #000, 0px 2px #000"
          }}
        >
          {subTitle}
        </div>
      )}
    </Label>
  );
}
