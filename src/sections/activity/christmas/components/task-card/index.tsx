import CheckButton from "../check-button";
import Button from "./button";

export default function TaskCard() {
  return (
    <div className="w-[400px] h-[260px] flex flex-col justify-between p-[20px] rounded-[20px] border border-black bg-[#B5956E] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset]">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex gap-[10px]">
            <img src="" className="w-[80px] h-[80px] rounded-[10px]" />
            <div>
              <div className="text-[20px] font-bold">Marketplace</div>
              <div className="text-[14px] font-medium">DeFi, Dex</div>
            </div>
          </div>
          <CheckButton
            number={2}
            checked={false}
            className="bg-[#DCBC95] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset]"
          />
        </div>
        <ul className="mt-[6px]">
          <li className="text-[14px] font-medium list-disc">
            Every swap (hot tokens / memecoins) will get 1 Christmas Gift Box.
          </li>
        </ul>
      </div>
      <div className="flex gap-[16px]">
        <Button action="Trade" reward={1} className="w-full" />
        {/* <Button action="Trade" reward={1} className="w-1/2" />
        <Button action="Trade" reward={1} className="w-1/2" /> */}
      </div>
    </div>
  );
}
