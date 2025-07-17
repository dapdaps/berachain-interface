import clsx from "clsx";

const Capsule = (props: any) => {
  const { className, children, ...restProps } = props;
  return (
    <div
      className={clsx("flex justify-center items-center gap-[8px] p-[8px] rounded-[6px] text-black/60 bg-[rgba(0,0,0,0.06)] cursor-pointer", className)}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default Capsule;
