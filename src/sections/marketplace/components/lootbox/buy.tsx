import Button from "@/components/button";
import Card from "@/components/card";
import InputNumber from "@/components/input-number";
import Modal from "@/components/modal";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";

const BuyModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Card className="w-[500px] md:w-full">
        <Content {...props} />
      </Card>
    </Modal>
  );
};

export default BuyModal;

const Content = (props: any) => {
  const {
    box,
    amount,
    onAmountChange,
    onBuy,
    buttonStatus,
    costToken,
    costTokenBalance,
    costTokenBalanceLoading,
  } = props;

  return (
    <div className="text-[16px] leading-[100%] font-[600]">
      <div className="font-CherryBomb text-[20px]">
        {box?.title}
      </div>
      <div className="mt-[30px]">
        <div className="flex justify-between items-center mt-[20px]">
          <div className="">
            price
          </div>
          <div className="">
            {numberFormatter(box?.price, 6, true)} {costToken?.symbol}
          </div>
        </div>
        <div className="mt-[20px]">
          <InputNumber
            value={amount}
            onNumberChange={onAmountChange}
            className="w-full h-[54px] border border-black rounded-[10px] px-[10px] text-[20px] font-[600]"
            integerOnly
            placeholder="0"
          />
          <div className="flex justify-between items-center mt-[10px]">
            <div className="text-[12px] text-[#3D405A] font-[500]">
              Balance: {numberFormatter(costTokenBalance, 2, true, { isShort: true, isShortUppercase: true })} {costToken?.symbol}
            </div>
            <div className="text-[12px] text-[#3D405A] font-[500]">
              Total: {numberFormatter(Big(amount || 0).mul(box?.price || 0), 2, true, { isShort: true, isShortUppercase: true })} {costToken?.symbol}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[20px]">
        <Button
          type="primary"
          className="w-full !h-[54px]"
          onClick={onBuy}
          disabled={buttonStatus.disabled || buttonStatus.loading}
          loading={buttonStatus.loading}
        >
          {buttonStatus.text}
        </Button>
      </div>
    </div>
  );
};
