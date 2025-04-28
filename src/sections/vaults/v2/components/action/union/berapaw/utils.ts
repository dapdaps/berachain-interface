export const getEstimateGas = async (contract: any, method: string, params: any, opts?: { defaultValue?: number; addOptions?: Record<any, any> }) => {
  const { defaultValue = 4000000, addOptions = {} } = opts || {};
  try {
    const res = await contract.estimateGas[method](...params);
    return {
      gasLimit: res,
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
