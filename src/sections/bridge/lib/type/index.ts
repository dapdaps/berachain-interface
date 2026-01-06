export type engineType = 'axelar' | 'bunnyFi' | 'jumper' | 'lifi' | 'meson' | 'miniBridge' | 'orbiter' | 'owlto' | 'rubic' | 'swing' | 'wormhole' | 'bungee' | 'rango' | 'stargate' | 'xy' | 'official' | 'across' | 'router' | 'kodiak' | 'superSwap' | 'oneclick';
export type bridgeEngineType = 'connext' | 'across' | 'celer'

export interface QuoteRequest {
    UNIZEN_AUTH_KEY?: string;
    fromChainId: string;
    toChainId: string;
    slippage?: number;
    fromToken: {
        address: string;
        symbol: string;
        decimals: number;
    };
    toToken: {
        address: string;
        symbol: string;
        decimals: number;
    };
    fromAddress: string;
    destAddress: string;
    amount: Big;
    engine?: engineType[] | bridgeEngineType[] | null;
    identification?: string | number;
    exclude?: engineType[];

    wallet?: any;
}

export interface QuoteResponse {
    uuid: string;
    icon: string;
    bridgeName: string;
    bridgeType: string;
    receiveAmount: string;
    gas?: string;
    fee?: string;
    duration: string | number;
    timeUnit?: string;
    feeType: FeeType;
    gasType: FeeType;
    identification?: string | number;
    toexchangeRate?: string;
}

export interface ExecuteRequest {
    uuid: string;
}

export interface StatusParams {
    hash: string;
    chainId?: string;
    fromChainId?: string;
    toChainId?: string;
    address?: string;
    fromToken?: string;
    tool?: string;
    transitionTime: number;
}

export interface StatusRes {
    isSuccess?: boolean,
    status: string | number;
    execute?: any;
}

export enum FeeType {
    origin = 1,
    usd,
    bnb,
    avax,
    target,
    custom = -1,
}

export interface Token {
    address: string;
    symbol: string;
    decimals: number;
}