
import { ethers, Contract, Signer, providers, utils } from 'ethers'
import chainConfig from '../../util/chainConfig';
import Big from 'big.js'
import { getQuoteInfo, setQuote } from '../../util/routerController'
import { getIcon } from '../../util/index'
import { QuoteRequest, QuoteResponse, ExecuteRequest, StatusParams, Token } from '../../type/index'
import { FeeType } from '../../type/index'
import { Chain, createWalletClient, custom } from 'viem';
import { http } from 'viem';
import { mainnet, berachain, polygon, arbitrum, optimism, scroll, polygonZkEvm ,metis, bsc, manta, mode, base, mantle, avalanche, fantom, gnosis, linea, zksync } from 'viem/chains';
import { approve } from '../../util/approve';

const chains = [arbitrum, mainnet, optimism, polygon, scroll, metis,berachain, polygonZkEvm, manta, mode, bsc, base, mantle, avalanche, fantom, gnosis, linea, zksync]

export async function getQuote(
    quoteRequest: QuoteRequest, signer: Signer
): Promise<QuoteResponse[] | null> {
    const numFromChainId = Number(quoteRequest.fromChainId)
    const numToChainId = Number(quoteRequest.toChainId)

    if (!chainConfig[numFromChainId] || !chainConfig[numToChainId]) {
        return null
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

    console.log(result, 'result')

    const routes: any = []
    createRoute(result, routes, quoteRequest)
    if (result.otherQuote) {
        createRoute(result.otherQuote, routes, quoteRequest)
    }

    if (routes.length > 0) {
        return routes
    }

    return null
}

export async function execute(request: ExecuteRequest, signer: Signer): Promise<string | null> {

    console.log(request, 'request')

    const { route, isNative, amount, fromToken } = getQuoteInfo(request.uuid)

    if (!isNative) {
        const isApprove = await approve(fromToken.address, amount, route.to, signer)
        if (!isApprove) {
            return null
        }
    }

    const account = await signer.getAddress()

    const transactionResponse = await signer.sendTransaction({
        from: account,
        to: route.to,
        data: route.calldata,
        value: route.value,
      });

      await transactionResponse.wait

      return transactionResponse.hash ? transactionResponse.hash : null
}

export async function getStatus(params: StatusParams) {
    const res: any = await fetch(`https://li.quest/v1/status?txHash=${params.hash}`).then(res => res.json())

    if (res.status === 'DONE') {
        return {
            status: 1
        }
    }
    
    return {
        status: 0
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

function createRoute(result: any, routes: any, quoteRequest: QuoteRequest) {
    if (result && result.methodParameters) {
        const uuid = setQuote({
            route: {
                ...result.methodParameters
            },
            fromToken: quoteRequest.fromToken,
            toToken: quoteRequest.toToken,
            amount: quoteRequest.amount,
            isNative: quoteRequest.fromToken.symbol.toLowerCase() === 'eth' || quoteRequest.fromToken.symbol.toLowerCase() === 'bera',
            bridgeType: 'Kodiak',
        })

        const route: any = {
            uuid,
            icon: 'https://s3.amazonaws.com/dapdap.prod/images/li.fi.png',
            bridgeName: result.provider,
            bridgeType: 'Kodiak',
            fee: computeFee(result, quoteRequest.fromToken),
            receiveAmount: result.quote,
            gas: result.gasUseEstimateUSD,
            duration: 1,
            feeType: FeeType.usd,
            gasType: FeeType.origin,
            identification: quoteRequest.identification,
        }

        routes.push(route)
    }
}



