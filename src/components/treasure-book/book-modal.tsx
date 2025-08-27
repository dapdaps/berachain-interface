import GetMore from "./get-more";
import TotalCollected from "./total-collected";
import YourRewords from "./your-rewords";

export default function BookModal() {
  return (
    <div className="fixed z-[52] left-0 top-0 w-full h-full bg-black/50">
      <div className="w-[1560px] h-[810px] absolute bottom-[-30px] left-1/2 -translate-x-1/2">
        <img src="/images/treasure-book/bg.png" className="w-full h-full" alt="treasure-book" />
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 pl-[60px] font-CherryBomb text-[#FDD54C] text-[36px] bottom-[710px] -rotate-[2.34deg]"
        style={{
          WebkitTextStroke: "2px #000000",
        }}
      >
        Beratown treasure Book
      </div>

      <div className="w-[1560px] h-[810px] absolute left-1/2 -translate-x-1/2 bottom-[30px] pl-[220px] flex justify-between">
        <div className="flex-1 h-full">
          <TotalCollected />
          <YourRewords />
        </div>
        <div className="flex-1 h-full pr-[120px]">
          <GetMore />
        </div>
      </div>
    </div>
  );
}