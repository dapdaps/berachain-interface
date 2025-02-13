import { ethers, Contract, Signer } from 'ethers'
import Big from 'big.js'
import { sleep } from '.'
import { erc20Abi } from 'viem'

export async function approve(tokenAddress: string, amount: Big, spender: string, signer: Signer) {
    const account = await signer.getAddress()
    const tokenContract = new Contract(
        tokenAddress,
        erc20Abi,
        signer,
    )


    const allowAmount: Big = await tokenContract.allowance(account, spender)

    const amountStr = amount.toString()
    let fixedAmountStr = amountStr
    if (amountStr.indexOf('.') > -1) {
        fixedAmountStr = amountStr.split('.')[0]
    }

    if (allowAmount.lt(fixedAmountStr)) {
        let tx: any
        try {
            tx = await tokenContract.approve(spender, fixedAmountStr)
            await tx.wait()
            return tx
        } catch (err: any) {
            if (err?.message?.includes('transaction indexing is in progress') && tx) {
                for (let i = 0; i < 10; i++) {
                    const allowAmount: Big = await tokenContract.allowance(account, spender)
                    if (!allowAmount.lt(fixedAmountStr)) {
                        // const connectedWallets = window.localStorage.getItem('web3-onboard:connectedWallets')
                        // if (connectedWallets && connectedWallets.indexOf('Rabby Wallet') > -1) {
                        //     await sleep(2000)
                        // }
                        return tx
                    }
                    await sleep(1000)
                }
            } else {
                throw err
            }
        }
    }

    return true
}

 export async function checkAllowance(tokenAddress: string, amount: Big, spender: string, signer: Signer) {
    const account = await signer.getAddress()
    const tokenContract = new Contract(
        tokenAddress,
        erc20Abi,
        signer,
    )

    const amountStr = amount.toString()
    let fixedAmountStr = amountStr
    if (amountStr.indexOf('.') > -1) {
        fixedAmountStr = amountStr.split('.')[0]
    }

    for (let i = 0; i < 10; i++) {
        const allowAmount: Big = await tokenContract.allowance(account, spender)
        if (!allowAmount.lt(fixedAmountStr)) {
            return true
        }
        await sleep(1000)
    }

    return false
}