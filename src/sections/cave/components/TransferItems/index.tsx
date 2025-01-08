import Card from '@/components/card';
import TransferItem from '@/sections/cave/components/TransferItems/Item';
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';
import { trim } from 'lodash';
import { readClipboard } from '@/utils/utils';
import useCustomAccount from '@/hooks/use-account';
import { useEffect, useMemo, useState } from 'react';
import Loading from '@/components/loading';
import Big from 'big.js';
import { numberRemoveEndZero } from '@/utils/number-formatter';
import { post } from '@/utils/http';
import useToast from '@/hooks/use-toast';

const ADDR_VALID_REASON_0 = (username: string) => `TG account has bounded: @${username}`;
const ADDR_VALID_REASON_1 = 'No TG account was detected.';
const ADDR_VALID_REASON_2 = 'Unable to transfer boost items to yourself.';
const ADDR_VALID_REASON_3 = 'Failed to query binding information.';

const TransferItems = (props: any) => {
  const { onAfterTransfer } = props;

  const {
    transferItems,
    transferAddress,
    transferSelectedItems,
    setTransferAddress,
    setTransferSelectedItems,
    setTransferItemsVisible,
  } = useTransferItemsStore();
  const { account } = useCustomAccount();
  const toast = useToast();

  const [addressValid, setAddressValid] = useState<boolean>(false);
  const [addressValidReason, setAddressValidReason] = useState<string>('');
  const [addressValidLoading, setAddressValidLoading] = useState<boolean>(false);
  const [transferPending, setTransferPending] = useState<boolean>(false);

  const speed = useMemo(() => {
    if (!transferSelectedItems || !transferSelectedItems.length) return numberRemoveEndZero(Big(1).toFixed(2));
    const total = transferSelectedItems.map((it) => it.bonus_percentage).reduce((a, b) => Big(a).plus(b), Big(0));
    return numberRemoveEndZero(Big(1).plus(Big(total).div(100)).toFixed(2));
  }, [transferSelectedItems]);

  const selectedAll = useMemo(() => {
    if (!transferItems || !transferSelectedItems) return false;
    return transferItems.length === transferSelectedItems.length;
  }, [transferSelectedItems, transferItems]);

  const handleAddressChange = (e: any) => {
    const addr = trim(e.target.value);
    setTransferAddress(addr);
    setAddressValidReason('');
    setAddressValid(false);
  };

  const handleAddressBlur = async (e: any) => {
    setAddressValidLoading(true);
    const addr = trim(e.target.value);
    if (!addr || !account) {
      setAddressValidReason('');
      setAddressValidLoading(false);
      setAddressValid(false);
      return;
    }
    if (addr.toLowerCase() === account.toLowerCase()) {
      setAddressValidReason(ADDR_VALID_REASON_2);
      setAddressValidLoading(false);
      setAddressValid(false);
      return;
    }
    if (!/^0x/.test(addr)) {
      setAddressValidReason(ADDR_VALID_REASON_1);
      setAddressValidLoading(false);
      setAddressValid(false);
      return;
    }
    try {
      const response = await fetch(`/dapdap.game/api/user/bind?address=${addr}`);
      const result = await response.json();
      if (result.code !== 200) {
        setAddressValidReason(result.message || ADDR_VALID_REASON_3);
        setAddressValidLoading(false);
        setAddressValid(false);
        return;
      }
      if (result.data.tg_user_id) {
        setAddressValid(true);
        setAddressValidLoading(false);
        setAddressValidReason(ADDR_VALID_REASON_0(result.data.tg_username));
        return;
      }
    } catch (err: any) {
      console.log('check user bind failed: %o', err);
      setAddressValidReason(ADDR_VALID_REASON_3);
      setAddressValid(false);
      setAddressValidLoading(false);
      return;
    }
    setAddressValid(false);
    setAddressValidLoading(false);
    setAddressValidReason(ADDR_VALID_REASON_1);
  };

  const handleSelectedAll = () => {
    if (selectedAll) {
      setTransferSelectedItems([]);
      return;
    }
    setTransferSelectedItems(transferItems);
  };

  const handleTransfer = async () => {
    if (transferPending || addressValidLoading) return;
    setTransferPending(true);
    toast.dismiss();
    try {
      const res = await post('/api/game/items/transfer', {
        items: transferSelectedItems.map((it) => it.id),
        address: transferAddress,
      });
      if (res.code !== 0) {
        toast.fail({
          title: 'Transfer failed',
          text: res?.message ?? '',
        });
        setTransferPending(false);
        return;
      }
      toast.success({
        title: 'Transfer successful!',
      });
      setTransferItemsVisible(false);
      onAfterTransfer?.();
    } catch (err: any) {
      console.log('transfer failed: %o', err);
      toast.fail({
        title: 'Transfer failed',
        text: err?.message ?? '',
      });
      setTransferPending(false);
    }
  };

  useEffect(() => {
    return () => {
      setTransferAddress('');
      setAddressValidReason('');
      setAddressValid(false);
      setTransferSelectedItems([]);
    };
  }, []);

  return (
    <Card className="w-[702px] lg:!rounded-[20px] md:w-full md:!rounded-t-[20px] md:!rounded-b-0 pt-[20px] !px-0 pb-[33px]">
      <div className="text-black text-[32px] md:text-[28px] font-CherryBomb text-center font-[400] leading-[90%]">
        Transfer Boost Items
      </div>
      <div className="max-h-[calc(100dvh_-_200px)] md:max-h-[calc(100dvh_-_300px)] overflow-x-hidden overflow-y-auto px-[32px]">
        <div className="mt-[20px] flex justify-between items-start gap-[15px] md:flex-col">
          <div className="flex: 1">
            <div className="text-[#000] font-[Montserrat] text-[18px] font-bold leading-[100%] md:text-[16px] md:items-stretch">
              Choose Boost Items
            </div>
            <div className="mt-[5px] text-[#000] font-[Montserrat] text-[16px] font-medium leading-[150%] md:text-[14px]">
              Choose items below to Beraciaga (the TG game) for boost mining. <br />The highest level in the each category will boost in Beraciaga.
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 disabled:opacity-30 disabled:!cursor-not-allowed text-[#3672F4] md:ml-auto text-center font-[Montserrat] text-[14px] font-semibold leading-[100%] underline decoration-solid decoration-skip-ink-[none] underline-offset-[auto] underline-position-[from-font]"
            disabled={addressValidLoading}
            onClick={handleSelectedAll}
          >
            {selectedAll ? 'Uncheck All' : 'Check All'}
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-x-[6px] gap-y-[5px] mt-[12px]">
          {
            transferItems?.map((it, idx) => (
              <TransferItem
                key={idx}
                item={it}
              />
            ))
          }
        </div>
        <div className="text-[#000] font-[Montserrat] text-[16px] font-bold leading-[100%] mt-[28px]">
          Transfer to Beraciaga Account
        </div>
        <div className="flex justify-between items-center w-full h-[52px] rounded-[16px] border border-[#000] bg-white mt-[17px]">
          <input
            type="text"
            className="text-[#000] font-[Montserrat] text-[16px] font-medium leading-[50px] flex-1 h-full rounded-[16px] px-[20px]"
            value={transferAddress}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
            readOnly={addressValidLoading}
          />
          <button
            type="button"
            className="shrink-0 px-[12px] text-[#3672F4] text-center font-[Montserrat] text-[14px] font-semibold leading-[100%] underline decoration-solid decoration-[auto] decoration-skip-ink-[none] underline-offset-[auto] underline-position-[from-font]"
            onClick={async () => {
              if (addressValidLoading) return;
              const val = await readClipboard();
              setTransferAddress(trim(val));
              handleAddressBlur({ target: { value: trim(val) } });
            }}
          >
            {
              addressValidLoading ? (
                <Loading size={14} />
              ) : (
                <>Paste</>
              )
            }
          </button>
        </div>
        <div className="flex justify-start items-center gap-[5px] mt-[10px]">
          {
            !!addressValidReason && (addressValid ? (
              <img src="/images/cave/icon-form-checked.svg" alt="" className="w-[24px] h-[24px] shrink-0" />
            ) : (
              <img src="/images/cave/icon-form-warning.svg" alt="" className="w-[24px] h-[24px] shrink-0" />
            ))
          }
          <div className="text-[#000] font-[Montserrat] text-[16px] font-medium leading-[150%]">
            {addressValidReason}
          </div>
        </div>
        <div className="mt-[25px] relative w-full h-[128px] bg-[url('/images/cave/transfer-slogan.svg')] bg-no-repeat bg-center bg-contain">
          <div className="absolute bottom-0 left-[45%] md:left-[38.5%] -translate-y-1/2 w-[56px] h-[56px] bg-[url('/images/cave/transfer-flash-bg.svg')] bg-no-repeat bg-center bg-cover border-[2px] border-[#709d28] bg-[#c7ff6d] rounded-full flex justify-center items-center text-[#6376FF] text-center text-stroke-[1px] text-stroke-[#E1FF0A] font-[Montserrat] text-[20px] italic font-extrabold leading-[100%]">
            {speed}x
          </div>
        </div>
      </div>
      <div className="mt-[15px] flex justify-center">
        <button
          type="button"
          className="px-[80px] flex disabled:opacity-30 disabled:!cursor-not-allowed justify-center items-center gap-[8px] h-[54px] bg-[#FFD335] border border-black rounded-[16px] text-[16px] text-black font-[700] font-[Montserrat]"
          disabled={addressValidLoading || !transferSelectedItems || !transferSelectedItems.length || !addressValid || transferPending}
          onClick={handleTransfer}
        >
          {
            addressValidLoading || transferPending && (
              <Loading size={16} />
            )
          }
          Transfer Now
        </button>
      </div>
    </Card>
  );
};

export default TransferItems;
