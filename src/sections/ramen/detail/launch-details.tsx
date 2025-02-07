import clsx from 'clsx';
import LabelItem from '@/sections/ramen/detail/components/label-item';
import { numberFormatter } from '@/utils/number-formatter';

const TokenLaunchDetails = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('grid grid-cols-3 gap-[35px] mt-[21px] pb-[13px]', className)}>
      <LabelItem label="Reserved for Airdrop">
        {numberFormatter('20843.1461', 4, true)} GAYMEN
      </LabelItem>
      <LabelItem label="Total Supply">
        {numberFormatter('100000000', 2, true)} GAYMEN
      </LabelItem>
      <LabelItem label="Auctioned Supply">
        {numberFormatter('69420', 2, true)} BERA
      </LabelItem>
      <LabelItem label="Min. Bid Price">
        {numberFormatter('0.042', 4, true)} BERA
      </LabelItem>
      <LabelItem label="Min. FDV">
        {numberFormatter('4200000', 2, true)} BERA
      </LabelItem>
    </div>
  );
};

export default TokenLaunchDetails;
