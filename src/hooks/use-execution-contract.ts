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
        console.log("%s estimateGas failed: %o", method, error)
      }
      try {
        gas = gas ? Big(gas.toString()).times(2).toFixed(0) : 4000000;
        console.log('%s estimateGas gas limit is: %o', method, gas);
        const unsignedTx = await contract.populateTransaction[method](...params, {
          ...options,
          gasLimit: gas
        })
        const tx = await provider.getSigner().sendTransaction(unsignedTx)
        return tx.wait()
      } catch (error) {
        console.log("%s populateTransaction failed: %o, params: %o, options: %o", method, error, params, { ...options, gasLimit: gas });
        return Promise.reject(error);
      }
    }
  }
}