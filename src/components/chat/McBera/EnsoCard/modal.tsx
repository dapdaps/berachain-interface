import Modal from "@/components/modal";
import Button from "@/components/button";
import Loading from "@/components/circle-loading";
import useEnsoStore from "../../stores/useEnsoStore";
import useSwapStore from "../../stores/useSwapStores";
import useTokenBalance from "@/hooks/use-token-balance";
import useApprove from "@/hooks/use-approve";
import { numberFormatter } from "@/utils/number-formatter";
import { useCallback, useMemo, useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";

export default function EnsoModal({ open, onSuccess }: any) {
  const ensoStore = useEnsoStore();
  const { setDefaultOutputCurrency, openSwapModal } = useSwapStore();
  const { addAction } = useAddAction("ai-chat");

  const { vault, enso, token, apr } = ensoStore.data;
  const {
    tokenBalance,
    isLoading,
    update: updateBalance
  } = useTokenBalance(token.address, token.decimals);
  const { approved, allowance, approve, approving } = useApprove({
    token,
    amount: token.amount,
    spender: enso.tx?.to
  });
  const [loading, setLoading] = useState(false);
  // const [result, setResult] = useState(0); // 1 for success, 2 for fail
  // const [txHash, setTxHash] = useState("");
  const { account, provider } = useAccount();

  const step = useMemo(() => {
    if (!tokenBalance) return 0;
    if (Big(tokenBalance).lt(token.amount)) {
      return 1;
    }
    return approved ? 3 : 2;
  }, [token, tokenBalance, approved]);

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const tx = await signer.sendTransaction(enso.tx, {
        gasLimit: Big(enso.gas).mul(1.5).toFixed(0)
      });
      const { status, transactionHash } = await tx.wait();
      // setTxHash(transactionHash);

      addAction({
        action: "Stake",
        token,
        amount: token.amount,
        template: "enso",
        add: false,
        status,
        transactionHash,
        sub_type: "Stake",
        tokens: [token],
        amounts: [token.amount],
        extra_data: {}
      });
      ensoStore.set({
        modalOpen: false
      });
      onSuccess({
        transactionHash,
        amount: token.amount,
        symbol: token.symbol,
        isSuccess: status === 1
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [enso, provider, account]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          ensoStore.set({
            modalOpen: false
          });
        }}
      >
        <div className="w-[608px] rounded-[20px] border border-[#000000] bg-[#FFFDEB] px-[24px] pt-[16px] pb-[10px]">
          <div className="text-[24px] text-black font-semibold">
            {vault.name} Vaults
          </div>
          <div className="text-[14px] font-medium text-[#3D405A]">
            Follow these steps to join the vault
          </div>
          <div className="flex items-center gap-[16px] mt-[30px]">
            <div className="w-[255px] h-[70px] rounded-[16px] bg-black/10 px-[18px] py-[10px]">
              <div className="text-[20px] font-semibold">{token.amount}</div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[5px]">
                  <img
                    className="w-[24px] h-[24px] rounded-full"
                    src={token.icon}
                  />
                  <span className="text-[16px] font-semibold">
                    {token.symbol}
                  </span>
                </div>
                <div className="text-black/50 text-[14px] font-medium flex gap-[4px] items-center">
                  bal.{" "}
                  {isLoading ? (
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
              <div className="text-[20px] font-bold text-[#7EA82B]">{apr}%</div>
              <div className="text-[16px] font-semibold truncate max-w-[220px]">
                {vault.name} Vault
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
              {step > 1 ? (
                <div className="flex gap-[4px] items-center">
                  <span className="text-[16px] font-semibold">
                    {token.amount} {token.symbol}
                  </span>
                  <CheckedIcon />
                </div>
              ) : (
                <div className="text-[16px] font-semibold">
                  <span className="text-[#C84F27]">{token.amount}</span>{" "}
                  <span>{token.symbol}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              {step === 1 ? (
                <span className="text-[#C84F27] text-[14px] font-semibold">
                  You don’t have enough {token.symbol}, your balance{" "}
                  {numberFormatter(tokenBalance, 2, true)}
                </span>
              ) : (
                <div />
              )}
              {step === 1 && (
                <Button
                  type="primary"
                  className="h-[40px] !text-[14px] font-semibold px-[0px]"
                  onClick={() => {
                    setDefaultOutputCurrency(token);
                    openSwapModal(() => {
                      ensoStore.set({
                        modalOpen: false
                      });
                      updateBalance();
                    });
                  }}
                  loading={isLoading}
                  disabled={step !== 1 || isLoading}
                >
                  Get {token.symbol}
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
                <div className="text-[18px] font-semibold">
                  Approve in wallet
                </div>
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
                  onClick={approve}
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
                <div className="text-[18px] font-semibold">Confirm staking</div>
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
            <img src="/images/enso-logo.webp" className="w-[72px] h-[12px]" />
          </div>
        </div>
      </Modal>
      {/* <Modal
        open={!!result}
        onClose={() => {
          setResult(0);
          ensoStore.set({
            modalOpen: false
          });
        }}
        isShowCloseIcon={false}
      >
        <div className="w-[304px] rounded-[20px] py-[20px] border border-[#000000] bg-[#FFFDEB] flex flex-col justify-center items-center">
          {result === 1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
            >
              <circle cx="28" cy="28" r="28" fill="#7EA82B" />
              <path
                d="M16.625 28.4375L24.0625 35.875L39.8125 20.125"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="34"
              viewBox="0 0 38 34"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.9597 1.28906C17.7295 -0.0442715 19.654 -0.0442702 20.4238 1.28906L37.1125 30.1948C37.8823 31.5281 36.9201 33.1948 35.3805 33.1948H2.00298C0.463382 33.1948 -0.498867 31.5281 0.270933 30.1948L16.9597 1.28906ZM16.9018 14.3999C16.9018 13.4113 17.7033 12.6099 18.6919 12.6099C19.6805 12.6099 20.4819 13.4113 20.4819 14.3999V21.5601C20.4819 22.5487 19.6805 23.3501 18.6919 23.3501C17.7033 23.3501 16.9018 22.5487 16.9018 21.5601V14.3999ZM18.6919 25.1397C17.7033 25.1397 16.9018 25.9411 16.9018 26.9297C16.9018 27.9183 17.7033 28.7197 18.6919 28.7197C19.6805 28.7197 20.4819 27.9183 20.4819 26.9297C20.4819 25.9411 19.6805 25.1397 18.6919 25.1397Z"
                fill="#FF547D"
              />
            </svg>
          )}
          <div className="text-[26px] font-semibold mt-[6px]">
            {token.amount}
          </div>
          <div className="flex items-center gap-[5px]">
            <img className="w-[24px] h-[24px] rounded-full" src={token.icon} />
            <span className="text-[16px] font-semibold">{token.symbol}</span>
          </div>
          <div className="text-[16px] font-semibold mt-[6px]">
            Staked {result === 1 ? "successfully!" : "failly!"}
          </div>
          <div className="mt-[50px] flex gap-[4px] items-center text-[14px] hover:under-line">
            <span>
              {" "}
              TX: {txHash.slice(0, 5)}...{txHash.slice(-4)}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
            >
              <path
                d="M4 1.5H1V11.5H11V8.5"
                stroke="#259DFF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M5.5 7L11.5 1M11.5 1H8M11.5 1V4.5"
                stroke="#259DFF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </Modal> */}
    </>
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
