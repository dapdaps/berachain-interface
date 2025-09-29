import { Contract, providers, utils } from "ethers";
import { useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import chains from "@/configs/chains";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { setBalance } from "viem/actions";

export const TOKEN_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

export default function useTokenBalance(
  address: string | "native",
  decimals: number,
  chainId: number = 80094
) {
  // console.info('use-token-bal:', address, decimals, chainId);
  const { account, chainId: walletChainId } = useAccount();
  const [tokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fresh, setFresh] = useState(0);

  const getBalance = async () => {
    let _tokenBalance = "0";

    if (!account || !address) return _tokenBalance;
    // console.log('walletChainId:', walletChainId, chainId)

    const rpcUrl = chains[chainId as number].rpcUrls.default.http[0];
    const rpcProvider = new providers.JsonRpcProvider(rpcUrl);

    const _provider = rpcProvider;

    setIsLoading(true);
    try {
      if (
        address === "native" ||
        address === "0x0000000000000000000000000000000000000000"
      ) {
        const rawBalance = await _provider.getBalance(account);
        _tokenBalance = utils.formatEther(rawBalance);
        setTokenBalance(_tokenBalance);
      } else {
        const TokenContract = new Contract(address, TOKEN_ABI, _provider);
        const rawBalance = await TokenContract.balanceOf(account);
        _tokenBalance = utils.formatUnits(rawBalance, decimals);
        setTokenBalance(_tokenBalance);
      }
    } catch (error) {
      setIsError(true);
      console.info("useTokenBalance_ERROR", error);
    } finally {
      setIsLoading(false);
    }

    return _tokenBalance;
  };
  const update = () => {
    setFresh((n) => n + 1);
  };
  useEffect(() => {
    // if (walletChainId !== DEFAULT_CHAIN_ID) {
    //   setTokenBalance("");
    //   return;
    // }
    getBalance();
  }, [account, address, decimals, fresh, chainId, walletChainId]);

  return { tokenBalance, isError, isLoading, update, getTokenBalance: getBalance };
}
