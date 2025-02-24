export const getReportTokenSymbol = (token: any) => {
  if (
    token?.address && token.address.toLowerCase() ===
    "0x0d9ac083dD2760943F773E70EbfFe621e950871c".toLowerCase()
  )
    return "BTCLUB";
  return token.symbol;
};
