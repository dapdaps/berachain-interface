import { useState } from "react";

const Popup = () => {
  const [show, setShow] = useState(false);

 if (!show) return null;

  return (
    <div className="fixed inset-0">
      <div
        className="fixed inset-0"
        onClick={() => setShow(false)}
      >
        <img src="/images/mobile/cave/drill.gif" alt="cave" className="w-[100vw] h-[100vh]" />
      </div>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-[87.197vw] h-[88.717vw] rounded-[20px] bg-[#FFFDEB] relative">
          <img src="/images/mobile/cave/close.png" alt="" className="w-[8.461vw] h-[8.461vw] absolute right-[10px] top-4" onClick={() => setShow(false)} />
          <div className="font-CherryBomb text-[26px] font-normal leading-6 text-center mt-[30px]">Your Cave is Empty</div>
          <img className="w-[72.564vw] h-[49.12vw] mt-[18px] mb-[26px] mx-auto" src="/images/mobile/cave/empty.png" alt="" />
          <div className="font-Montserrat text-base font-medium leading-[20.64px] text-center">Check each item to know how to get</div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
