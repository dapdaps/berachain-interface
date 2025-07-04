import Modal from "@/components/modal";
import Button from "@/components/button";
import Loading from "@/components/circle-loading";
import useHaikuStore from "../../../stores/useHaikuStore";
import useSwapStore from "../../../stores/useSwapStores";
import { numberFormatter } from "@/utils/number-formatter";
import { getTokenLogo } from "@/sections/dashboard/utils";
import LogoIcon from "./icon";
import ButtonWithCheckingChain from "@/components/button/button-with-checking-chain";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { useHaiku } from "@/hooks/use-haiku";

export default function HaikuModal({ open, onSuccess }: any) {
  const haikuStore = useHaikuStore();
  const { input_token, output_token, haiku } = haikuStore.data;

  const {
    chainId,
    approved,
    approving,
    permitSignature,
    step,
    onConfirm,
    onApprove,
    loading,
    tokenBalance,
    tokenBalanceLoading,
    updateTokenBalance,
    outputAmount,
  } = useHaiku({
    input_token,
    output_token,
    haiku,
    from: "ai-chat",
    onSuccess: (data) => {
      onSuccess?.(data);
      haikuStore.set({
        modalOpen: false
      });
    }
  });
  const {
    setDefaultOutputCurrency,
    openSwapModal,
    closeSwapModal
  } = useSwapStore();

  return (
    <Modal
      open={open}
      onClose={() => {
        haikuStore.set({
          modalOpen: false
        });
      }}
    >
      <div className="w-[608px] rounded-[20px] border border-[#000000] bg-[#FFFDEB] px-[24px] pt-[16px] pb-[10px]">
        <div className="text-[24px] text-black font-semibold">
          Swap {input_token.symbol} to {output_token.symbol}
        </div>
        <div className="text-[14px] font-medium text-[#3D405A]">
          Follow these steps to swap
        </div>
        <div className="flex items-center gap-[16px] mt-[30px]">
          <div className="w-[255px] h-[70px] rounded-[16px] bg-black/10 px-[18px] py-[10px]">
            <div className="text-[20px] font-semibold">
              {input_token.amount}
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[5px]">
                <img
                  className="w-[24px] h-[24px] rounded-full"
                  src={getTokenLogo(input_token.symbol)}
                />
                <span className="text-[16px] font-semibold">
                  {input_token.symbol}
                </span>
              </div>
              <div className="text-black/50 text-[14px] font-medium flex gap-[4px] items-center">
                bal.{" "}
                {tokenBalanceLoading ? (
                  <Loading />
                ) : (
                  <span>{numberFormatter(tokenBalance, 2, true)}</span>
                )}
              </div>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="16"
            viewBox="0 0 21 16"
            fill="none"
          >
            <path
              d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V7ZM20.2071 8.70711C20.5976 8.31658 20.5976 7.68342 20.2071 7.29289L13.8431 0.928932C13.4526 0.538408 12.8195 0.538408 12.4289 0.928932C12.0384 1.31946 12.0384 1.95262 12.4289 2.34315L18.0858 8L12.4289 13.6569C12.0384 14.0474 12.0384 14.6805 12.4289 15.0711C12.8195 15.4616 13.4526 15.4616 13.8431 15.0711L20.2071 8.70711ZM1 8V9H19.5V8V7H1V8Z"
              fill="black"
            />
          </svg>
          <div className="w-[255px] h-[70px] rounded-[16px] bg-black/10 px-[18px] py-[10px]">
            <div className="text-[20px] font-semibold">{outputAmount}</div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[5px]">
                <img
                  className="w-[24px] h-[24px] rounded-full"
                  src={getTokenLogo(output_token.symbol)}
                />
                <span className="text-[16px] font-semibold">
                  {output_token.symbol}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-black/10 px-[18px] py-[20px] mt-[30px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] leading-[30px] text-center rounded-full border border-black">
                1
              </div>
              <div className="text-[18px] font-semibold">
                Confirm Token amount
              </div>
            </div>
            {step > 1 && (
              <div className="flex gap-[4px] items-center">
                <span className="text-[16px] font-semibold">
                  {input_token.amount} {input_token.symbol}
                </span>
                <CheckedIcon />
              </div>
            )}
            {step === 1 &&
              (chainId === DEFAULT_CHAIN_ID ? (
                <div className="text-[16px] font-semibold">
                  <span className="text-[#C84F27]">{input_token.amount}</span>{" "}
                  <span>{input_token.symbol}</span>
                </div>
              ) : (
                <ButtonWithCheckingChain
                  buttonProps={{
                    type: "primary",
                    className: "h-[40px] !text-[14px] font-semibold px-[0px]"
                  }}
                />
              ))}
          </div>
          <div className="flex justify-between items-center">
            {step === 1 && chainId === DEFAULT_CHAIN_ID ? (
              <span className="text-[#C84F27] text-[14px] font-semibold">
                You don’t have enough {input_token.symbol}, your balance{" "}
                {numberFormatter(tokenBalance, 2, true)}
              </span>
            ) : (
              <div />
            )}
            {step === 1 && chainId === DEFAULT_CHAIN_ID && (
              <Button
                type="primary"
                className="h-[40px] !text-[14px] font-semibold px-[0px]"
                onClick={() => {
                  setDefaultOutputCurrency(input_token);
                  openSwapModal(() => {
                    closeSwapModal();
                    updateTokenBalance();
                  });
                }}
                loading={tokenBalanceLoading}
                disabled={step !== 1 || tokenBalanceLoading}
              >
                Get {input_token.symbol}
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-[16px] bg-black/10 px-[18px] py-[20px] mt-[16px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] leading-[30px] text-center rounded-full border border-black">
                2
              </div>
              <div className="text-[18px] font-semibold">Approve in wallet</div>
            </div>

            {step > 2 ? (
              <div className="flex gap-[4px] items-center">
                <span className="text-[16px] font-semibold">Approved</span>
                <CheckedIcon />
              </div>
            ) : (
              <Button
                type="primary"
                className="w-[106px] h-[40px] !text-[14px] font-semibold px-[0px]"
                loading={approving}
                onClick={onApprove}
                disabled={step !== 2 || approving}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-[16px] bg-black/10 px-[18px] py-[20px] mt-[16px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] leading-[30px] text-center rounded-full border border-black">
                3
              </div>
              <div className="text-[18px] font-semibold">Confirm swaping</div>
            </div>
            <Button
              type="primary"
              className="w-[106px] h-[40px] !text-[14px] font-semibold px-[0px]"
              onClick={() => {
                onConfirm();
              }}
              loading={loading}
              disabled={step !== 3 || loading}
            >
              Confirm
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center gap-[4px] mt-[20px]">
          <div className="text-[12px]">Powered by</div>
          <LogoIcon />
          <div className="text-[12px]">Haiku</div>
        </div>
      </div>
    </Modal>
  );
}

const CheckedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="10" cy="10" r="10" fill="#7EA82B" />
      <path
        d="M5 9.49935L8.33333 12.9994L14.5 6.83203"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
