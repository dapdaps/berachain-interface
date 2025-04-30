import LazyImage from '@/components/layz-image';
import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import { bera } from '@/configs/tokens/bera';
import Button from '@/components/button';

export const ColumnPool = (props: any) => {
  const { className, data, nameClassName, iconClassName } = props;

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      <div className={clsx("flex items-center min-w-[50px]", iconClassName)}>
        <LazyImage
          src={data.metadata?.logoURI}
          width={30}
          height={30}
          containerClassName={clsx("shrink-0 rounded-full overflow-hidden")}
          fallbackSrc="/assets/tokens/default_icon.png"
        />
      </div>
      <div className={clsx("text-black font-Montserrat text-[16px] font-medium leading-[100%]", nameClassName)}>
        {data.stakingToken?.symbol}
      </div>
    </div>
  );
};

export const ColumnPosition = (props: any) => {
  const { className, data } = props;

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      {numberFormatter(data.positionAmount, 2, true, { isShort: true, isShortUppercase: true })}
    </div>
  );
};

export const ColumnTVL = (props: any) => {
  const { className, data } = props;

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      {numberFormatter(data.dynamicData?.tvl, 2, true, { isShort: true, isShortUppercase: true, prefix: "$" })}
    </div>
  );
};

export const ColumnAPR = (props: any) => {
  const { className, data } = props;

  return (
    <div className={clsx("flex flex-col whitespace-nowrap", className)}>
      <div className="text-[#6CA200]">
        LBGT: {numberFormatter(Big(data.LBGTApr || 0).times(100), 2, true, { isShort: true, isShortUppercase: true })}%
      </div>
      <div className="">
        BGT: {numberFormatter(Big(data.dynamicData?.apr || 0).times(100), 2, true, { isShort: true, isShortUppercase: true })}%
      </div>
    </div>
  );
};

export const ColumnReward = (props: any) => {
  const { className, data } = props;

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      <LazyImage
        src={bera["lbgt"].icon}
        width={24}
        height={24}
        containerClassName={clsx("shrink-0 rounded-full overflow-hidden")}
      />
      <div className="">
        {numberFormatter(data.estimateMintAmount, 2, true, { isShort: true, isShortUppercase: true })}
      </div>
    </div>
  );
};

export const ColumnAction = (props: any) => {
  const { className, data, pending, currentItem, onChangeData } = props;

  const disabled = !data.estimateMintAmount || Big(data.estimateMintAmount).lte(0);
  if (data.approved) {
    return (
      <Button
        type="primary"
        disabled={false}
        className={clsx("shrink-0 !h-[30px] w-full !text-[14px] !font-[500] !rounded-[10px] !leading-[1]", className)}
        loading={pending && currentItem?.id === data.id}
        onClick={() => {
          onChangeData?.(data, "mint");
        }}
      >
        Mint
      </Button>
    );
  }
  return (
    <Button
      type="primary"
      disabled={disabled}
      className={clsx("shrink-0 !h-[30px] w-full !text-[14px] !font-[500] !rounded-[10px] !leading-[1]", className)}
      loading={pending && currentItem?.id === data.id}
      onClick={() => {
        onChangeData?.(data, "approve");
      }}
    >
      Approve
    </Button>
  );
};
