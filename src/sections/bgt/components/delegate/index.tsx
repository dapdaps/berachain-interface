// @ts-nocheck
import CircleLoading from "@/components/circle-loading";
import Modal from "@/components/modal";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import { useMultiState } from "@/hooks/use-multi-state";
import useToast from "@/hooks/use-toast";
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import { ethers } from "ethers";
import React, { memo, useEffect } from "react";
import { BGT_ABI } from "../../abi";
import { BGT_ADDRESS, VALIDATORS } from "../../config";
import { OperationTypeType, ValidatorType } from "../../types";
import DelegateContent from "@/sections/bgt/components/delegate/content";

interface IProps {
  visible: boolean;
  validator: ValidatorType;
  operationType: OperationTypeType;
  onClose: VoidFunction;
  onValidatorSelect?(value: any): any;
  onCallback?: (result: any) => void;
}

const Delegate = memo((props: IProps) => {
  const { visible, onClose } = props;

  return (
    <Modal open={visible} onClose={onClose} innerStyle={{ width: "unset" }}>
      <div className="px-[32px] md:px-[12px] pt-[28px] w-[520px] md:w-full h-[452px] pb-[69px] overflow-auto rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,_0,_0,_0.25)]">
        <DelegateContent {...props} />
      </div>
    </Modal>
  );
});

export default Delegate;
