import Drawer from '@/components/drawer';
import Button from '@/components/button';
import useIsMobile from '@/hooks/use-isMobile';

const Confirm = () => {
  return (
    <>
      <div className="max-w-[212px] md:max-w-[unset]">
        Each round can only vote for one MEME token once, after voting can not be changed.
      </div>
      <div className="mt-[9px] flex justify-center items-center">
        <Button
          type="primary"
          className="h-[28px] leading-[26px] md:w-full md:mt-[20px] md:h-[50px] md:leading-[48px] px-[10px] border border-black disabled:cursor-[default!important] rounded-[10px] bg-[#FFDC50] flex justify-center items-center gap-[5px] text-center text-black text-[14px] md:text-[18px] font-[600]"
        >
          Confirm
        </Button>
      </div>
    </>
  );
};

const VoteConfirm = (props: any) => {
  const { visible, onClose } = props;

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer
      visible={visible}
      onClose={onClose}
      size="30dvh"
    >
      <div className="bg-[#FFFDEB] px-[22px] pt-[16px] pb-[20px] rounded-tl-[20px] rounded-tr-[2px] h-full overflow-y-auto text-[16px] text-black font-[400] leading-[120%]">
        <Confirm {...props} />
      </div>
    </Drawer>
  ) : (
    <div className="border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 p-[12px_10px_15px_13px] text-[14px] text-black font-[400] leading-[120%]">
      <Confirm {...props} />
    </div>
  );
};

export default VoteConfirm;
