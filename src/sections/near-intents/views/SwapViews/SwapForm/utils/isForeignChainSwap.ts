import parseDefuseAsset from "../../../../utils/parseDefuseAsset"

export default function isForeignChainSwap(
  defuseTokenIdIn: string,
  defuseTokenIdOut: string
) {
  return (
    parseDefuseAsset(defuseTokenIdIn)?.blockchain !== "near" ||
    parseDefuseAsset(defuseTokenIdOut)?.blockchain !== "near"
  )
}
