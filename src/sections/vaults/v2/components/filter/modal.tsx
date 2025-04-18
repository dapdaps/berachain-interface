import Card from '@/components/card';
import Modal from '@/components/modal';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import Filter from '@/sections/vaults/v2/components/filter/index';
import useIsMobile from '@/hooks/use-isMobile';
import clsx from 'clsx';

const FilterModal = (props: any) => {
  const { className } = props;

  const isMobile = useIsMobile();
  const { listFilterVisible, toggleListFilterVisible } = useVaultsV2Context();

  return (
    <Modal
      open={listFilterVisible}
      onClose={toggleListFilterVisible}
      className={className}
    >
      <Card className={clsx("w-full", isMobile ? "!rounded-b-0 !rounded-t-[20px] !p-[21px_0px_56px] relative" : "!rounded-[20px] !p-[21px_0px_32px]")}>
        <Filter className="min-h-[400px]" />
      </Card>
    </Modal>
  );
};

export default FilterModal;
