import Big from 'big.js';
import { ethers, Contract, Signer, providers, utils } from 'ethers'

import { checkTransitionOnlineStatus, getFullNum, getIcon } from '../../util/index'
import chainConfig from '../../util/chainConfig'
import { getQuoteInfo, setQuote } from '../../util/routerController'
import { FeeType } from '../../type/index'

import type { QuoteRequest, QuoteResponse, ExecuteRequest, StatusParams } from '../../type/index'
import { approve } from '../../util/approve';
import chains from '@/configs/chains';
import { contractAddresses, chainIds, tokenParams } from './config';

const icon = getIcon('stargate')
const { JsonRpcProvider } = providers

export async function getQuote(request: QuoteRequest, signer: Signer): Promise<QuoteResponse | null> {
    const dstEid = chainIds[Number(request.toChainId)]
    console.log('dstEid:', dstEid)

    const params: {
        dstEid: number,
        to: string,
        amountLD: string,
        minAmountLD: string,
        extraOptions: string,
        composeMsg: string,
        oftCmd: string
    } = {
        dstEid,
        to: utils.hexZeroPad(request.destAddress, 32),
        amountLD: request.amount.toFixed(0, 0),
        minAmountLD: request.amount.mul(1 - 0.005).toFixed(0, 0),
        extraOptions: tokenParams[request.fromToken.symbol.toUpperCase()] || '0x',
        composeMsg: '0x',
        oftCmd: '0x'
    }   

    const payInLzToken: boolean = false

    const fromTokenSymbol = chainConfig[Number(request.fromChainId)].nativeCurrency.symbol.toUpperCase()
    const isNative = fromTokenSymbol === request.fromToken.symbol.toUpperCase()
    const chain = chainConfig[Number(request.fromChainId)];

    const provider = new JsonRpcProvider(chain.rpcUrls[0]);

    const contractAddress = contractAddresses[Number(request.fromChainId)][request.fromToken.symbol.toUpperCase()]

    if (!contractAddress) {
        return null
    }

    console.log('contractAddress:', contractAddress)
  
    try {
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

        const sendParams = [
            params.dstEid,
            params.to,
            params.amountLD,
            params.minAmountLD,
            params.extraOptions,
            params.composeMsg,
            params.oftCmd
        ]

        console.log('sendParams:', sendParams)

        const result = await contract.quoteSend(
            sendParams,
            payInLzToken
        );

        console.log('result:', result)

        console.log('Big(result.nativeFee.toString()).div(10 ** 18).toString():', Big(result.nativeFee.toString()).div(10 ** 18).toString())

        // setFee({
        //     nativeFee: Big(result.nativeFee.toString()).div(10 ** 18).toString(),
        //     lzTokenFee: Big(result.lzTokenFee.toString()).div(10 ** 18).toString()
        // });

        // setReceiveAmount(Big(params.amountLD).div(10 ** token.decimals).toString());

        const uuid = setQuote({
            route: sendParams,
            amount: request.amount,
            isNative,
            bridgeType: 'Stargate',
            quoteRequest: request,
            contractAddress,
            fee: result
        })
      

        return {
            uuid,
            icon,
            bridgeName: 'Stargate',
            bridgeType: 'Stargate',
            fee: Big(result.nativeFee.toString()).div(10 ** 18).toString(),
            receiveAmount: request.amount.div(10 ** request.fromToken.decimals).mul(10 ** request.toToken.decimals).toString(),
            gas: '0',
            duration: '3',
            feeType: FeeType.origin,
            gasType: FeeType.origin,
            identification: request.identification,
        }

    } catch (err) {
        console.error('Failed to get quote:', err);
        // setFee(null);
    } 

   

    return null
}


export async function execute(request: ExecuteRequest, signer: Signer): Promise<string | null> {
    const quoteInfo = getQuoteInfo(request.uuid)
    const { route, quoteRequest, params, transaction, isNative, contractAddress, fee } = quoteInfo

    if (!isNative) {
        const isApprove = await approve(quoteRequest.fromToken.address, quoteInfo.amount, contractAddress, signer)
        if (!isApprove) {
            return null
        }
    }

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

    const value = isNative ? quoteRequest.amount.plus(Big(fee.nativeFee.toString())).toString() : Big(fee.nativeFee.toString()).toString()

    console.log('value', quoteRequest.amount.toString(), Big(fee.nativeFee.toString()).toString())

    const tx = await contract.send(
        route,
        fee,
        quoteRequest.fromAddress,
        { value }
    );

    return tx.hash ? tx.hash : null
}


export async function getStatus(params: StatusParams) {
    const isSuccessOnline = await checkTransitionOnlineStatus(params.hash, params.fromChainId as string, params.transitionTime)
    if (isSuccessOnline === false) {
        return {
            status: 2
        }
    }

    if (isSuccessOnline === true) {
        const response = await fetch(`https://api-mainnet.layerzero-scan.com/tx/${params.hash}`)
        const resJson = await response.json()

        const data = resJson.messages?.length > 0 ? resJson.messages[0] : null

        if (data && data.dstTxHash && data.status === 'DELIVERED') {
            return {
                status: 1
            }
        }
    }

    return {
        status: 0
    }
}

