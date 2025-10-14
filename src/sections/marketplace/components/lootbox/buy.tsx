import Button from "@/components/button";
import Card from "@/components/card";
import InputNumber from "@/components/input-number";
import Modal from "@/components/modal";
import { numberFormatter } from "@/utils/number-formatter";

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
  const { box, amount, onAmountChange, onBuy, buying, buttonStatus } = props;

  return (
    <div className="">
      <div className="">
        Buy Lootbox
      </div>
      <div className="flex justify-between items-center">
        <div className="">
          name
        </div>
        <div className="">
          {box?.category}
        </div>
      </div>
      <div className="flex justify-between items-center mt-[10px]">
        <div className="">
          price
        </div>
        <div className="">
          {numberFormatter(box?.price, 6, true)} BERA
        </div>
      </div>
      <div className="mt-[10px]">
        <InputNumber
          value={amount}
          onNumberChange={onAmountChange}
          className="w-full border border-black rounded-[10px] px-[10px] h-[32px]"
          integerOnly
        />
      </div>
      <div className="mt-[10px]">
        <Button
          type="primary"
          className="w-full"
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
