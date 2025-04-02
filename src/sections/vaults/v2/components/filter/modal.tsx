import Card from '@/components/card';
import Modal from '@/components/modal';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import Filter from '@/sections/vaults/v2/components/filter/index';

const FilterModal = (props: any) => {
  const { className } = props;

  const { listFilterVisible, toggleListFilterVisible } = useVaultsV2Context();

  return (
    <Modal
      open={listFilterVisible}
      onClose={toggleListFilterVisible}
      className={className}
    >
      <Card className="!rounded-[20px] w-full !p-[21px_0px_32px]">
        <Filter className="min-h-[400px]" />
      </Card>
    </Modal>
  );
};

export default FilterModal;
