import { Text } from "@radix-ui/themes"
import { useDeferredValue, useEffect, useState } from "react"
import type { BalanceMapping } from "../../features/machines/depositedBalanceMachine"
import { useModalStore } from "../../providers/ModalStoreProvider"
import { useTokensStore } from "../../providers/TokensStoreProvider"
import { ModalType } from "../../stores/modalStore"
import type {
  BaseTokenBalance,
  BaseTokenInfo,
  UnifiedTokenInfo,
} from "../../types/base"
import { isBaseToken } from "../../utils/token"
import { computeTotalBalance } from "../../utils/tokenUtils"
import { AssetList } from "../Asset/AssetList"
import { EmptyAssetList } from "../Asset/EmptyAssetList"
import { SearchBar } from "../SearchBar"
import { ModalDialog } from "./ModalDialog"

type Token = BaseTokenInfo | UnifiedTokenInfo

export type ModalSelectAssetsPayload = {
  modalType?: ModalType.MODAL_SELECT_ASSETS
  token?: Token
  fieldName?: string
  balances?: BalanceMapping
  accountId?: string
}

export type SelectItemToken<T = Token> = {
  itemId: string
  token: T
  disabled: boolean
  defuseAssetId?: string
  balance?: BaseTokenBalance
}

export const ModalSelectAssets = () => {
  const [searchValue, setSearchValue] = useState("")
  const [assetList, setAssetList] = useState<SelectItemToken[]>([])

  const { onCloseModal, modalType, payload } = useModalStore((state) => state)
  const { data, isLoading } = useTokensStore((state) => state)
  const deferredQuery = useDeferredValue(searchValue)

  const handleSearchClear = () => setSearchValue("")

  const filterPattern = (asset: SelectItemToken) => {
    const formattedQuery = deferredQuery.toLocaleUpperCase()

    return (
      asset.token.symbol.toLocaleUpperCase().includes(formattedQuery) ||
      asset.token.name.toLocaleUpperCase().includes(formattedQuery)
    )
  }

  const handleSelectToken = (selectedItem: SelectItemToken) => {
    if (modalType !== ModalType.MODAL_SELECT_ASSETS) {
      throw new Error("Invalid modal type")
    }

    const newPayload: ModalSelectAssetsPayload = {
      ...(payload as ModalSelectAssetsPayload),
      modalType: ModalType.MODAL_SELECT_ASSETS,
      token: selectedItem.token,
    }
    onCloseModal(newPayload)
  }

  useEffect(() => {
    if (!data.size && !isLoading) {
      return
    }
    const { selectToken } = payload as {
      selectToken: Token | undefined
      fieldName: string
      balances?: BalanceMapping
    }

    // Warning: This is unsafe type casting, payload could be anything
    const balances = (payload as ModalSelectAssetsPayload).balances ?? {}

    const selectedTokenId = selectToken
      ? isBaseToken(selectToken)
        ? selectToken.defuseAssetId
        : selectToken.unifiedAssetId
      : undefined

    const getAssetList: SelectItemToken[] = []

    for (const [tokenId, token] of data) {
      const disabled = selectedTokenId != null && tokenId === selectedTokenId
      const totalBalance = computeTotalBalance(token, balances)

      getAssetList.push({
        itemId: tokenId,
        token,
        disabled,
        balance:
          totalBalance == null
            ? undefined
            : {
                balance: totalBalance.toString(),
                balanceUsd: undefined,
                convertedLast: undefined,
              },
      })
    }

    // 自定义排序顺序
    const priorityOrder = ['BERA', 'ETH', 'BTC', 'USDT', 'USDC', 'SOL', 'TRUMP'];
    
    getAssetList.sort((a, b) => {
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

    setAssetList(getAssetList)
  }, [data, isLoading, payload])

  return (
    <ModalDialog isMaskClose={false}>
      <div className="flex flex-col max-h-[608px] h-full">
        <div className="h-auto flex-none p-5 border-bz-10">
          <SearchBar
            query={searchValue}
            setQuery={setSearchValue}
            handleOverrideCancel={onCloseModal}
          />
        </div>
        <div className="z-10 flex-1 overflow-y-auto px-2.5">
          {assetList.length ? (
            <AssetList
              assets={
                deferredQuery ? assetList.filter(filterPattern) : assetList
              }
              // title={deferredQuery ? "Search results" : "Popular tokens"}
              className="h-full"
              handleSelectToken={handleSelectToken}
              accountId={(payload as ModalSelectAssetsPayload)?.accountId}
            />
          ) : (
            <EmptyAssetList className="h-full" />
          )}
          {deferredQuery && (
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={handleSearchClear}
                className="mb-2.5 px-3 py-1.5 bg-red-100 rounded-full"
              >
                <Text size="2" weight="medium" className="text-red-400">
                  Clear results
                </Text>
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalDialog>
  )
}