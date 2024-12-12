import SnowIcon from "../present-icons/icon-snow";
import { formatThousandsSeparator } from "@/utils/balance";

export const NftIcon = ({ src }: any) => {
  return (
    <div
      className="w-[100px] shrink-0 h-[100px] flex justify-center items-end rounded-[10px] border-2 border-black shadow-[0px_6px_0px_0px_rgba(0, 0, 0, 0.25)] bg-center bg-no-repeat bg-contain"
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
};

export const ItemIcon = ({ src }: any) => {
  return (
    <div
      className="w-[100px] shrink-0 h-[100px] flex justify-center items-center bg-[#FFA3A3] rounded-[10px] border-2 border-black shadow-[0px_6px_0px_0px_rgba(0, 0, 0, 0.25)] bg-center bg-no-repeat bg-contain"
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
};

export const TokenIcon = ({ amount }: any) => {
  return (
    <div className="w-[100px] shrink-0 h-[100px] flex flex-col justify-center items-center bg-[#B9D9FF] rounded-[10px] border-2 border-black shadow-[0px_6px_0px_0px_rgba(0, 0, 0, 0.25)]">
      <SnowIcon className="w-[36px] h-[36px]" />
      <div className="font-CherryBomb text-[18px]">
        {formatThousandsSeparator(amount)}
      </div>
    </div>
  );
};
