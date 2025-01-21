import { useEffect } from "react";
import { DepositWidgetProvider } from "../../../providers/DepositWidgetProvider";
import { useTokensStore } from "../../../providers/TokensStoreProvider";
import type { DepositWidgetProps } from "../../../types/deposit";
import { DepositForm } from "./DepositForm";
import { DepositFormProvider } from "./DepositFormProvider";
import { DepositUIMachineFormSyncProvider } from "./DepositUIMachineFormSyncProvider";
import { DepositUIMachineProvider } from "./DepositUIMachineProvider";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { ethers } from "ethers";
import { ChainType } from "@/sections/near-intents/hooks/useConnectWallet";
import { useAccount } from "wagmi";
import { CHAIN_IDS } from "@/sections/near-intents/constants/evm";

export const DepositWidget = ({
  tokenList,
  userAddress,
  chainType,
  sendTransactionNear,
  sendTransactionEVM,
  sendTransactionSolana,
}: DepositWidgetProps) => {
  const { addAction } = useAddAction("dapp");

  const toast = useToast();

  const addActionChainIdMap: Record<any, number> = {
    [ChainType.Near]: 99998,
    [ChainType.Solana]: 99997,
  };

  return (
    <DepositWidgetProvider>
      <TokenListUpdater tokenList={tokenList} />
      <DepositFormProvider>
        <DepositUIMachineProvider
          tokenList={tokenList}
          sendTransactionNear={sendTransactionNear}
          sendTransactionEVM={sendTransactionEVM}
          sendTransactionSolana={sendTransactionSolana}
          onDepositSuccess={({ txHash, token, amount, chainName }) => {
            if (!chainType) return;

            toast.success({
              title: "Deposit Success",
            });

            addAction?.({
              type: "Staking",
              action: "Staking",
              account_id: userAddress,
              status: 1,
              sub_type: "Deposit",
              transactionHash: txHash,
              template: "near-intents",
              token: token,
              amount: ethers.utils.formatUnits(amount, token.decimals),
              chainId: chainType === ChainType.EVM ? CHAIN_IDS[chainName!] : addActionChainIdMap[chainType],
            });
          }}
        >
          <DepositUIMachineFormSyncProvider
            userAddress={userAddress}
            userChainType={chainType}
          >
            <DepositForm chainType={chainType} />
          </DepositUIMachineFormSyncProvider>
        </DepositUIMachineProvider>
      </DepositFormProvider>
    </DepositWidgetProvider>
  );
};

function TokenListUpdater({
  tokenList,
}: {
  tokenList: DepositWidgetProps["tokenList"];
}) {
  const { updateTokens } = useTokensStore((state) => state);

  useEffect(() => {
    updateTokens(tokenList);
  }, [tokenList, updateTokens]);

  return null;
}
