export function tokenSortBalance(a: any, b: any, balanceA: any, balanceB: any) {
    const aNumber = Number(balanceA || 0);
    const bNumber = Number(balanceB || 0);

    if (bNumber === 0 && aNumber === 0) {
        const indexOfA = tokenSortList.indexOf(a.symbol.toUpperCase());
        const indexOfB = tokenSortList.indexOf(b.symbol.toUpperCase());
        if (indexOfA === -1 && indexOfB === -1) {
            return 0;
        }

        if (indexOfA === -1 && indexOfB > -1) {
            return 1;
        }

        if (indexOfA > -1 && indexOfB === -1) {
            return -1;
        }

        if (indexOfA > -1 && indexOfB > -1) {
            return indexOfA - indexOfB;
        }
    }

    return bNumber - aNumber;
}

const tokenSortList = [
    'ETH',
    'WETH',
    'USDT',
    'USDC',
    'USDC.E',
    'DAI',
    'OP',
    'ARB',
    'AVAX',
    'BLAST',
    'MANTA',
    'MNT',
    'MODE',
    'METIS',
    'POL',
    'MATIC',
    'BNB',
    'XDAI'
];