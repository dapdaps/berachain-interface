import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import islandAbi from "../abi/island";
import poolV2Abi from "../../../abi/pool-v2";
import farmAbi from "../abi/farm";
import bexFarmAbi from "../abi/bex-farm";
import { getTokenAmountsV2 } from "../../../helpers";
import Big from "big.js";
import { BAULT_ABI } from "../../baults/abi";

export default function useUserInfo(data: any) {
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { account, provider } = useCustomAccount();

  const queryInfo = async (params?: { isLoading?: boolean; }) => {
    const { isLoading = true } = params ?? {};

    try {
      setLoading(!!isLoading);

      const IslandContract = new Contract(
        data.id,
        data.type === "v2" ? poolV2Abi : islandAbi,
        provider
      );
      let balanceRes: any;
      try {
        balanceRes = await IslandContract.balanceOf(account);
      } catch (err) {
        console.log('balanceOf error: %o', err);
      }

      let reverses: any;
      try {
        reverses = await IslandContract[
          data.type === "v2" ? "getReserves" : "getUnderlyingBalances"
        ]();
      } catch(err: any) {
        console.log('%s error: %o', data.type === "v2" ? "getReserves" : "getUnderlyingBalances", err);
      }

      const totalSupply = Big(data.tokenLp.totalSupply || 0)
        .mul(10 ** data.tokenLp.decimals)
        .toString();

      const reserve0 = reverses[0].toString();
      const reserve1 = reverses[1].toString();

      const balance = Big(balanceRes.toString() || 0)
        .div(1e18)
        .toString();

      const balanceUsd = Big(balance || 0)
        .mul(data.tokenLp.price || 0)
        .toString();

      let locked = null;
      let lockedBault: any;
      let total = Big(balanceRes.toString());
      let withdrawLp = Big(0);
      let earnedRes = [];

      if (data.farm.id) {
        const FarmContract = new Contract(
          data.farm.id,
          data.farm.provider === "kodiak" ? farmAbi : bexFarmAbi,
          provider
        );
        const stakedRes =
          data.farm.provider === "kodiak"
            ? await FarmContract.lockedStakesOf(account)
            : await FarmContract.balanceOf(account);
        earnedRes = await FarmContract.earned(account);

        if (stakedRes && stakedRes.length && data.farm.provider === "kodiak") {
          let totalAmount = Big(0);
          const items: any = [];

          stakedRes.forEach((item: any) => {
            totalAmount = totalAmount.add(item.liquidity.toString());
            const unlocked = Big(item.ending_timestamp.toString()).lt(
              Date.now() / 1000
            );
            const { amount0, amount1 } = getTokenAmountsV2({
              liquidity: item.liquidity.toString(),
              totalSupply: totalSupply.toString(),
              reserve0,
              reserve1,
              token0: data.token0,
              token1: data.token1
            });
            items.push({
              multiplier: Big(item.lock_multiplier.toString())
                .div(1e18)
                .toFixed(2),
              ending_timestamp: item.ending_timestamp.toString(),
              start_timestamp: item.start_timestamp.toString(),
              kek_id: item.kek_id,
              unlocked,
              liquidity: item.liquidity.toString(),
              amount0,
              amount1
            });
            if (unlocked)
              withdrawLp = withdrawLp.add(item.liquidity.toString());
          });

          total = total.add(totalAmount);
          const amount = totalAmount.div(1e18).toString();
          locked = {
            amount,
            amountUsd: Big(amount || 0)
              .mul(data.tokenLp.price || 0)
              .toString(),
            items
          };
        }

        if (data.farm.provider === "bgt") {
          total = total.add(stakedRes ? stakedRes.toString() : 0);
          const amount = Big(stakedRes ? stakedRes.toString() : 0)
            .div(1e18)
            .toString();
          locked = {
            amount,
            amountUsd: Big(amount || 0)
              .mul(data.tokenLp.price || 0)
              .toString(),
            items: []
          };
          earnedRes = [earnedRes];
        }
      }

      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity: total.toString(),
        totalSupply: totalSupply.toString(),
        reserve0,
        reserve1,
        token0: data.token0,
        token1: data.token1
      });

      const { amount0: withdrawAmount0, amount1: withdrawAmount1 } =
        getTokenAmountsV2({
          liquidity: withdrawLp.add(balanceRes.toString()).toString(),
          totalSupply: totalSupply.toString(),
          reserve0,
          reserve1,
          token0: data.token0,
          token1: data.token1
        });

      const { amount0: balanceAmount0, amount1: balanceAmount1 } =
        getTokenAmountsV2({
          liquidity: balanceRes.toString(),
          totalSupply: totalSupply.toString(),
          reserve0,
          reserve1,
          token0: data.token0,
          token1: data.token1
        });

      if (data.baults?.[0]) {
        const BaultContract = new Contract(
          data.baults[0].id,
          BAULT_ABI,
          provider
        );
        try {
          const baultBalance = await BaultContract.balanceOf(account);
          const baultBalanceFormatted = utils.formatUnits(baultBalance || "0", data.tokenLp.decimals);
          lockedBault = {
            balance: baultBalanceFormatted,
          };
          try {
            const baultTokenLpAmount = await BaultContract.convertToAssets(baultBalance);
            lockedBault.receiveLpAmount = utils.formatUnits(baultTokenLpAmount || "0", data.tokenLp.decimals);
            lockedBault.receiveLpAmountUsd = Big(lockedBault.receiveLpAmount || 0).mul(data.tokenLp.price || 0).toString();
          } catch (err: any) {
            console.log('convertToAssets error: %o', err);
          }
        } catch (err: any) {
          console.log('balanceOf error: %o', err);
        }
      }

      setInfo({
        token0Amount: amount0,
        token1Amount: amount1,
        balanceAmount0: balanceAmount0,
        balanceAmount1: balanceAmount1,
        total: total.toString(),
        balanceUsd,
        balance,
        locked,
        lockedBault,
        earned: earnedRes?.map((it: any) =>
          Big(it?.toString() || 0)
            .div(1e18)
            .toFixed(18)
        ),
        withdraw: {
          amount: withdrawLp.toString(),
          amount0: withdrawAmount0,
          amount1: withdrawAmount1
        },
        reserve0,
        reserve1
      });
    } catch (err) {
      console.log(err);
      setInfo({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account && provider) {
      queryInfo();
    } else {
      setLoading(false);
    }
  }, [account, provider]);

  return { info, loading, queryInfo };
}
