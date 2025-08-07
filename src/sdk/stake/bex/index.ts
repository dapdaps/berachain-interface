import { ethers, utils } from "ethers";

const VAULT_ADDRESS = "0x118D2cEeE9785eaf70C15Cd74CD84c9f8c3EeC9a";
const VAULT_ABI = require("./abi.json");

export async function stake(params: any) {
    const { signer, inputCurrencyAmount, inputCurrency } = params;
    const depositValue = utils.parseUnits(inputCurrencyAmount);
    const isNative = inputCurrency.isNative;
    const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
    const tx = await vaultContract.populateTransaction[isNative ? "depositNative" : "deposit"](depositValue, await signer.getAddress());
    if (isNative) {
        return {
            ...tx,
            value: depositValue.toString()
        }
    }
    return tx;
}

export async function unStake(params: any) {
    const { signer, inputCurrencyAmount, inputCurrency } = params;
    const depositValue = utils.parseUnits(inputCurrencyAmount);
    const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
    const address = await signer.getAddress();
    const tx = await vaultContract.populateTransaction.redeem(depositValue, address, address);
    return tx;
}

export async function withdraw(params: any) {
    const { signer, inputCurrencyAmount, inputCurrency } = params;
    const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
    const tx = await vaultContract.withdraw(true);
    return tx;
}

export async function quote(params: any) {
    const { signer, inputCurrencyAmount, inputCurrency, outputCurrency, needTxn = true } = params;
    const depositValue = utils.parseUnits(inputCurrencyAmount);
    const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
    if (inputCurrency.address.toLowerCase() === VAULT_ADDRESS.toLowerCase()) {
        const currentShareValue = await vaultContract.previewRedeem(depositValue);

        if (currentShareValue) {
            if (needTxn) {
                const tx = await unStake(params);
                return {
                    outputCurrencyAmount: utils.formatEther(currentShareValue._hex),
                    routerAddress: VAULT_ADDRESS,
                    txn: {
                        ...tx
                    }
                }
            }
    
            return {
                outputCurrencyAmount: utils.formatEther(currentShareValue._hex),
                routerAddress: VAULT_ADDRESS,
            }
        }
    } else {
        const currentShareValue = await vaultContract.previewDeposit(depositValue);
        if (currentShareValue) {
            if (needTxn) {
                const tx = await stake(params);
                return {
                    outputCurrencyAmount: utils.formatEther(currentShareValue._hex),
                    routerAddress: VAULT_ADDRESS,
                    txn: {
                        ...tx
                    }
                }
            }
    
            return {
                outputCurrencyAmount: utils.formatEther(currentShareValue._hex),
                routerAddress: VAULT_ADDRESS,
            }
        }
    }
    

    return null
}

export async function getApr(params: any) {
    try {
        const { provider } = params;
        const currentBlock = await provider.getBlockNumber();

        // Calculate blocks for 24-26 hours (assuming 2-second block time)
        const blocksPerHour = 3600 / 2; // 1800 blocks per hour
        const blocksPerDay = blocksPerHour * 24; // 43200 blocks per day
        const blocksPer26Hours = blocksPerHour * 26; // 46800 blocks for 26 hours

        const previousBlock24h = currentBlock - blocksPerDay;
        const previousBlock26h = currentBlock - blocksPer26Hours;

        const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);

        // Get share values
        const currentShareValue = await vaultContract.previewRedeem(utils.parseUnits("1"));
        const previousShareValue24h = await vaultContract.previewRedeem(
            utils.parseUnits("1"),
            {
                blockTag: previousBlock24h
            }
        );
        const previousShareValue26h = await vaultContract.previewRedeem(
            utils.parseEther("1"),
            {
                blockTag: previousBlock26h
            }
        );

        // Calculate returns
        const return24h = currentShareValue - previousShareValue24h;
        const return26h = currentShareValue - previousShareValue26h;

        // Calculate APRs
        const apr24h = (return24h * 365 * 10000) / Number(previousShareValue24h);
        const apr26h = (return26h * 365 * 10000) / Number(previousShareValue26h);

        // Calculate average APR
        const avgAPR = (Number(apr24h) + Number(apr26h)) / 2;

        // return {
        //     currentShareValue: utils.formatEther(currentShareValue),
        //     previousShareValue24h: utils.formatEther(previousShareValue24h),
        //     previousShareValue26h: utils.formatEther(previousShareValue26h),
        //     return24h: utils.formatEther(return24h),
        //     return26h: utils.formatEther(return26h),
        //     apr24h: Number(apr24h) / 100,
        //     apr26h: Number(apr26h) / 100,
        //     avgAPR: avgAPR / 100
        // };

        return avgAPR / 100
    } catch (error) {
        console.error("Error calculating APR:", error);
        throw error;
    }
}

export async function getWithdrawalRequests(params: any) {
    const { address, provider } = params;
    const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);
    const withdrawal = await vaultContract.withdrawalRequests(address);
    const WITHDRAWAL_COOLDOWN = await vaultContract.WITHDRAWAL_COOLDOWN();

    if (Number(withdrawal.assets._hex) > 0) {
        return [{
            amount: utils.formatEther(withdrawal.assets._hex),
            timeLeft: Number(WITHDRAWAL_COOLDOWN._hex) - (Date.now() / 1000 -  Number(withdrawal.requestTime._hex)),
            owner: withdrawal.owner
        }]
    }
    
    return [];
}