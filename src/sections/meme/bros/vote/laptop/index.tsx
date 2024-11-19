import Title from "../../components/title";
import Materials from "../../components/materials";

export default function Laptop() {
  return (
    <div className="relative w-full overflow-x-hidden relative">
      <Title />
      <div className="w-[916px] mx-auto relative z-[10] pb-[20px] min-h-[100px]">
        {/* TODO */}
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[240px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
    </div>
  );
}
