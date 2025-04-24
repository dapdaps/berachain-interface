import clsx from 'clsx';
import Card from '@/components/card';
import Nav from '@/sections/bgt/validator/components/nav';
import { useBgtStore } from '@/stores/bgt';
import Skeleton from 'react-loading-skeleton';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import DelegateContent from '@/sections/bgt/components/delegate/content';
import Incentives from '@/sections/bgt/validator/components/incentives';

const StakeBGT = (props: any) => {
  const { className, pageData, loading, currentValidator, estReturnPerBGT, onClose, onValidatorSelect, incentiveList } = props;

  const store: any = useBgtStore();

  return (
    <Card className={clsx("rounded-[20px] !max-h-[80dvh] !overflow-y-auto !p-[46px_30px_54px] md:!p-[23px_15px_27px] w-[970px] md:w-full md:max-h-[80dvh] md:overflow-y-auto", className)}>
      <Nav
        pageData={pageData}
        isAction={false}
        className="w-full !p-[16px_30px_18px] md:!p-[8px_15px_9px] !h-[unset]"
      />
      <div className="grid grid-cols-2 gap-[30px] md:grid-cols-1 mt-[24px]">
        <div className="w-full bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[21px_22px_20px_13px] md:order-2">
          <div className="grid grid-cols-2 gap-[20px]">
            <LabelValue label="Validator Ranking">
              {
                loading ? (
                  <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
                ) : (
                  <>
                    {pageData?.dynamicData?.activeBoostAmountRank} of {store?.totalCount ?? 0}
                  </>
                )
              }
            </LabelValue>
            <LabelValue label="Block Proposing Rate">
              {
                loading ? (
                  <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
                ) : (
                  <>
                    {Big(pageData?.blockProposingRate ?? 0).toFixed(2)}%
                  </>
                )
              }
            </LabelValue>
            <LabelValue label="Boost APY">
              {
                loading ? (
                  <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
                ) : (
                  <>
                    {numberFormatter(Big(currentValidator?.dynamicData?.boostApr ?? 0).times(100), 2, true)}%
                  </>
                )
              }
            </LabelValue>
            <LabelValue label="Est. Return per BGT">
              {
                loading ? (
                  <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
                ) : (
                  <>
                    {numberFormatter(estReturnPerBGT, 2, true)}
                  </>
                )
              }
            </LabelValue>
          </div>
          <Incentives
            className="mt-[30px]"
            list={incentiveList}
            loading={loading}
            listClassName="!grid-cols-1 !max-h-[260px] md:!max-h-[unset] !overflow-y-auto"
          />
        </div>
        <div className="w-full bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[24px_20px_20px_20px] md:order-1">
          <DelegateContent
            visible={true}
            validator={pageData}
            operationType="delegate"
            onClose={onClose}
            onValidatorSelect={onValidatorSelect}
            isFromVaults={true}
          />
        </div>
      </div>
    </Card>
  );
};

export default StakeBGT;

const LabelValue = (props: any) => {
  const { className, label, children, labelClassName, valueClassName } = props;

  return (
    <div className={clsx("flex flex-col gap-[10px] text-[#3D405A] font-Montserrat text-[14px] font-medium", className)}>
      <div className={clsx('', labelClassName)}>
        {label}
      </div>
      <div className={clsx("text-black font-Montserrat text-[20px] font-semibold leading-[90%]", valueClassName)}>
        {children}
      </div>
    </div>
  );
};
