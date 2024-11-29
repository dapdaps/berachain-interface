import { forwardRef, memo } from "react";
import AquaBeraList from "./AquaBera";
import BexList from "./Bex";
export default memo(forwardRef<any, any>(function List(props: any, ref: any) {
  return props?.name === "AquaBera" ? (
    <AquaBeraList
      {...{
        ...props,
        ref
      }}
    />
  ) : (
    <BexList
      {...{
        ...props,
        ref
      }}
    />
  )
}))
