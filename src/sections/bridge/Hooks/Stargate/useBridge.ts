import { useCallback, useState } from 'react';
import { Contract, utils } from 'ethers';
import useAccount from '@/hooks/use-account';
import useToast from '@/hooks/use-toast';
import { Token } from '@/types';
import { chainIds, contractAddresses } from './config';
import Big from 'big.js';

export default function useBridge() {
    const [loading, setLoading] = useState(false);
    const { provider, account, chainId } = useAccount();
    const toast = useToast();

    const execute = useCallback(async (
        {
            fromChainId,
            toChainId,
            token,
            amount,
            fee,
            contractAddress,
        }: {
            fromChainId: number,
            toChainId: number,
            token: Token,
            amount: string,
            fee: {
                nativeFee: string,
                lzTokenFee: string
            },
            contractAddress: string
        }
    ) => {
        if (!provider || !account) return;

        let toastId = null;

        try {
            setLoading(true);
            const signer = provider.getSigner(account);

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
                            {
                                components: [
                                    { name: "nativeFee", type: "uint256" },
                                    { name: "lzTokenFee", type: "uint256" }
                                ],
                                name: "_fee",
                                type: "tuple"
                            },
                            { name: "_refundAddress", type: "address" }
                        ],
                        name: "send",
                        outputs: [
                            {
                                components: [
                                    { name: "guid", type: "bytes32" },
                                    { name: "nonce", type: "uint64" },
                                    {
                                        components: [
                                            { name: "nativeFee", type: "uint256" },
                                            { name: "lzTokenFee", type: "uint256" }
                                        ],
                                        name: "fee",
                                        type: "tuple"
                                    }
                                ],
                                name: "msgReceipt",
                                type: "tuple"
                            },
                            {
                                components: [
                                    { name: "amountSentLD", type: "uint256" },
                                    { name: "amountReceivedLD", type: "uint256" }
                                ],
                                name: "oftReceipt",
                                type: "tuple"
                            }
                        ],
                        stateMutability: "payable",
                        type: "function"
                    }
                ],
                signer
            );

            toastId = toast.loading({ title: "Confirming..." });

            const amountLD = Big(amount).mul(10 ** token.decimals)

            const value = token.isNative ? amountLD.plus(Big(fee.nativeFee).mul(10 ** 18)).toString() : Big(fee.nativeFee).mul(10 ** 18).toString()

            const tx = await contract.send(
                [
                    chainIds[toChainId],
                    utils.hexZeroPad(account, 32),
                    amountLD.toString(),
                    amountLD.mul(1 - 0.005).toString(),
                    '0x',
                    '0x',
                    '0x'
                ],
                [Big(fee.nativeFee).mul(10 ** 18).toString(), Big(fee.lzTokenFee).mul(10 ** 18).toString()],
                account,
                { value }
            );

            toast.dismiss(toastId);
            toastId = toast.loading({ title: "Pending...", tx: tx.hash });

            const receipt = await tx.wait();
            setLoading(false);
            toast.dismiss(toastId);

            if (receipt.status === 1) {
                toast.success({
                    title: "Bridge Successful!",
                    tx: receipt.transactionHash
                });
                return receipt.transactionHash;
            } else {
                toast.fail({ title: "Bridge failed!" });
                return null;
            }

        } catch (err: any) {
            console.error('Bridge failed:', err);
            if (toastId) {
                toast.dismiss(toastId);
            }
           
            toast.fail({
                title: err?.message?.includes("user rejected transaction")
                    ? "User rejected transaction"
                    : "Bridge failed!"
            });
            setLoading(false);
            return null;
        }
    }, [provider, account]);

    return {
        loading,
        execute
    };
}
