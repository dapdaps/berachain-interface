import CircleLoading from '@/components/circle-loading';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import InputNumber from '@/components/input-number';

const IbgtForm = (props: any) => {
  const {
    type,
    amount,
    onChange,
    balance,
    usdValue,
    onSubmit,
    onBalance,
    loading,
    btnText,
    isInSufficient,
    isTokenApproved,
    isTokenApproving,
    symbol,
    handleApprove,
  } = props;

  const renderBtn = () => {
    if (isInSufficient) return 'InSufficient Balance';
    if (isTokenApproved) {
      if (loading) {
        return (
          <CircleLoading size={14} />
        );
      }
      return btnText;
    }
    if (isTokenApproving) {
      return (
        <CircleLoading size={14} />
      );
    }
    return `Approve ${symbol}`;
  };

  const btnDisabled = useMemo(() => {
    if (isInSufficient) return true;
    if (!isTokenApproved) {
      if (isTokenApproving) return true;
    }
    if (loading || Number(amount) <= 0) {
      return true;
    }
    return false;
  }, [isInSufficient, isTokenApproved, isTokenApproving, loading, amount]);

  const handleClick = () => {
    if (isTokenApproved) {
      onSubmit();
      return;
    }
    handleApprove();
  };

  return (
    <motion.div
      variants={{
        visible: {
          opacity: 1,
        },
        hidden: {
          opacity: 0,
        },
      }}
      initial="hidden"
      exit="hidden"
      animate="visible"
    >
      <div className="mt-[16px]">
        <div className="relative border border-[#373A53] bg-white rounded-[12px] p-[16px_10px_6px_14px]">
          <InputNumber
            className="w-full text-[26px] font-[700] h-[24px]"
            value={amount}
            placeholder="0"
            onNumberChange={onChange}
          />
          <div className="flex justify-between items-center text-[12px] text-[#3D405A] font-[500] mt-[12px]">
            <div className="">
              {usdValue}
            </div>
            <div className="flex justify-end items-center gap-[5px]" onClick={onBalance}>
              <span>balance:</span>
              <span className="underline decoration-solid cursor-pointer">{balance}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="mt-[16px] w-full bg-[#FFDC50] h-[46px] border-black border flex justify-center items-center gap-[5px] text-black text-[18px] font-[600] rounded-[10px]"
        onClick={handleClick}
        disabled={btnDisabled}
        style={{
          opacity: btnDisabled ? 0.3 : 1,
        }}
      >
        {renderBtn()}
      </button>
    </motion.div>
  );
};

export default IbgtForm;
