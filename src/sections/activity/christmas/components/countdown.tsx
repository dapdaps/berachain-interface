import { useContext } from 'react';
import { SceneContext } from '@/context/scene';

const Countdown = (props: any) => {
  const { className, countdownClassName } = props;

  const { currentSceneInfoValid, currentSceneInfoLoading, currentRemainingDatetime } = useContext(SceneContext);

  return (
    <div className={`absolute right-[50px] bottom-[60px] w-[160px] py-[10px] rounded-[20px] border text-center border-black bg-[#FFFDEB] shadow-shadow1 flex flex-col items-center text-[14px] font-[400] font-CherryBomb leading-[90%] gap-[7px] ${className}`}>
      {
        !currentSceneInfoValid && !currentSceneInfoLoading ? 'Campaign Ended' : (
          <>
            <div>Bera Wonderland will close in</div>
            <div className={`text-[18px] ${countdownClassName}`}>{currentRemainingDatetime || '--:--:--'}</div>
          </>
        )
      }
    </div>
  );
};

export default Countdown;
