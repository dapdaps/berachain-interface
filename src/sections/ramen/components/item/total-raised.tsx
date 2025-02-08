import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';

const TotalRaised = (props: any) => {
  const { className, project, beraPrice } = props;

  return (
    <div className={clsx('flex flex-col justify-center gap-[10px]', className)}>
      <div className="">
        {numberFormatter(project?.total_raised_in_ether, 2, true)} BERA
      </div>
      <div className="text-[0.75em]">
        {numberFormatter(Big(project?.total_raised_in_ether || 0).times(beraPrice), 4, true, {
          prefix: "$",
          isShort: true,
        })}
      </div>
    </div>
  );
};

export default TotalRaised;
