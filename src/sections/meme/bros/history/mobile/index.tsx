import PageBack from "@/components/back";
import Materials from "../../components/materials";
import Round from "../round";

export default function Mobile() {
  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      <div className="absolute left-[18px] top-[18px]">
        <PageBack />
      </div>
      <div className="text-[24px] font-CherryBomb text-center">History</div>
      <div className="w-full mx-auto relative z-[10] pb-[20px]">
        <Round />
        <Round />
        <Round />
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[200px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
    </div>
  );
}
