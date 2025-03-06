import CircleLoading from "@/components/circle-loading";
import Popover, { PopoverPlacement } from "@/components/popover";
import { DEFAULT_CHAIN_ID } from "@/configs";
import DolomiteConfig from '@/configs/lending/dolomite';
import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import IbgtAmount from "@/sections/bgt/components/ibgt-amount";
import ActionPanel from "@/sections/Lending/components/action-panel";
import DolomiteData from "@/sections/Lending/datas/dolomite";
import { formatValueDecimal } from "@/utils/balance";
import { numberFormatter } from '@/utils/number-formatter';
import Big from "big.js";
import { useEffect, useMemo, useState } from "react";


function DolomiteButton({
  id,
  onSuccess
}: {
  id: string
}) {
  const { addAction } = useAddAction('dapp');
  const { basic, networks }: any = DolomiteConfig;
  const { account: address, provider, chainId } = useCustomAccount()
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>()
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const supplyTokens = useMemo(() => {
    if (!data) return null;
    const { markets } = data;
    const tokenList = Object.values(markets);
    return tokenList.map((it: any) => ({
      ...it,
      APR: it.lendAPR,
      APY: it.lendAPY,
      balance: it.balance,
      balanceShown: numberFormatter(it.balance, 4, true),
      walletBalance: it.walletBalance,
      walletBalanceShown: numberFormatter(it.walletBalance, 4, true),
    }))
  }, [data])

  const token = useMemo(() => supplyTokens?.find(supplyToken => supplyToken?.symbol === id) ?? null, supplyTokens)

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    setLoading(isChainSupported);
  }, [isChainSupported]);

  return (
    <>
      {
        token && (
          <Popover
            placement={PopoverPlacement.BottomRight}
            content={(
              <ActionPanel
                title="Deposit"
                actionText="Deposit"
                placeholder="0.00"
                token={token}
                CHAIN_ID={DEFAULT_CHAIN_ID}
                onSuccess={() => {
                  setLoading(true)
                  onSuccess?.()
                }}
                addAction={addAction}
              />
            )}
          >
            <div
              className="cursor-pointer flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50]"
            >
              <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">
                Mint Token
              </span>
            </div>
          </Popover>
        )
      }
      <DolomiteData
        {...networks[DEFAULT_CHAIN_ID + '']}
        {...basic}
        chainId={chainId}
        update={loading}
        account={address}
        provider={provider}
        onLoad={(res: any) => {
          console.log('dolomite data res: %o', res);
          if (res?.markets) {
            delete res.markets['0x6969696969696969696969696969696969696969'];
            delete res.markets['native'];
          }
          setData(res);
          setLoading(false);
        }}
      />
    </>

  )
}
const DetailBex = (props: any) => {
  const {
    data,
    mintData,
    setShowAddModal,
    claiming,
    handleClaim,
    isInfraredBerps,
    onRefresh
  } = props;

  const protocol = data?.initialData?.protocol?.id;
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
            <div className="flex flex-col gap-[4px]">
              <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
                {data?.id || data?.tokens?.[0] || "iBGT"}
              </div>

              {/* <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
                {formatValueDecimal(data?.depositAmount ?? 0, "", 2, false, false)}
              </div> */}
              <IbgtAmount className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]" usdAmount={data?.usdDepositAmount} amount={data?.depositAmount} />
            </div>

          </div>
          {
            protocol === "dolomite" && (
              <DolomiteButton id={data?.id} onSuccess={onRefresh} />
            )
          }
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
                src={`/images/dapps/infrared/${data?.rewardSymbol?.toLocaleLowerCase()}.svg`}
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
    </div >
  );
};

export default DetailBex;
