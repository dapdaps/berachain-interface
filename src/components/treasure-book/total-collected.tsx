import LightButton from "../check-in/button";

export default function TotalCollected() {
    return <div className="font-CherryBomb pt-[150px] relative text-[#FDD54C]" style={{
        WebkitTextStroke: "2px #000000",
    }}>
        <div className="w-[200px] text-center pl-[30px] mt-[15px]">
            <div className="text-[60px] leading-[60px]">0</div>
            <div className="text-[24px]">Total Collected</div>
        </div>
        
        <div className="flex justify-between items-center px-[30px] mt-[50px]">
            {[1,2,3].map((item) => (
                <div key={item} className="w-[160px] h-[160px] flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                    <img src={`/images/treasure-book/box.png`} className="w-[100px] opacity-10" alt="item" />
                </div>
            ))}
        </div>

        <div className="flex flex-col items-center gap-[10px] justify-center pb-[40px] absolute right-[30px] top-[130px] w-[180px] h-[204px] bg-[url('/images/treasure-book/flag.png')] bg-no-repeat bg-center bg-contain">
            <div className="text-[60px] leading-[50px]">5</div>
            <div className="text-[20px] leading-[20px]">To be opened</div>
            <div className="scale-[0.7]">
                <LightButton>open all</LightButton>
            </div>
        </div>
    </div>;
}
