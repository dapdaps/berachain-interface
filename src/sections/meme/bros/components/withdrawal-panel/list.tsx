export default function List() {
  return (
    <div className="max-h-[60dvh] overflow-y-auto">
      {[1, 2].map((item: any, i: number) => (
        <div className="mt-[20px] flex items-start" key={i}>
          <div className="text-[16px]">
            <span className="font-bold mr-[5px]">10M sPepe</span>
            <span>is available to be withdrawal now!</span>
          </div>
          <button className="shrink-0 w-[105px] h-[36px] rounded-[10px] border border-black bg-[#FFDC50] font-semibold">
            Withdraw
          </button>
        </div>
      ))}
    </div>
  );
}
