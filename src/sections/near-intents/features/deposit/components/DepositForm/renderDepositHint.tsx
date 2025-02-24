import { Callout } from "@radix-ui/themes"
import type { BaseTokenInfo } from "../../../../types/base"
import { BlockchainEnum } from "../../../../types/interfaces"
import { formatTokenValue } from "../../../../utils/format"

const networkSelectToLabel: Record<BlockchainEnum, string> = {
  [BlockchainEnum.NEAR]: "NEAR",
  [BlockchainEnum.ETHEREUM]: "Ethereum",
  [BlockchainEnum.BASE]: "Base",
  [BlockchainEnum.ARBITRUM]: "Arbitrum",
  [BlockchainEnum.BITCOIN]: "Bitcoin",
  [BlockchainEnum.SOLANA]: "Solana",
  [BlockchainEnum.DOGECOIN]: "Dogecoin",
  [BlockchainEnum.TURBOCHAIN]: "TurboChain",
  [BlockchainEnum.AURORA]: "Aurora",
  [BlockchainEnum.XRPLEDGER]: "XRP Ledger",
  [BlockchainEnum.ZCASH]: "Zcash",
  [BlockchainEnum.GNOSIS]: "Gnosis",
  [BlockchainEnum.BERACHAIN]: "BeraChain",
}

export function renderDepositHint(
  network: BlockchainEnum,
  minDepositAmount: bigint | null,
  token: BaseTokenInfo
) {
  return (
    <div className="flex flex-col gap-2">
      <Callout.Root className="bg-[#FFDC50] bg-opacity-30 px-2 py-2.5 text-center font-Montserrat h-[62px] rounded-xl">
        <Callout.Text className="text-xs">
          <span className="font-semibold">
            {/* biome-ignore lint/nursery/useConsistentCurlyBraces: <explanation> */}
            Only deposit {token.symbol} from the {networkSelectToLabel[network]}{" "}
            network.
            {/* biome-ignore lint/nursery/useConsistentCurlyBraces: <explanation> */}
          </span>{" "}
          <span>
            Depositing other assets or using a different network will result in
            loss of funds.
          </span>
        </Callout.Text>
      </Callout.Root>

      {minDepositAmount != null && (
        <div className="flex mt-2 flex-col gap-3.5 font-Montserrat font-semibold text-xs">
          <div className="flex justify-between">
            <div>Minimum deposit</div>
            <div className="text-label">
              {/* biome-ignore lint/nursery/useConsistentCurlyBraces: space is needed here */}
              {formatTokenValue(1, token.decimals)}{" "}
              {token.symbol}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
