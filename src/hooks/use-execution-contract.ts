import Big from "big.js"
import { useProvider } from "./use-provider"
export default function () {


  const { provider } = useProvider()
  return {
    executionContract: async ({
      contract,
      method,
      params,
      options = {}
    }: any) => {
      let gas = null
      try {
        gas = await contract.estimateGas[method](...params)
      } catch (error) {
        console.error(error)
      }
      try {
        gas = gas ? Big(gas.toString()).div(1.02).toFixed(0) : 4000000;
        const unsignedTx = await contract.populateTransaction[method](...params, {
          ...options,
          gasLimit: gas
        })
        const tx = await provider.getSigner().sendTransaction(unsignedTx)
        return tx.wait()
      } catch (error) {
        console.error(error)
      }
    }
  }
}