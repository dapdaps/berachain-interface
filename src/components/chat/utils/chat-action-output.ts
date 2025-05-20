export const handleFunctionOutput = (functionType: string, content: string): void => {
  const parsedContent = typeof content === "string" ? JSON.parse(content) : content;

  console.log("Function output:", parsedContent);

  switch (functionType) {
    case "swap":
      break;
    case "getHotTokens":
      break;
    case "getInterestVaults":
      break;
    case "getVaultsPositions":
      break;
    case "getWalletAssets":
      break;
  }
};