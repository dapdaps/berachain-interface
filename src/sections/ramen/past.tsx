import clsx from 'clsx';
import Title from '@/sections/ramen/components/title';
import Item from '@/sections/ramen/components/item';
import Header from '@/sections/ramen/components/header';

const PastLaunches = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('', className)}>
      <Title className="mt-[38px]">Past Launches</Title>
      <Header />
      <div className="flex flex-col items-stretch gap-[12px] max-h-[calc(100dvh_-_680px)] overflow-x-hidden overflow-y-auto">
        <Item project={PROJECT} />
        <Item project={PROJECT} />
        <Item project={PROJECT} />
        <Item project={PROJECT} />
        <Item project={PROJECT} />
        <Item project={PROJECT} />
      </div>
    </div>
  );
};

export default PastLaunches;

// FIXME Test data
export const PROJECT = {
  "id": "9eb02544-d83e-46fc-b580-dc7edc5f4d41",
  "slug": "gaymen",
  "name": "Gaymen Finance",
  "launch_types": "PRICE_DISCOVERY",
  "token_name": "Gaymen Finance",
  "token_symbol": "GAYMEN",
  "token_decimals": 18,
  "token_icon_url": "https://storage.googleapis.com/ramen-finance-staging/8806ff19-8ab8-4262-91cb-cdc2881e13ce",
  "participants": 1265,
  "total_raised": 42069690000000000000000,
  "total_raised_in_ether": "42069.690000000000000000",
  "sale_price_in_bera": 10000000000000000,
  "sale_price_in_bera_in_ether": "0.010000000000000000",
  "sale_price_in_usd": "8.06",
  "date_ended": "2025-02-02T14:00:01Z",
  "whitelisted_participants": 0,
  "token_address": "0x7a8657955c177923174a7aF4F4577503aF9aaC57",
  "ath_roi": {
    "Float64": 0,
    "Valid": false
  },
  "is_build_a_bera": true,
  "period": {
    "registration": "0",
    "allocation_announcement": "0",
    "airdrop": "0",
    "private_sale": "0",
    "contribution": "0",
    "overflow": "0",
    "auction": "172800",
    "base_lock": "7200",
    "lp_lock": "300"
  }
};
