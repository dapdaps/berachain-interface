import exp from "constants"

export const contractAddresses: any = {
    1: {
        ETH: '0x77b2043768d28E9C9aB44E1aBfC95944bcE57931',
        USDC: '0xc026395860Db2d07ee33e05fE50ed7bD583189C7'
    },
    80094: {
        WETH: '0x45f1A95A4D3f3836523F5c83673c797f4d4d263B',
        ['USDC.E']: '0xAF54BE5B6eEc24d6BFACf1cce4eaF680A8239398'
    }
}


export const chainIds: any = {
    1: 30101,
    80094: 30362
}

export const tokenPairs: any = {
    1: {
        'ETH': 'WETH',
        'USDC': 'USDC.E'
    },
    80094: {
        'WETH': 'ETH',
        'USDC.E': 'USDC'
    }
}