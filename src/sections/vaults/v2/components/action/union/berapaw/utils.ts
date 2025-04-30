import Big from 'big.js';

export const getEstimateGas = async (contract: any, method: string, params: any, opts?: { defaultValue?: number; addOptions?: Record<any, any>; times?: number; }) => {
  const { defaultValue = 4000000, addOptions = {}, times = 1 } = opts || {};
  try {
    const res = await contract.estimateGas[method](...params);
    return {
      gasLimit: Big(res.toString()).times(times).toFixed(0),
      ...addOptions,
    };
  } catch (err: any) {
    console.log("%s get estimate gas failed: %o", method, err);
    return {
      gasLimit: defaultValue,
      ...addOptions,
    };
  }
};
