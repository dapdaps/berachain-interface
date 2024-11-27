import { memo } from "react"
import BexList from "./Bex"
import AquaBeraList from "./AquaBera"
export default memo(function List(props: any) {
  return props?.name === "AquaBera" ? (
    <AquaBeraList {...props} />
  ) : (
    <BexList {...props} />
  )
})
