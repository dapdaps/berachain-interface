import { multicall } from "@/utils/multicall";
import { useState } from "react";
import { useAccount } from "wagmi";

const useData = () => {
  const [assetsToSupply, setAssetsToSupply] = useState([]);
  const { address } = useAccount()

  function getBendSupplyBalance() {
    const _assetsToSupply = [...assetsToSupply];
    const underlyingAsset = _assetsToSupply?.map(
      (item: any) => item.underlyingAsset
    );
    const calls = underlyingAsset?.map((addr: any) => ({
      address: addr,
      name: "balanceOf",
      params: [address],
    }));
    multicall({
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      calls,
      options: {},
      multicallAddress,
      provider,
    })
      .then((balances: any) => {
        return balances?.map((balance: any) => balance?.toString() || 0);
      })
      .then((userBalances: any) => {
        console.log("getUserBalance--", userBalances);
        if (userBalances.every((item: any) => item === null)) {
          onLoad({
            isShowReloadModal: true,
          });
        } else {
          const _assetsToSupply = [...state.assetsToSupply];
          for (let index = 0; index < _assetsToSupply.length; index++) {
            const item = _assetsToSupply[index];
            const _bal = userBalances[index];
            const balanceRaw = Big(_bal || 0).div(Big(10).pow(item.decimals));
            const _balance = balanceRaw.toFixed(item.decimals, ROUND_DOWN);

            const _balanceInUSD = balanceRaw
              .times(Big(item.tokenPrice || 1))
              .toFixed();

            item.balance = _balance;
            item.balanceInUSD = _balanceInUSD;
          }

          onLoad({
            assetsToSupply: _assetsToSupply,
          });
        }
      })
      .catch((err: any) => {
        console.log("getBendHoneyBalance_err:", err);
      });
  }
};

export default useData;
