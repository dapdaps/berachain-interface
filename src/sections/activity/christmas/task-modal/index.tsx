import Modal from "@/components/modal";
import LinkButton from "./link-button";
import Mission from "./mission";
import { Quest } from '@/sections/activity/christmas/hooks/use-quest';

export default function TaskModal(props: Props) {
  const {
    id,
    visible,
    onClose,
    ecosystemInfo,
    missions,
    socials,
    name,
  } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="w-[800px] rounded-[24px] border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
        <img
          src={ecosystemInfo?.banner}
          className="w-full h-[160px] rounded-x-[22px]"
        />
        <div className="px-[30px]">
          <div className="flex justify-between">
            <div className="flex gap-[17px]">
              <img
                src={ecosystemInfo?.icon}
                className="w-[120px] h-[120px] rounded-[10px] mt-[-50px]"
              />
              <div className="mt-[14px]">
                <div className="text-[20px] font-bold">{name}</div>
                <div className="text-[14px] font-medium">
                  {ecosystemInfo?.categories?.join(', ')}
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] mt-[14px]">
              {socials?.map((it, idx) => (
                <LinkButton key={idx} href={it.link} target="_blank">
                  {it.label}
                </LinkButton>
              ))}
            </div>
          </div>
          <div className="text-[14px] font-medium mt-[14px]">
            {ecosystemInfo?.description}
          </div>
          <div className="mt-[18px] text-[16px] font-bold">Missions</div>
          {missions?.map((mission: any, i: number) => (
            <Mission key={i} mission={mission} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

interface Props extends Partial<Quest> {
  visible?: boolean;
  onClose?(): void;
}
