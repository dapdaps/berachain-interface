import Label from "../../components/label";
import { balanceShortFormated } from "@/utils/balance";
import Timer from "./timer";
import clsx from "clsx";
import useData from "../../hooks/use-data";

const TotalItem = ({ title, subTitle, type, onClick = () => {} }: any) => {
  return (
    <Label className="w-[180px] h-[68px] text-center md:w-[120px] md:h-[42px]">
      <div className="text-[14px] font-SquaredPixel md:text-[10px]">
        {title}
      </div>
      <div
        className={clsx(
          "text-[22px] font-SquaredPixel mt-[-4px] md:text-[16px]",
          type === "dappers" && "underline decoration-dashed cursor-pointer"
        )}
        onClick={onClick}
      >
        {subTitle}
      </div>
    </Label>
  );
};

export default function Total({ info, onOpenModal }: any) {
  const { currentRound } = useData();
  return (
    <div className="flex justify-center mt-[30px] md:mt-[14px] items-center gap-[30px] md:gap-[6px]">
      <div className="md:hidden">
        <Timer />
      </div>
      <TotalItem
        title="Total Dapped"
        subTitle={`$${balanceShortFormated(info?.totalDapped, 2)}`}
      />
      <TotalItem
        title="Total rewards"
        subTitle={`$${balanceShortFormated(info?.totalRewards, 2)}`}
      />
      <TotalItem
        title="Total Dappers"
        subTitle={currentRound.total_dappers}
        type="dappers"
        onClick={() => {
          onOpenModal(11);
        }}
      />
    </div>
  );
}
