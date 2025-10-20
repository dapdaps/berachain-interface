import Loading from "@/components/loading";
import clsx from "clsx";

const Button = (props: any) => {
  const { children, className, disabled, loading, ...restProps } = props;

  return (
    <button
      type="button"
      className={clsx("button disabled:opacity-50 bg-[#FFDC50] h-[40px] px-[15px] border border-black rounded-[10px] flex justify-center items-center gap-[5px] text-black text-[16px] font-[600]", className)}
      disabled={loading || disabled}
      {...restProps}
    >
      {
        loading && (
          <Loading size={16} />
        )
      }
      {children}
    </button>
  );
};

export default Button;
