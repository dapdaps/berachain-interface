import LazyImage from '@/components/layz-image';
import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import { bera } from '@/configs/tokens/bera';
import Button from '@/components/button';

export const ColumnPool = (props: any) => {
  const { className, data, nameClassName, iconClassName } = props;

  const isStake = data.type === 'stake';

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      <div className={clsx("flex items-center min-w-[50px]", iconClassName)}>
        {
          isStake ? data.underlying_tokens.map((token: any, index: number) => (
            <LazyImage
              key={index}
              src={token.icon}
              width={30}
              height={30}
              containerClassName={clsx("shrink-0 rounded-full overflow-hidden", index > 0 && "ml-[-10px]")}
              fallbackSrc="/assets/tokens/default_icon.png"
            />
          )) : (
            <LazyImage
              src={data.metadata?.logoURI}
              width={30}
              height={30}
              containerClassName={clsx("shrink-0 rounded-full overflow-hidden")}
              fallbackSrc="/assets/tokens/default_icon.png"
            />
          )
        }
      </div>
      <div className={clsx("text-black font-Montserrat text-[16px] font-medium leading-[100%]", nameClassName)}>
        {
          isStake
            ? data.underlying_tokens.map((token: any, index: number) => token.symbol).join("-")
            : data.stakingToken?.symbol
        }
      </div>
    </div>
  );
};

export const ColumnPosition = (props: any) => {
  const { className, data } = props;

  const isStake = data.type === 'stake';

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      {numberFormatter(isStake ? data.user_stake?.amount : data.positionAmount, 2, true, { isShort: true, isShortUppercase: true })}
    </div>
  );
};

export const ColumnTVL = (props: any) => {
  const { className, data } = props;

  const isStake = data.type === 'stake';

  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      {numberFormatter(isStake ? data.tvl : data.dynamicData?.tvl, 2, true, { isShort: true, isShortUppercase: true, prefix: "$" })}
    </div>
  );
};

export const ColumnAPR = (props: any) => {
  const { className, data } = props;

  const isStake = data.type === 'stake';

  return (
    <div className={clsx("flex flex-col whitespace-nowrap", className)}>
      {
        isStake ? data.reward_tokens.map((token: any, index: number) => (
          <div className="text-[#6CA200]" key={index}>
            {token.symbol}: {numberFormatter(Big(token.apr || 0), 2, true, { isShort: true, isShortUppercase: true })}%
          </div>
        )) : (
          <>
            <div className="text-[#6CA200]">
              LBGT: {numberFormatter(Big(data.LBGTApr || 0).times(100), 2, true, { isShort: true, isShortUppercase: true })}%
            </div>
            <div className="">
              BGT: {numberFormatter(Big(data.dynamicData?.apr || 0).times(100), 2, true, { isShort: true, isShortUppercase: true })}%
            </div>
          </>
        )
      }
    </div>
  );
};

export const ColumnReward = (props: any) => {
  const { className, data } = props;

  const isStake = data.type === 'stake';

  return (
    <div className={clsx("flex items-center", className)}>
      {
        isStake ? data.reward_tokens.map((token: any, index: number) => (
          <LazyImage
            key={index}
            src={token.icon}
            width={24}
            height={24}
            containerClassName={clsx("shrink-0 rounded-full overflow-hidden", index > 0 && "ml-[-10px]")}
          />
        )) : (
          <LazyImage
            src={bera["lbgt"].icon}
            width={24}
            height={24}
            containerClassName={clsx("shrink-0 rounded-full overflow-hidden")}
          />
        )
      }
      {
        !isStake && (
          <div className="">
            {numberFormatter(data.estimateMintAmount, 2, true, { isShort: true, isShortUppercase: true })}
          </div>
        )
      }
    </div>
  );
};

export const ColumnAction = (props: any) => {
  const { className, data, pending, currentItem, onChangeData } = props;
  const buttonClassName = "shrink-0 !h-[30px] w-full !text-[14px] !font-[500] !rounded-[10px] !leading-[1]";

  const isStake = data.type === 'stake';

  if (isStake) {
    return (
      <div className="flex items-center gap-[8px]">
        <Button
          type="primary"
          disabled={false}
          className={clsx(buttonClassName, "!w-[30px] !p-0 !border-0", className)}
          loading={pending && currentItem?.id === data.id}
          onClick={() => {
            onChangeData?.(data, 0);
          }}
        >
          <img src="/images/vaults/v2/deposit.svg" alt="" />
        </Button>
        <Button
          type="primary"
          disabled={Big(data.user_stake?.amount || 0).lte(0)}
          className={clsx(buttonClassName, "!w-[30px] !p-0 !border-0", className)}
          loading={pending && currentItem?.id === data.id}
          onClick={() => {
            onChangeData?.(data, 1);
          }}
        >
          <img src="/images/vaults/v2/withdraw.svg" alt="" />
        </Button>
      </div>
    );
  }

  const disabled = !data.estimateMintAmount || Big(data.estimateMintAmount).lte(0);
  if (data.approved) {
    return (
      <Button
        type="primary"
        disabled={false}
        className={clsx(buttonClassName, className)}
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
      className={clsx(buttonClassName, className)}
      loading={pending && currentItem?.id === data.id}
      onClick={() => {
        onChangeData?.(data, "approve");
      }}
    >
      Approve
    </Button>
  );
};
