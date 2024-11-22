import Modal from '@/components/modal';
import Stake from '@/sections/staking/Bridge/Detail/Stake';
import { useDetail } from '@/sections/staking/Bridge/Detail/hooks';
import { useBerps } from '@/sections/staking/hooks/use-berps';
import { DEFAULT_CHAIN_ID } from '@/configs';
import useAccount from '@/hooks/use-account';
import { useProvider } from '@/hooks/use-provider';
import { useMemo } from 'react';
import multicallAddresses from '@/configs/contract/multicall';
import config from '@/configs/staking/dapps/berps';

const BerpsDeposit = (props: any) => {
  const {
    visible,
    onClose,
  } = props;

  const dexConfig = config?.chains[DEFAULT_CHAIN_ID];
  const { pairs, description } = dexConfig;

  const name = config.name;
  const id = 'BHONEY';

  const { account: sender, chainId } = useAccount();
  const { provider } = useProvider();
  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );

  const { dataList, loading, reload  } = useBerps({
    name: name,
    description,
    pairs,
    sender,
    chainId,
    provider,
    multicallAddress,
    onChangeData: () => {},
  });

  const data = useMemo(() => {
    return dataList?.[0] || {};
  }, [dataList]);

  const {
    state,
    updateState,
    isBERPS,
    symbol,
    isInSufficient,
    handleMax,
    handleTokenChange,
    handleApprove,
    handleDeposit,
  } = useDetail({
    id,
    name,
    data,
    defaultIndex: 0,
  });

  const {
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
  } = state;

  if (!visible) return null;

  const handleClose = () => {
    onClose?.();
    updateState({
      inAmount: '',
    });
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
    >
      <div className="px-[20px] pb-[20px] w-[520px] bg-[#FFFDEB] rounded-[20px] border border-black md:w-full md:px-[12px] md:rounded-b-none">
        <div className="pt-[27px] pb-[10px] flex justify-between md:pt-[16px] text-[20px] font-bold">
          Provide HONEY-bHONEY
        </div>
        <div className="">
          <Stake
            id={id}
            symbol={symbol}
            data={data}
            inAmount={inAmount}
            handleTokenChange={handleTokenChange}
            balances={balances}
            isBERPS={isBERPS}
            isInSufficient={isInSufficient}
            isTokenApproved={isTokenApproved}
            isTokenApproving={isTokenApproving}
            isLoading={isLoading}
            handleDeposit={handleDeposit}
            handleApprove={handleApprove}
            handleMax={handleMax}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BerpsDeposit;
