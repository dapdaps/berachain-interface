import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import CircleLoading from "@/components/circle-loading";

const DetailBex = (props: any) => {
  const {
    data,
    mintData,
    setShowAddModal,
    claiming,
    handleClaim,
    isInfraredBerps
  } = props;

  const handleMint = () => {
    setShowAddModal(true);
  };

  return (
    <div className="flex-1 pr-[24px] pl-[13px] h-[300px] bg-black/[0.06]">
      <div className="pt-[21px] pr-[2px] pb-[46px] pl-[17px]">
        <div className="mb-[21px] text-black font-Montserrat text-[18px] font-bold leading-[90%]">
          Your Position
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center">
              {data?.images[0] && (
                <img
                  src={data?.images[0]}
                  className="w-[30px] h-[30px] rounded-full"
                />
              )}
              {data?.images[1] && (
                <img
                  src={data?.images[1]}
                  className="ml-[-10px] w-[30px] h-[30px] rounded-full"
                />
              )}
            </div>
            <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
              {formatValueDecimal(data?.depositAmount ?? 0, "", 2, false, false)}{" "}
              {data?.initialData?.name || data?.tokens?.[0] || "iBGT"}
            </div>
          </div>

          {(mintData || isInfraredBerps) && (
            <div
              className="cursor-pointer flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50]"
              onClick={handleMint}
            >
              <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">
                Mint LP
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] bg-black/[0.15]" />
      <div className="pt-[19px] pl-[17px]">
        <div className="mb-[27px] text-black font-Montserrat text-[18px] font-bold leading-[90%]">
          Rewards
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[14px]">
            <div className="w-[32px] h-[32px] rounded-full">
              <img
                src={`/images/dapps/infrared/${data?.rewardSymbol.toLocaleLowerCase()}.svg`}
              />
            </div>
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
              {formatValueDecimal(data?.earned, "", 2)} {data?.rewardSymbol}
            </div>
          </div>
          {Big(data?.earned ?? 0).gt(0) && (
            <button
              disabled={claiming}
              className="cursor-pointer flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[18px] font-semibold leading-[90%] disabled:opacity-30"
              onClick={handleClaim}
            >
              {claiming ? <CircleLoading size={14} className="mr-3" /> : ""}{" "}
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailBex;
