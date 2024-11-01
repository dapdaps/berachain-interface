import Position from '@/sections/Lending/Dolomite/position/index';
import PositionAdd from '@/sections/Lending/Dolomite/position/add';
import Skeleton from 'react-loading-skeleton';
import React from 'react';
import { beraB } from '@/configs/tokens/bera-bArtio';
import useAddAction from '@/hooks/use-add-action';

const PositionList = (props: any) => {
  const { data, loading, ...restProps } = props;

  const { addAction } = useAddAction("lending");

  const positionList = data?.positionList || [];

  const markets: any = data?.markets ?? {};
  const addMarkets: any = {};
  for (const market in markets) {
    if (market.toLowerCase() === beraB['wbera'].address.toLowerCase()) continue;
    addMarkets[market] = markets[market];
  }

  return (
    <div className="max-h-[calc(100vh_-_300px)] overflow-x-hidden overflow-y-auto">
      {
        loading ? (
          <div className="mb-[30px]">
            <Skeleton height={151} />
            <div className="flex justify-between items-stretch gap-[30px] mt-[24px]">
              <Skeleton width={444} height={311} />
              <Skeleton width={444} height={311} />
            </div>
          </div>
        ) : positionList.map((position: any, idx: number) => (
          <Position key={idx} position={position} addAction={addAction} {...restProps} />
        ))
      }
      <PositionAdd markets={addMarkets} loading={loading} addAction={addAction} {...restProps} />
    </div>
  );
};

export default PositionList;

interface Props {}
