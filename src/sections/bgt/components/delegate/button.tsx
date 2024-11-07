import CircleLoading from '@/components/circle-loading';
import clsx from "clsx";
import { memo } from "react";
export default memo(function Button(props) {
  const {
    loading,
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
  if (loading) {
    return (
      <div className={clsx(BTN_CLASS, '!opacity-50')}>
        <CircleLoading size={14} />
      </div>
    )
  }
  return (
    <div className={clsx(BTN_CLASS, 'cursor-pointer')} onClick={onClick}>
      {props.children}
    </div>
  )
})
