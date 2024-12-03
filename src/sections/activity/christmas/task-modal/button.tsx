import BasicButton from "@/components/button";
import clsx from "clsx";

export default function Button({ children, className }: any) {
  return (
    <BasicButton
      type="primary"
      isOnlyLoading
      className={clsx(
        "flex justify-center items-center gap-[6px] w-[168px] h-[46px] shadow-shadow2 text-[16px] font-semibold",
        className
      )}
    >
      {children}
    </BasicButton>
  );
}
