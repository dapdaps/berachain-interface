import Card from "@/components/card";
import LazyImage from "@/components/layz-image";
import Modal from "@/components/modal";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import Capsule from "./capsule";

const ResultModal = (props: any) => {
  const {
    className,
    open,
    onClose,
    market,
    inputMarket,
    leverage,
    liquidationPrice,
    txHash,
    inputAmount,
    debtAmount,
  } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      isMaskClose={false}
      isShowCloseIcon={false}
    >
      <Card className={clsx("!rounded-[20px] !w-[300px] md:!w-full p-[20px] text-[12px] text-[#D7D7D7] font-[500] leading-normal font-Syne", className)}>
        <div className="w-full p-[16px] rounded-t-[6px] bg-[#0f0f0f] pb-[60px] bg-[url('/images/belong/v2/bg-bar-green.png')] bg-no-repeat bg-center bg-cover">
          <div className="text-center">You received</div>
          <div className="flex items-center justify-center gap-[8px] mt-[32px]">
            <div className="shrink-0 flex items-center">
              {
                market?.underlyingTokens?.map((token: any, index: number) => (
                  <LazyImage
                    key={index}
                    src={token.icon}
                    width={32}
                    height={32}
                    containerClassName={clsx("w-[32px] h-[32px] shrink-0 rounded-full overflow-hidden", index > 0 && "ml-[-10px]")}
                  />
                ))
              }
            </div>
            <div className="text-[32px] text-white leading-[80%] font-[400] font-SpecialGothicExpandedOne">
              {numberFormatter(debtAmount, 2, true)}
            </div>
          </div>
        </div>
        <div className="w-full p-[16px] rounded-b-[6px] bg-[#0f0f0f] text-[#F8F8F8]">
          <div className="w-full h-[1px] bg-[#434041]" />
          <div className="py-[8px] flex justify-between items-center gap-[10px]">
            <div className="">Deposited</div>
            <div className="">
              {numberFormatter(inputAmount, 2, true)} {inputMarket?.symbol}
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#434041]" />
          <div className="py-[8px] flex justify-between items-center gap-[10px]">
            <div className="">Received</div>
            <div className="">
              {numberFormatter(debtAmount, 2, true)} {market?.underlyingTokens?.map((_token: any) => _token.symbol)?.join("-")}
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#434041]" />
          <div className="py-[8px] flex justify-between items-center gap-[10px]">
            <div className="">Leverage</div>
            <div className="">{leverage}x</div>
          </div>
          <div className="w-full h-[1px] bg-[#434041]" />
          <div className="py-[8px] flex justify-between items-center gap-[10px]">
            <div className="">Liquidation price</div>
            <div className="">
              {numberFormatter(liquidationPrice, 2, true, { isShort: true, isShortUppercase: true, prefix: "$" })}
            </div>
          </div>
        </div>
        <div className="w-full mt-[12px] grid grid-cols-2 gap-[4px]">
          <Capsule
            onClick={() => {
              window.open(`https://berascan.com/tx/${txHash}`);
              // onClose?.();
            }}
          >
            <div className="">Tx details</div>
            <div className="">&gt;</div>
          </Capsule>
          <Capsule
            onClick={() => {
              window.open("https://app.kodiak.finance/#/liquidity/pools/0x88c983bf3d4a9adcee14e1b4f1c446c4c5853ea3?farm=0x25acec3a1766a0d02d7c8e22f48533d32d7b311b&chain=berachain_mainnet");
              // onClose?.();
            }}
          >
            <div className="">Pool</div>
            <div className="">&gt;</div>
          </Capsule>
          <Capsule
            onClick={() => {
              window.open("https://app.beraborrow.com/den/manage/iBERA-wgBERA");
              // onClose?.();
            }}
            className="col-span-2"
          >
            <div className="">Position on Beraborrow</div>
            <div className="">&gt;</div>
          </Capsule>
        </div>
        <div className="w-full mt-[12px]">
          <button
            type="button"
            className="w-full h-[32px] border border-black bg-[#FFDC50] rounded-[6px] flex justify-center items-center gap-[5px] uppercase text-[14px] text-[#0F0F0F]"
            onClick={onClose}
          >
            close
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default ResultModal;
