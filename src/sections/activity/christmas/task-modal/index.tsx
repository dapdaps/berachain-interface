import Modal from "@/components/modal";
import Detail, { Props } from '@/sections/activity/christmas/task-modal/detail';

export default function TaskModal(props: Props) {
  const {
    visible,
    onClose,
    isMobile
  } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
      isShowCloseIcon={!isMobile}
    >
      <Detail {...props} />
    </Modal>
  );
}
