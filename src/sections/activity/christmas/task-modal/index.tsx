import Modal from "@/components/modal";
import LinkButton from "./link-button";
import Mission from "./mission";
import config from "./config";

export default function TaskModal({ task = "beraji" }: any) {
  const taskConfig = config[task];
  return (
    <Modal
      open={true}
      onClose={() => {}}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="w-[800px] rounded-[24px] border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
        <img
          src={taskConfig.bg}
          className="w-full h-[160px] rounded-x-[22px]"
        />
        <div className="px-[30px]">
          <div className="flex justify-between">
            <div className="flex gap-[17px]">
              <img
                src={taskConfig.title}
                className="w-[120px] h-[120px] rounded-[10px] mt-[-50px]"
              />
              <div className="mt-[14px]">
                <div className="text-[20px] font-bold">{taskConfig.name}</div>
                <div className="text-[14px] font-medium">
                  {taskConfig.types}
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] mt-[14px]">
              {taskConfig.links.map((link: any) => (
                <LinkButton key={link[0]} href={link[1]}>
                  {link[0]}
                </LinkButton>
              ))}
            </div>
          </div>
          <div className="text-[14px] font-medium mt-[14px]">
            {taskConfig.desc}
          </div>
          <div className="mt-[18px] text-[16px] font-bold">Missions</div>
          {taskConfig.missions.map((mission: any, i: number) => (
            <Mission key={i} mission={mission} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
