import LinkButton from '@/sections/activity/christmas/task-modal/link-button';
import Mission from '@/sections/activity/christmas/task-modal/mission';
import { Quest } from '@/sections/activity/christmas/hooks/use-quest';

const Detail = (props: Props) => {
  const {
    id,
    ecosystemInfo,
    missions,
    socials,
    name,
  } = props;

  return (
    <div className="w-[800px] rounded-[24px] border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
      <div
        className="w-full h-[160px] rounded-x-[22px] bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url("${ecosystemInfo?.banner}")` }}
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
  );
};

export default Detail;

export interface Props extends Partial<Quest> {
  visible?: boolean;
  onClose?(): void;
}
