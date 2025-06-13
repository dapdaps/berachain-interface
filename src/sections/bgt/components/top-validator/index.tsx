import { formatValueDecimal } from "@/utils/balance";
import { formatLongText } from "@/utils/utils";
import Big from "big.js";

export default function TopValidator({
  validator,
  handleValidator
}: {
  validator: any;
  handleValidator: (validator: any) => void;
}) {
  return (
    <div
      className="cursor-pointer flex items-center justify-between w-[380px] min-h-[34px] py-[5px] pr-[18px] pl-[5px] border border-[#373A53] bg-[#FFFDEB] rounded-[18px]"
      onClick={() => handleValidator(validator)}
    >
      <div className="flex items-center">
        <div className="w-[26px] h-[26px] rounded-full overflow-hidden">
          <img
            onError={(event) => {
              const target = event.currentTarget;
              const errorImage = target.getAttribute("errorImage") as string;
              target.setAttribute("src", errorImage);
            }}
            // @ts-ignore
            errorImage="https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"
            src={
              validator?.metadata?.logoURI ??
              "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"
            }
            alt={validator?.metadata?.name}
          />
        </div>
        <div className="truncate ml-[7px] mr-[10px] text-black  max-w-[230px] font-Montserrat text-[16px] font-semibold">
          {validator?.metadata?.name || formatLongText(validator?.pubkey, 4, 4)}
        </div>
        <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">
          BGT/Year:{" "}
          {formatValueDecimal(
            Big(validator?.dynamicData?.lastDayDistributedBGTAmount)
              .times(360)
              .toFixed(),
            "",
            2,
            true
          )}
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
      >
        <path
          d="M1 11L6 6L1 1"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
}
