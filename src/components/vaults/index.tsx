import clsx from "clsx";
import { useRouter } from "next/navigation";

const Vaults = (props: any) => {
  const router = useRouter();
  const { className, disabled } = props;

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "fixed block z-[1] left-[calc(50%_+_150px)] top-[230px] disabled:opacity-50 disabled:!cursor-not-allowed",
        className
      )}
      data-bp="1022-001-001"
      onClick={() => {
        router.push("/vaults");
      }}
    >
      <img
        src="/images/home-earth/vaults/entry.2x.png"
        alt=""
        className="animate-shake3 w-[232px] pointer-events-none"
        style={{
          animationDuration: "10s",
          transformOrigin: "center bottom",
          animationTimingFunction: "ease-in-out"
        }}
      />
    </button>
  );
};

export default Vaults;
