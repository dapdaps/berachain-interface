import { LIST_TOKENS } from "../../constants/tokens"
import { DepositWidget } from "../../features/deposit/components/DepositWidget"
import { ChainType, useConnectWallet } from "../../hooks/useConnectWallet"
import { useTokenList } from "../../hooks/useTokenList"
import { ModalDialog } from "./ModalDialog"

const ModalReviewDeposit = () => {
    const { state, sendTransaction } = useConnectWallet()
    const tokenList = useTokenList(LIST_TOKENS)
  
    return (
        <ModalDialog>
            <DepositWidget
                tokenList={tokenList}
                userAddress={state.address}
                chainType={state.chainType}
                sendTransactionNear={async (tx) => {
                const result = await sendTransaction({
                    id: ChainType.Near,
                    tx,
                })
                return Array.isArray(result) ? result[0].transaction.hash : result
                }}
                sendTransactionEVM={async ({ from, ...tx }) => {
                const result = await sendTransaction({
                    id: ChainType.EVM,
                    tx: {
                    ...tx,
                    account: from,
                    },
                })
                return Array.isArray(result) ? result[0].transaction.hash : result
                }}
                sendTransactionSolana={async (tx) => {
                const result = await sendTransaction({
                    id: ChainType.Solana,
                    tx,
                })
                return Array.isArray(result) ? result[0].transaction.hash : result
                }}
            />
        </ModalDialog>
    )
}

export default ModalReviewDeposit