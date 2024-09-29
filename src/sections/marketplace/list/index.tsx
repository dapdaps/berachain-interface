import { FontClass } from "@/utils/classes"
import clsx from "clsx"
import { memo } from "react"
export default memo(function List() {
  return (
    <div className={clsx(FontClass, "text-[60px]")}>Marketplace</div>
  )
})
