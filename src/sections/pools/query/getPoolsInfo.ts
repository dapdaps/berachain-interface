import { multicall, multicallAddresses } from '@/utils/multicall';
import factoryAbi from '../abi/factory-v3';
import poolAbi from '../abi/pool-v3';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default async function getPoolsInfo({
  pools,
  factory,
  provider,
  onSuccess
}: any) {
  try {
    const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

    const poolsCalls = pools.map((pool: any) => ({
      address: factory,
      name: 'getPool',
      params: [pool.token0, pool.token1, pool.fee]
    }));

    const poolsAddress = await multicall({
      abi: factoryAbi,
      calls: poolsCalls,
      options: {},
      multicallAddress,
      provider
    });

    const slotCalls = poolsAddress.map((poolAddress: any) => ({
      address: poolAddress[0],
      name: 'slot0'
    }));

    const slotResponse = await multicall({
      abi: poolAbi,
      calls: slotCalls,
      options: {},
      multicallAddress,
      provider
    });
    onSuccess(
      slotResponse
        .map((slot: any, i: number) => ({
          tick: slot.tick,
          tokenId: pools[i].tokenId
        }))
        .reduce((acc: any, curr: any) => ({ ...acc, [curr.tokenId]: curr }), {})
    );
  } catch (err) {
    console.log('error', err);
    onSuccess({});
  }
}
