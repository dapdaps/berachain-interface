import { LIST_TOKENS } from "../../constants/tokens";
import { WithdrawWidget } from "../../features/withdraw/components/WithdrawWidget";
import { ChainType, useConnectWallet } from "../../hooks/useConnectWallet";
import { useNearWalletActions } from "../../hooks/useNearWalletActions";
import { useTokenList } from "../../hooks/useTokenList";
import { ModalDialog } from "./ModalDialog";
import { useSignMessage } from "wagmi";
import { useWallet as useWalletSolana } from "@solana/wallet-adapter-react";

const ModalReviewWithdraw = () => {
  const { state } = useConnectWallet();
  const { signMessage, signAndSendTransactions } = useNearWalletActions();
  const { signMessageAsync: signMessageAsyncWagmi } = useSignMessage();
  const solanaWallet = useWalletSolana();
  const tokenList = useTokenList(LIST_TOKENS);

  return (
    <ModalDialog isMaskClose={false}>
      <WithdrawWidget
        tokenList={tokenList}
        userAddress={state.address}
        chainType={state.chainType}
        sendNearTransaction={async (tx) => {
          const result = await signAndSendTransactions({ transactions: [tx] });

          if (typeof result === "string") {
            return { txHash: result };
          }

          const outcome = result[0];
          if (!outcome) {
            throw new Error("No outcome");
          }

          return { txHash: outcome.transaction.hash };
        }}
        signMessage={async (params) => {
          const chainType = state.chainType;

          switch (chainType) {
            case ChainType.EVM: {
              const signatureData = await signMessageAsyncWagmi({
                message: params.ERC191.message,
              });
              return {
                type: "ERC191",
                signatureData,
                signedData: params.ERC191,
              };
            }

            case ChainType.Near: {
              const { signatureData, signedData } = await signMessage({
                ...params.NEP413,
                nonce: Buffer.from(params.NEP413.nonce),
              });
              return { type: "NEP413", signatureData, signedData };
            }

            case ChainType.Solana: {
              if (solanaWallet.signMessage == null) {
                throw new Error("Solana wallet does not support signMessage");
              }

              const signatureData = await solanaWallet.signMessage(
                params.SOLANA.message
              );

              return {
                type: "SOLANA",
                signatureData,
                signedData: params.SOLANA,
              };
            }

            case undefined:
              throw new Error("User not signed in");

            default:
              chainType satisfies never;
              throw new Error(`Unsupported sign in type: ${chainType}`);
          }
        }}
      />
    </ModalDialog>
  );
};

export default ModalReviewWithdraw;
