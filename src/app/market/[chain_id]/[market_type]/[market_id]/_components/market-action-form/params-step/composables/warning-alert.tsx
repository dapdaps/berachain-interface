import cn from 'clsx';
import React from "react";

export const WarningAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col rounded-lg bg-[#eb3c27] p-2 text-center text-sm font-light text-white",
        className
      )}
      {...props}
    />
  );
});