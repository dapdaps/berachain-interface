import CircleLoading from '@/components/circle-loading';
import { StatusColor } from '../../status/styles';
import Big from 'big.js';

export default function Status({ ticksInfo, item }: any) {
  let status = '';
  const currentTick = ticksInfo[item.tokenId]?.tick;
  if (Big(item.liquidity || 0).eq(0)) {
    status = StatusColor.removed;
  } else if (currentTick) {
    status =
      currentTick < item.tickLower || currentTick >= item.tickUpper
        ? StatusColor.out
        : StatusColor.in;
  }
  return status ? (
    <div
      className='w-[8px] h-[8px] rounded-[50%]'
      style={{ background: status }}
    />
  ) : (
    <CircleLoading size={8} />
  );
}
