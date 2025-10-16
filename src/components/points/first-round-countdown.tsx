import clsx from "clsx";

const FirstRoundCountdown = (props: any) => {
  const { timeLeft, userInfo, onClaimClick, disabled } = props;


  return (<>
    <div className="shadow-[6px_6px_0_0_#00000040] gradient-border-box-10 rounded-[10px]">
      <div className="w-[222px] rounded-[10px] bg-[#FFF1C7]  px-[18px] py-[16px] flex flex-col items-center relative">
        <div className="text-[14px] font-Montserrat font-[500] text-center leading-[1.2] mb-[6px]">
          First Round<br />
          <span className="font-[600]">{`‘Incentivise Everything’`}</span>
        </div>
        <div className="w-full flex flex-col items-center text-[16px]">
          <div className="w-full bg-[#FDD54C] rounded-full h-[40px] flex items-center justify-center mb-[8px]">
            {
              timeLeft.total <= 0 ? <div onClick={onClaimClick} className={clsx("font-CherryBomb transition-all duration-300", disabled ? "cursor-default opacity-50" : "cursor-pointer hover:scale-105")}>Claim your rewards</div> : (
                timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days) + ' days ' + (timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours) + ' : ' + (timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes) + ' : ' + (timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds)
            }
          </div>
          <div className="text-[16px] font-Montserrat font-[500] text-center mb-[6px]">
            Target Amount: <span className="font-[700] text-[16px]">500</span>
          </div>
          <div className="w-full flex items-center justify-center mt-[2px]">
            <div className="w-[90%] h-[20px] bg-[#00000033] rounded-full flex items-center p-[5px]">
              <div className="h-full bg-[#FDD54C] rounded-full transition-all duration-300" style={{ width: Math.min((userInfo?.gem || 0) / 500 * 100, 100) + '%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </>
  );
};

export default FirstRoundCountdown;
