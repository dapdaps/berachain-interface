import Modal from '@/components/modal';
import { useAirdropStore } from '@/stores/use-airdrop';
import Card from '@/components/card';

const AirdropModal = (props: any) => {
  const {} = props;

  const { setVisible, visible } = useAirdropStore();

  return (
    <Modal
      open={visible}
      className=""
      onClose={() => {
        setVisible(false);
      }}
    >
      <Card className="relative flex flex-col items-center">
        <img
          src="/images/home-earth/airdrop/entry.2x.png"
          alt=""
          className="w-[280px] h-[242px] absolute top-[-20px]"
        />
      </Card>

    </Modal>
  );
};

export default AirdropModal;
