import Modal from "@/components/modal";
import { memo } from "react";
import Content from '@/sections/staking/Bridge/Modal/content';

export default memo(function index(props: any) {
  const { show, onClose } = props;

  return (
    <>
      <Modal open={show} onClose={onClose}>
        <Content {...props} />
      </Modal>
    </>
  );
});
