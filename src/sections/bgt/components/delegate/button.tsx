import { memo } from "react"
import Big from "big.js"
import clsx from "clsx"
export default memo(function Button(props) {
  const {
    inAmount,
    balance,
    operationType,
    onClick
  } = props
  const BTN_CLASS = "w-full h-[60px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[18px] font-semibold leading-[90%]"

  if (Number(inAmount) > Number(balance)) {
    return (
      <div className={clsx(BTN_CLASS, '!opacity-50')}>InSufficient Balance</div>
    )
  }
  if (Number(inAmount) < 0) {
    return (
      <div className={clsx(BTN_CLASS, '!opacity-50')}>
        {props.children}
      </div>
    )
  }
  return (
    <div className={clsx(BTN_CLASS, 'cursor-pointer')} onClick={onClick}>
      {props.children}
    </div>
  )
})
