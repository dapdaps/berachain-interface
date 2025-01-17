import { CaretDownIcon } from "@radix-ui/react-icons"
import type React from "react"

import type { BaseTokenInfo, UnifiedTokenInfo } from "../types/base"

import { AssetComboIcon } from "./Asset/AssetComboIcon"

type Props = {
  selected?: BaseTokenInfo | UnifiedTokenInfo
  handleSelect?: () => void
}

const EmptyIcon = () => {
  return (
    <span className="relative min-w-[36px] min-h-[36px] bg-gray-200 rounded-full" />
  )
}

export const SelectAssets = ({ selected, handleSelect }: Props) => {
  const handleAssetsSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleSelect?.()
  }
  return (
    <button
      type="button"
      onClick={handleAssetsSelect}
      className="w-[176px] h-[46px] border border-[#373A53] bg-[#FFFDEB] rounded-full flex justify-between items-center py-2 pl-[8px] pr-[10px] gap-2.5"
    >
      {selected?.icon ? (
        <AssetComboIcon
          icon={selected.icon as string}
          name={selected.name as string}
          chainIcon={
            "defuseAssetId" in selected ? selected.chainIcon : undefined
          }
          chainName={
            "defuseAssetId" in selected ? selected.chainName : undefined
          }
        />
      ) : (
        <EmptyIcon />
      )}
      <span className="font-Montserrat leading-[14px] font-[600] uppercase truncate">
        {selected?.symbol || "select token"}
      </span>
      <CaretDownIcon width={25} height={25} />
    </button>
  )
}
