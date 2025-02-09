import { useCallback, useEffect, useState } from 'react';
import { Contract, providers, utils } from 'ethers';
import useAccount from '@/hooks/use-account';
import { Token } from '@/types';
import chains from '@/configs/chains';
import Big from 'big.js';
import { chainIds, contractAddresses } from './config';


interface Props {
    fromChainId: number
    toChainId: number
    token: Token
    amount: string
}

export default function useQuote({ fromChainId, toChainId, token, amount }: Props) {
    const [loading, setLoading] = useState(false);
    const [fee, setFee] = useState<{ nativeFee: string, lzTokenFee: string } | null>(null);
    const [receiveAmount, setReceiveAmount] = useState<string | null>(null);
    const { account, chainId } = useAccount();
    const [contractAddress, setContractAddress] = useState<string | null>(null);

    const getQuote = useCallback(async (
        params: {
            dstEid: number,
            to: string,
            amountLD: string,
            minAmountLD: string,
            extraOptions: string,
            composeMsg: string,
            oftCmd: string
        },
        payInLzToken: boolean = false
    ) => {
        const { JsonRpcProvider } = providers;

        const chain = chains[fromChainId];

        const provider = new JsonRpcProvider(chain.rpcUrls.default.http[0]);

        const contractAddress = contractAddresses[fromChainId][token.symbol.toUpperCase()]
        //  token.isNative ? contractAddresses[fromChainId].native : contractAddresses[fromChainId].usdc
        setContractAddress(contractAddress)
        setReceiveAmount(null)
        setFee(null)
        try {
            setLoading(true);
            const contract = new Contract(
                contractAddress,
                [
                    {
                        inputs: [
                            {
                                components: [
                                    { name: "dstEid", type: "uint32" },
                                    { name: "to", type: "bytes32" },
                                    { name: "amountLD", type: "uint256" },
                                    { name: "minAmountLD", type: "uint256" },
                                    { name: "extraOptions", type: "bytes" },
                                    { name: "composeMsg", type: "bytes" },
                                    { name: "oftCmd", type: "bytes" }
                                ],
                                name: "_sendParam",
                                type: "tuple"
                            },
                            { name: "_payInLzToken", type: "bool" }
                        ],
                        name: "quoteSend",
                        outputs: [
                            {
                                components: [
                                    { name: "nativeFee", type: "uint256" },
                                    { name: "lzTokenFee", type: "uint256" }
                                ],
                                name: "fee",
                                type: "tuple"
                            }
                        ],
                        stateMutability: "view",
                        type: "function"
                    }
                ],
                provider
            );

            const result = await contract.quoteSend(
                [
                    params.dstEid,
                    params.to,
                    params.amountLD,
                    params.minAmountLD,
                    params.extraOptions,
                    params.composeMsg,
                    params.oftCmd
                ],
                payInLzToken
            );

            console.log('Big(result.nativeFee.toString()).div(10 ** 18).toString():', Big(result.nativeFee.toString()).div(10 ** 18).toString())

            setFee({
                nativeFee: Big(result.nativeFee.toString()).div(10 ** 18).toString(),
                lzTokenFee: Big(result.lzTokenFee.toString()).div(10 ** 18).toString()
            });

            setReceiveAmount(Big(params.amountLD).div(10 ** token.decimals).toString());

        } catch (err) {
            console.error('Failed to get quote:', err);
            setFee(null);
        } finally {
            setLoading(false);
        }
    }, [fromChainId, token, chainId]);

    useEffect(() => {
        if (!account) return;

        if (!amount || Number(amount) <= 0) {
            setFee(null)
            setReceiveAmount(null)
            return
        }

        (async () => {
            const amountLD = Big(amount).mul(10 ** token.decimals)
            await getQuote({
                dstEid: chainIds[toChainId],
                to: utils.hexZeroPad(account, 32),
                amountLD: amountLD.toString(),
                minAmountLD: amountLD.mul(1 - 0.005).toFixed(0, 0),
                extraOptions: token.symbol.toUpperCase() === 'LBTC' ? '0x00030100110100000000000000000000000000030d40' : '0x',
                composeMsg: '0x',
                oftCmd: '0x'
            })

        })()
    }, [toChainId, fromChainId, token, amount, account])

    return {
        loading,
        fee,
        contractAddress,
        receiveAmount,
        getQuote
    };
}
