
import { ethers, Contract, Signer, providers, utils } from 'ethers'
import chainConfig from '../../util/chainConfig';
import Big from 'big.js'
import { getQuoteInfo, setQuote } from '../../util/routerController'
import { getIcon } from '../../util/index'
import { QuoteRequest, QuoteResponse, ExecuteRequest, StatusParams, Token } from '../../type/index'
import { FeeType } from '../../type/index'
import { Chain, createWalletClient, custom } from 'viem';
import { http } from 'viem';
import { approve } from '../../util/approve';
import weth from '@/configs/contract/weth';
import getWrapOrUnwrapTx from '@/sections/swap/getWrapOrUnwrapTx';

const nativeAddress = '0x0000000000000000000000000000000000000000'
export async function getQuote(
    quoteRequest: QuoteRequest, signer: Signer
): Promise<QuoteResponse[] | null> {
    const numFromChainId = Number(quoteRequest.fromChainId)
    const numToChainId = Number(quoteRequest.toChainId)

    if (!chainConfig[numFromChainId] || !chainConfig[numToChainId]) {
        return null
    }

    if (quoteRequest.fromToken.address === 'native') {
        quoteRequest.fromToken.address = nativeAddress
    }

    if (quoteRequest.toToken.address === 'native') {
        quoteRequest.toToken.address = nativeAddress
    }

    const wethAddress = weth[quoteRequest.fromChainId as any];

    const wrapType =
        quoteRequest.fromToken.address.toLowerCase() === '0x0000000000000000000000000000000000000000' &&
            quoteRequest.toToken.address.toLowerCase() === wethAddress.toLowerCase()
            ? 1
            : quoteRequest.fromToken.address.toLowerCase() === wethAddress.toLowerCase() &&
                quoteRequest.toToken.address.toLowerCase() === '0x0000000000000000000000000000000000000000'
                ? 2
                : 0;

    const routes: any = []

    if (wrapType) {
        await createRoute(null, routes, quoteRequest, wrapType, signer)
        if (routes.length > 0) {
            return routes
        } else {
            return null
        }
    }

    const routesRequest: any = {
        protocols: 'v2,v3,mixed',
        tokenInAddress: quoteRequest.fromToken.address,
        tokenInChainId: numFromChainId,
        tokenOutAddress: quoteRequest.toToken.address,
        tokenOutChainId: numToChainId,
        amount: quoteRequest.amount.toString(),
        type: 'exactIn',
        recipient: quoteRequest.destAddress,
        slippageTolerance: 1
    }

    const queryParams = new URLSearchParams({
        protocols: routesRequest.protocols,
        tokenInAddress: routesRequest.tokenInAddress,
        tokenInChainId: routesRequest.tokenInChainId.toString(),
        tokenOutAddress: routesRequest.tokenOutAddress,
        tokenOutChainId: routesRequest.tokenOutChainId.toString(),
        amount: routesRequest.amount,
        type: routesRequest.type,
        recipient: routesRequest.recipient,
        slippageTolerance: routesRequest.slippageTolerance.toString()
    })

    const response = await fetch(`https://backend.kodiak.finance/quote?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!response.ok) {
        throw new Error(`Kodiak API request failed: ${response.status}`)
    }

    const result = await response.json()

    await createRoute(result, routes, quoteRequest, wrapType, signer)
    if (result.otherQuote) {
        await createRoute(result.otherQuote, routes, quoteRequest, wrapType, signer)
    }

    if (routes.length > 0) {
        return routes
    }

    return null
}

export async function execute(request: ExecuteRequest, signer: Signer): Promise<string | null> {

    const { route, isNative, amount, fromToken, isWrap } = getQuoteInfo(request.uuid)
    const account = await signer.getAddress()
    let transactionResponse: any


    if (!isNative) {
        const isApprove = await approve(fromToken.address, amount, route.to, signer)
        if (!isApprove) {
            return null
        }
    }

    if (isWrap) {
        transactionResponse = await signer.sendTransaction({
            ...route,
            from: account,
        });
    } else {
        transactionResponse = await signer.sendTransaction({
            from: account,
            to: route.to,
            data: route.calldata,
            value: route.value,
        });
    }

    await transactionResponse.wait()

    return transactionResponse.hash ? transactionResponse.hash : null
}

export async function getStatus(params: StatusParams) {
    return {
        status: 1
    }
}

function computeFee(result: any, fromToken: Token) {
    // if (result && result.methodParameters.decodedArgs) {
    //     const decodedArgs = result.methodParameters.decodedArgs
    //     const fee = decodedArgs[decodedArgs.length - 1]
    //     return new Big(fee.feeQuote).add(fee.refCode).div(10 ** fromToken.decimals).toString()
    // }
    return '0'
}

async function createRoute(result: any, routes: any, quoteRequest: QuoteRequest, wrapType: number, signer: Signer) {
    if (result && result.methodParameters) {
        const uuid = setQuote({
            route: {
                ...result.methodParameters
            },
            fromToken: quoteRequest.fromToken,
            toToken: quoteRequest.toToken,
            amount: quoteRequest.amount,
            isNative: quoteRequest.fromToken.symbol.toLowerCase() === 'bera',
            bridgeType: 'Kodiak',
            isWrap: false,
        })

        let icon = ''
        if (result.provider.toLowerCase() === 'kodiak') {
            icon = '/images/dapps/kodiak.svg'
        } else {
            icon = '/images/dapps/kx.png'
        }

        const route: any = {
            uuid,
            icon,
            bridgeName: result.provider,
            bridgeType: 'Kodiak',
            fee: computeFee(result, quoteRequest.fromToken),
            receiveAmount: result.quote,
            gas: result.gasUseEstimateUSD,
            duration: 1,
            feeType: FeeType.usd,
            gasType: FeeType.origin,
            identification: quoteRequest.identification,
            toexchangeRate: new Big(result.quoteDecimals).div(quoteRequest.amount.div(10 ** quoteRequest.fromToken.decimals)).toString()
        }

        routes.push(route)
    } else {
        const { txn, gasLimit } = await getWrapOrUnwrapTx({
            signer,
            wethAddress: weth[quoteRequest.fromChainId as any],
            type: wrapType,
            amount: quoteRequest.amount.toString()
          });

          const uuid = setQuote({
            route: {
                ...txn,
                gasLimit: gasLimit ? gasLimit.toString() : undefined
            },
            fromToken: quoteRequest.fromToken,
            toToken: quoteRequest.toToken,
            amount: quoteRequest.amount,
            isNative: true,
            bridgeType: 'Kodiak',
            isWrap: true,
        })

        const route: any = {
            uuid,
            icon: '/images/dapps/kodiak.svg',
            bridgeName: 'Kodiak',
            bridgeType: 'Kodiak',
            fee: '0',
            receiveAmount: quoteRequest.amount,
            gas: '0',
            duration: 1,
            feeType: FeeType.usd,
            gasType: FeeType.origin,
            identification: quoteRequest.identification,
            toexchangeRate: '1'
        }

        routes.push(route)
    }
}



