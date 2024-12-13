import LinkButton from '@/sections/activity/christmas/task-modal/link-button';
import Mission from '@/sections/activity/christmas/task-modal/mission';
import { Quest } from '@/sections/activity/christmas/hooks/use-quest';
import { useContext } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';

const Detail = (props: Props) => {
  const {
    id,
    ecosystemInfo,
    missions,
    socials,
    name,
  } = props;

  const {
    isMobile,
  } = useContext(ChristmasContext);

  return (
    <div className="w-[800px] md:w-full md:h-[80dvh] rounded-[24px] md:rounded-b-[0] border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
      <div
        className="relative w-full h-[160px] md:h-[125px] rounded-x-[22px] md:rounded-t-[20px] bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url("${ecosystemInfo?.banner}")` }}
      >
        <img
          src={ecosystemInfo?.icon}
          className="absolute left-[30px] bottom-[-70px] w-[120px] h-[120px] md:w-[95px] md:h-[95px] md:left-[22px] md:bottom-[-49px] rounded-[10px]"
        />
      </div>
      <div className="px-[30px] md:px-[22px] md:h-[calc(100%_-_125px)]">
        <div className="flex justify-between md:flex-col">
          <div className="flex gap-[17px]">
            <img
              src={ecosystemInfo?.icon}
              className="w-[120px] h-[120px] md:w-[95px] md:h-[95px] rounded-[10px] mt-[-50px]"
            />
            <div className="mt-[14px] md:mt-[0]">
              <div className="text-[20px] font-bold">{name}</div>
              <div className="text-[14px] font-medium">
                {ecosystemInfo?.categories?.join(', ')}
              </div>
            </div>
          </div>
          {
            !isMobile && (
              <div className="flex gap-[6px] mt-[14px]">
                {socials?.map((it, idx) => (
                  <LinkButton key={idx} href={it.link} target="_blank">
                    {it.label}
                  </LinkButton>
                ))}
              </div>
            )
          }
        </div>
        <div className="md:h-[calc(100%_-_51px)] md:overflow-y-auto md:pb-[40px]">
          {
            isMobile && (
              <div className="flex gap-[6px] mt-[14px]">
                {socials?.map((it, idx) => (
                  <LinkButton key={idx} href={it.link} target="_blank">
                    {it.label}
                  </LinkButton>
                ))}
              </div>
            )
          }
          <div className="text-[14px] font-medium mt-[14px]">
            {ecosystemInfo?.description}
          </div>
          <div className="mt-[18px] text-[16px] font-bold">Missions</div>
          {missions?.map((mission: any, i: number) => (
            <Mission key={i} mission={mission} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;

export interface Props extends Partial<Quest> {
  visible?: boolean;
  onClose?(): void;
}
