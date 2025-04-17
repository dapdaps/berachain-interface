import useCountdown, { getTimePeriods, toTwo } from '@/hooks/use-count-down';
import { useCountdownManager, useCountdownStore } from './countdown-manager';
import { useMemo } from 'react';

const CountDown = () => {
    const { secondsRemaining, isEventEnded } = useCountdownManager();
    
    const timeDisplay = useMemo(() => {
        if (isEventEnded) return "Event Ended";
        
        const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining);
        if (days > 0) {
            return `Ends in ${days}d ${toTwo(hours)}:${toTwo(minutes)}:${toTwo(seconds)}`;
        }
        return `Ends in ${toTwo(hours)}:${toTwo(minutes)}:${toTwo(seconds)}`;
    }, [secondsRemaining, isEventEnded]);
    
    if (isEventEnded) return null;

    return (
        <div style={{
            'boxShadow': '0px 4px 0px 0px rgba(0, 0, 0, 0.25)'
        }} className="text-center p-[6px_15px] border border-black rounded-[15px] bg-[#EBF479] text-black font-CherryBomb text-base leading-[14px]">
            {timeDisplay}
        </div>
    )
}

export default CountDown;

// 导出一个简便的钩子来判断倒计时是否结束
export const useEventEnded = () => {
    const isEventEnded = useCountdownStore(state => state.isEventEnded);
    return isEventEnded;
};