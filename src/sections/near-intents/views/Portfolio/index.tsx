import { useEffect, useState } from "react";
import { Text } from "@radix-ui/themes";
import IconHistory from "@public/images/near-intents/icons/history.svg";
import { SelectItemToken } from "../../components/Modal/ModalSelectAssets";
import { useTokensStore } from "../../providers/TokensStoreProvider";
import { computeTotalBalance } from "../../utils/tokenUtils";
import { formatTokenValue } from "../../utils/format";
import { BaseTokenInfo, UnifiedTokenInfo } from "../../types/base";
import History from "./History";
import { useModalStore } from "../../providers/ModalStoreProvider";
import { ModalType } from "../../stores/modalStore";
import { useConnectWallet } from "../../hooks/useConnectWallet";
import { useSelector } from "@xstate/react";
import { SwapUIMachineContext } from "../../features/swap/components/SwapUIMachineProvider";
import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";
import ConnectWalletBar from "../../components/ConnectWalletBar";
import { useConnectedWalletsStore } from "@/stores/useConnectedWalletsStore";
import useToast from "@/hooks/use-toast";

const Portfolio = (props: any) => {
  const { className } = props;

  const [assetList, setAssetList] = useState<SelectItemToken[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { data, isLoading } = useTokensStore((state) => state);
  const { setModalType } = useModalStore((state) => state);
  const { connectedWallets } = useConnectedWalletsStore();
  const { state } = useConnectWallet();

  const isMobile = useIsMobile();
  const toast = useToast();

  const swapUIActorRef = SwapUIMachineContext.useActorRef();
  const depositedBalanceRef = useSelector(
    swapUIActorRef,
    (state) => state.children.depositedBalanceRef
  );

  const generateAssetList = (tokenData: Map<string, any>, balances: any) => {
    const newAssetList: SelectItemToken[] = [];

    for (const [tokenId, token] of (tokenData as any)) {
      const totalBalance = computeTotalBalance(token, balances ?? {});
      newAssetList.push({
        itemId: tokenId,
        token,
        disabled: false,
        balance:
          totalBalance == null
            ? undefined
            : {
                balance: totalBalance.toString(),
                balanceUsd: undefined,
                convertedLast: undefined,
              },
      });
    }

    // 自定义排序顺序
    const priorityOrder = [
      "BERA",
      "ETH",
      "BTC",
      "USDT",
      "USDC",
      "SOL",
      "TRUMP",
    ];

    newAssetList.sort((a, b) => {
      const getFormattedBalance = (asset: any) => {
        if (!asset.balance?.balance || !asset.token?.decimals) return 0;
        return Number(asset.balance.balance) / 10 ** asset.token.decimals;
      };
    
      const aBalance = getFormattedBalance(a);
      const bBalance = getFormattedBalance(b);
    
      if (aBalance !== bBalance) {
        return bBalance - aBalance;
      }
    
      const indexA = priorityOrder.indexOf(a.token.symbol);
      const indexB = priorityOrder.indexOf(b.token.symbol);
    
      if (indexA !== -1 && indexB === -1) return -1;
      if (indexA === -1 && indexB !== -1) return 1;
    
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    
      return a.token.symbol.localeCompare(b.token.symbol);
    });

    return newAssetList;
  };

  useEffect(() => {
    if (state.chainType && state.address && swapUIActorRef) {
      swapUIActorRef.send({
        type: "LOGIN",
        params: {
          userAddress: state.address,
          userChainType: state.chainType,
        },
      });

      const subscription = depositedBalanceRef?.subscribe((state) => {
        const balances = state.context.balances;
        if (data.size && balances) {
          setAssetList(generateAssetList(data, balances));
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, [state.address, state.chainType, swapUIActorRef, data]);

  useEffect(() => {
    if (!data.size || !depositedBalanceRef) {
      setAssetList([]);
      return;
    }

    const balances = depositedBalanceRef.getSnapshot().context.balances;
    setAssetList(generateAssetList(data, balances));
  }, [data, depositedBalanceRef]);

  const renderMainContent = () => (
    <div className="lg:px-[20px] lg:py-[16px] pb-[30px]">
      <div className="flex items-center justify-between">
        <div className="font-CherryBomb text-[26px]">Assets</div>
        <IconHistory
          className="opacity-30 cursor-pointer hover:opacity-60"
          onClick={() => setShowHistory(true)}
        />
      </div>
      <div className="flex items-center justify-between gap-2 my-5">
        <button
          disabled={!state.address}
          className="w-1/2 h-[50px] bg-[#FFDC50] border border-black text-[14px] rounded-[10px] font-Montserrat font-[600] disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => {
            if (isMobile) {
              toast.info({
                title:
                  "Please visit the desktop version for a better experience.",
              });
              return;
            }
            setModalType(ModalType.MODAL_REVIEW_DEPOSIT);
          }}
        >
          Deposit
        </button>
        <button
          disabled={!state.address}
          className="w-1/2 h-[50px] bg-[#FFDC50] border border-black text-[14px] rounded-[10px] font-Montserrat font-[600] disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => {
            if (isMobile) {
              toast.info({
                title:
                  "Please visit the desktop version for a better experience.",
              });
              return;
            }
            setModalType(ModalType.MODAL_REVIEW_WITHDRAW);
          }}
        >
          Withdraw
        </button>
      </div>
      <div className="max-h-[500px] md:max-h-[unset] overflow-y-auto pb-6 scrollbar-hide">
        {assetList.map(({ token, balance }, index) => (
          <div
            key={index}
            className={`flex items-center justify-between ${
              index === 0 ? "" : "mt-5"
            } mb-5`}
          >
            <div className="flex items-center gap-2">
              <img
                src={token.icon}
                className="w-[30px] h-[30px] rounded-full"
                alt=""
              />
              <div className="font-Montserrat font-[600]">{token.symbol}</div>
            </div>
            <div className={clsx('font-Montserrat font-[600]', Number(balance?.balance) > 0 ? 'opacity-100' : 'opacity-30')}>
              {renderBalance(balance?.balance, token) || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={clsx(
        isMobile
          ? ""
          : "w-[340px] mr-5 bg-[#FFFDEB] h-[680px] border border-[#373A53] rounded-[30px] shadow-shadow1 overflow-hidden",
          className
      )}
    >
      {!isMobile && <ConnectWalletBar />}
      {showHistory ? (
        <History onBack={() => setShowHistory(false)} />
      ) : (
        renderMainContent()
      )}
    </div>
  );
};

function renderBalance(
  balance: string | undefined,
  token: BaseTokenInfo | UnifiedTokenInfo
) {
  return (
    <Text as="span" size="2" weight="medium">
      {balance != null
        ? formatTokenValue(balance, token.decimals, {
            min: 0.0001,
            fractionDigits: 4,
          })
        : null}{" "}
    </Text>
  );
}
export default Portfolio;
