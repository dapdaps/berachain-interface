import Item from "../../components/label";
import { balanceShortFormated } from "@/utils/balance";

const TotalItem = ({ title, subTitle }: any) => {
  return (
    <Item className="w-[180px] h-[68px] text-center md:w-[120px] md:h-[42px]">
      <div className="text-[14px] font-SquaredPixel md:text-[10px]">
        {title}
      </div>
      <div className="text-[22px] font-SquaredPixel mt-[-4px] md:text-[16px]">
        {subTitle}
      </div>
    </Item>
  );
};

export default function Total({ totalStaked }: any) {
  return (
    <div className="flex justify-center mt-[30px] md:mt-[14px] items-center gap-[30px] md:gap-[6px]">
      <TotalItem
        title="Total Dapped"
        subTitle={`$${balanceShortFormated(totalStaked, 2)}`}
      />
      <TotalItem title="Total rewards" subTitle="$320.56K" />
      <TotalItem title="Total Dappers" subTitle="$320.56K" />
    </div>
  );
}
