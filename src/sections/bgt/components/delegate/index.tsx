import Modal from "@/components/modal";
import React, { memo } from "react";
import { OperationTypeType, ValidatorType } from "../../types";
import DelegateContent from '@/sections/bgt/components/delegate/content';

interface IProps {
  visible: boolean;
  validator: ValidatorType;
  operationType: OperationTypeType;
  onClose: VoidFunction;
  onValidatorSelect?(value: any): any;
}

const Delegate = memo((props: IProps) => {
  const { visible, onClose } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      innerStyle={{ width: "unset" }}
    >
      <div className="px-[32px] md:px-[12px] pt-[28px] w-[520px] md:w-full h-[452px] pb-[69px] overflow-auto rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,_0,_0,_0.25)]">
        <DelegateContent {...props} />
      </div>
    </Modal>
  );
});

export default Delegate;
