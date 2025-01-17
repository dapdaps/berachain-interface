import { Text } from "@radix-ui/themes"
import clsx from "clsx"
import type { ReactNode } from "react"

import type { BaseTokenInfo, UnifiedTokenInfo } from "../../types/base"
import type { SelectItemToken } from "../Modal/ModalSelectAssets"

import { formatTokenValue } from "../../utils/format"
import { isBaseToken } from "../../utils/token"
import { AssetComboIcon } from "./AssetComboIcon"

type Props<T> = {
  title?: string
  assets: SelectItemToken<T>[]
  emptyState?: ReactNode
  className?: string
  accountId?: string
  handleSelectToken?: (token: SelectItemToken<T>) => void
}

type Token = BaseTokenInfo | UnifiedTokenInfo

export const AssetList = <T extends Token>({
  title,
  assets,
  className,
  handleSelectToken,
}: Props<T>) => {
  return (
    <div className={clsx("flex flex-col", className && className)}>
      {
        title && (
          <div className="sticky top-0 z-10 px-5 h-[46px] flex items-center bg-white">
            <Text
              as="p"
              size="1"
              weight="medium"
              className="pt-2.5 text-gray-600 dark:text-gray-500"
            >
              {title}
            </Text>
        </div>
        )
      }

      {assets.map(({ itemId, token, disabled, balance }, i) => (
        <button
          key={itemId}
          type="button"
          className={clsx(
            "flex justify-between items-center gap-3 p-2.5 rounded-md hover:bg-black hover:bg-opacity-5",
            disabled && "opacity-50 pointer-events-none"
          )}
          onClick={() => handleSelectToken?.(assets[i])}
        >
          <div className="flex items-center gap-2">
            <AssetComboIcon
              icon={token.icon}
              name={token.name}
              chainIcon={isBaseToken(token) ? token.chainIcon : undefined}
              chainName={isBaseToken(token) ? token.chainName : undefined}
            />
            <div className="font-Montserrat font-[600]">{token.symbol}</div>
          </div>
          <div className="font-Montserrat font-[600]">
            {renderBalance(balance?.balance, token)}
          </div>
        </button>
      ))}
    </div>
  )
}

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
        : null}
    </Text>
  )
}
