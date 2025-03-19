import { createConfig, ChainId, getQuote as getQuoteLifi, getRoutes, executeRoute, EVM } from '@lifi/sdk'
import type { RoutesRequest, Route, ExchangeRateUpdateParams } from '@lifi/sdk'
import { ethers, Contract, Signer, providers, utils } from 'ethers'
import chainConfig from '../../util/chainConfig';
import Big from 'big.js'
import { getQuoteInfo, setQuote } from '../../util/routerController'
import { getIcon } from '../../util/index'
import { QuoteRequest, QuoteResponse, ExecuteRequest, StatusParams } from '../../type/index'
import { FeeType } from '../../type/index'
import { Chain, createWalletClient, custom } from 'viem';
import { http } from 'viem';
import { mainnet, berachain, polygon, arbitrum, optimism, scroll, polygonZkEvm ,metis, bsc, manta, mode, base, mantle, avalanche, fantom, gnosis, linea, zksync } from 'viem/chains';

const chains = [arbitrum, mainnet, optimism, polygon, scroll, metis,berachain, polygonZkEvm, manta, mode, bsc, base, mantle, avalanche, fantom, gnosis, linea, zksync]
export async function init(signer: Signer) {
    const chainId = await signer.getChainId()
    const client = createWalletClient({
        account: await signer.getAddress() as any,
        chain: chains.find((chain) => chain.id == chainId) as Chain,
        transport: custom((signer as any)?.provider?.provider),
    })

    createConfig({
        integrator: 'DapDap',
        providers: [
            EVM({
                getWalletClient: async () => client,
            })
        ],
    })
}
export async function getQuote(
    quoteRequest: QuoteRequest, signer: Signer
): Promise<QuoteResponse[] | null> {
    const numFromChainId = Number(quoteRequest.fromChainId)
    const numToChainId = Number(quoteRequest.toChainId)

    if (!chainConfig[numFromChainId] || !chainConfig[numToChainId]) {
        return null
    }

    console.log('quoteRequest: ', quoteRequest)

    // let allChainSup = 0
    // for (let i = 0; i < chains.length; i++) {
    //     if (chains[i].id === numFromChainId) {
    //         allChainSup += 1
    //     }

    //     if (chains[i].id === numToChainId) {
    //         allChainSup += 1
    //     }
    //     if (allChainSup === 2) {
    //         break
    //     }
    // }

    // if (allChainSup < 2) {
    //     return null
    // }

    const routesRequest: RoutesRequest = {
        fromChainId: numFromChainId,
        fromAmount: quoteRequest.amount.toString(),
        fromTokenAddress: quoteRequest.fromToken.address,
        fromAddress: quoteRequest.fromAddress,
        toChainId: numToChainId,
        toTokenAddress: quoteRequest.toToken.address,
        toAddress: quoteRequest.destAddress,
        options: {
            allowSwitchChain: false,
            allowDestinationCall: true,
            integrator: 'DapDap',
            order: 'CHEAPEST',
        }
    }

    const result = await getRoutes(routesRequest)

    const routes = result.routes
    if (routes && routes.length) {
        let max: any = null

        const route = routes[0]

        const uuid = setQuote({
            route: route,
            amount: quoteRequest.amount,
            isNative: false,
            bridgeType: 'Jumper',
        })

        max = {
            uuid,
            icon: '/images/dapps/jumper.png',
            bridgeName: route.steps[0].toolDetails.name,
            bridgeType: 'Jumper',
            fee: computeFee(route),
            receiveAmount: new Big(route.toAmount).toString(),
            gas: route.gasCostUSD,
            duration: computeDuration(route),
            feeType: FeeType.usd,
            gasType: FeeType.usd,
            identification: quoteRequest.identification,
        }

        return max
    }

    return null
}

export async function execute(request: ExecuteRequest, signer: Signer): Promise<string | null> {
    await init(signer)
    const route = getQuoteInfo(request.uuid).route

    let isResolved = false
    return await new Promise(async (resolve, reject) => {
        const nextRoute = await executeRoute(route, {
            acceptExchangeRateUpdateHook: (params: ExchangeRateUpdateParams) => {
                return Promise.resolve(true)
            },
            updateRouteHook: (updatedRoute: any) => {
                if (isResolved) {
                    return
                }
                const execution = updatedRoute.steps[0].execution

                if (!execution) {
                    return
                }

                const { process, status } = execution

                if (!process) {
                    return
                }

                if (status === 'FAILED') {
                    reject('lifi excute failed')
                    isResolved = true
                    return
                }

                const fromChainProcess = process.filter((item: any) => item.type === 'CROSS_CHAIN' || item.type === 'SWAP')[0]

                if (!fromChainProcess) {
                    return
                }

                let txHash = fromChainProcess.txHash

                if (!txHash) {
                    return
                }

                if (fromChainProcess.status === 'DONE') {
                    resolve(txHash)
                    isResolved = true
                }

                if (fromChainProcess.status === 'FAILED') {
                    reject('lifi excute failed')
                    isResolved = true
                }

            }
        }).catch((e: any) => {
            reject(e)
            console.log(e)
        })


        // if (nextRoute) {
        //     resolve(hash)
        //     isResolved = true
        // }
    })



    return null
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


export function computeDuration(route: Route): number {
    let duration: number = 0
    route.steps.forEach(step => {
        duration += step.estimate.executionDuration
    })

    return Math.ceil(duration / 60)
}

export function computeFee(route: Route): string {
    let fee: number = 0
    route.steps.forEach(step => {
        step.estimate.feeCosts?.forEach(stepFee => {
            fee += Number(stepFee.amountUSD)
        })
    })

    return fee.toString()
}

