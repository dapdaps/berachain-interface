export default function Avatar({}: any) {
  return (
    <div className="relative w-[40px] h-[40px]">
      <img src="" className="w-full h-full rounded-[10px]" />
      <div className="absolute right-[-20px] top-[-10px] rounded-[10px] h-[25px] border border-2 border-black bg-[#C8D060] text-[12px] font-CherryBomb">
        <div className="w-full bg-[#EBF479] rounded-[15px] px-[4px] h-[18px]">
          x10
        </div>
      </div>
    </div>
  );
}
