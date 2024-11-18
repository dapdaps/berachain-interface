import Item from "../item";

const TotalItem = ({ title, subTitle }: any) => {
  return (
    <Item className="w-[180px] h-[68px] text-center">
      <div className="text-[14px] font-SquaredPixel">{title}</div>
      <div className="text-[22px] font-SquaredPixel mt-[-4px]">{subTitle}</div>
    </Item>
  );
};

export default function Total() {
  return (
    <div className="flex justify-center mt-[30px] items-center gap-[30px]">
      <TotalItem title="Total Dapped" subTitle="$320.56K" />
      <TotalItem title="Total rewards" subTitle="$320.56K" />
      <TotalItem title="Total Dappers" subTitle="$320.56K" />
    </div>
  );
}
