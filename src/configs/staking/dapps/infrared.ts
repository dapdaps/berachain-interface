export default {
  name: "Infrared",
  icon: "/images/dapps/infrared.svg",
  path: "/staking/infrared",
  ICON_VAULT_MAP: {
    "HONEY-WBERA":
      "https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-wbera.png&w=64&q=75",
    BHONEY:
      "https://www.infrared.finance/_next/static/media/bhoney.7829fa2c.svg",
    "HONEY-USDC":
      "https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-usdc.png&w=64&q=75",
    "HONEY-WETH":
      "https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-weth.png&w=64&q=75",
    "HONEY-WBTC":
      "https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-wbtc.png&w=64&q=75"
  },
  chains: {
    80094: {
      description:
        "Deposit or mint BGT-whitelisted LP tokens to earn iBGT (liquid BGT) & Boosted Yield.",
      ALL_DATA_URL:
        "/api.infrared.finance/api/vaults?chainId=80094&offset=0&limit=100",
      IBGT_ADDRESS: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
      IBGT_VAULT_ADDRESS: "0x4EF0c533D065118907f68e6017467Eb05DBb2c8C"
    }
  }
};
