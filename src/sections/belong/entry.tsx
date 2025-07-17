import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const BelongEntry = (props: any) => {
  const { className } = props;

  const router = useRouter();

  return (
    <Popover
      content={(
        <img
          src="/images/belong/mascot-popup.png"
          alt=""
          className="w-[122px] h-[42px] object-contain object-center shrink-0 cursor-pointer pointer-events-none"
        />
      )}
      triggerContainerClassName={clsx("w-[147px] h-[207px] shrink-0 absolute bottom-0 right-[242px] cursor-pointer z-[4]", className)}
      placement={PopoverPlacement.Top}
      trigger={PopoverTrigger.Hover}
      closeDelayDuration={0}
    >
      <img
        src="/images/belong/mascot.png"
        alt=""
        className="w-full h-full object-contain object-center shrink-0 cursor-pointer"
        onClick={() => {
          router.push("/belong");
        }}
      />
    </Popover>
  );
};

export default BelongEntry;
