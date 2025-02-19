import { bera } from "@/configs/tokens/bera";

export default {
  name: "AquaBera",
  icon: "/images/dapps/infrared/aquabera.svg",
  type: "Vaults",
  chains: {
    80094: {
      ETHVaultWithSlippage: "0x3021359e1d45A43378c94112B3418bF3ab1E5982",
      ICHIVaultDepositGuard: "0xc0c6D4178410849eC9765B4267A73F4F64241832",
      pairs: [

        {
          id: "HONEY-WBERA",
          ichiAddress: "0xe2832ac11f8Af62FB3370d51d8dDE702bA7B734B",
          tokens: [bera["honey"], bera["wbera"]],
        },
        {
          id: "WBERA-HONEY",
          ichiAddress: "0x3efF586Be3a907D8dEC40178eb35215215F58Af7",
          tokens: [bera["wbera"], bera["honey"]],
        },
        {
          id: "WBERA-GODL",
          ichiAddress: "0x8690964B1E222ff35e8900f8c9bCaee3Ea3eEceF",
          tokens: [bera["wbera"], bera["godl"]],
        },
        {
          id: "NECT-HONEY",
          ichiAddress: "0x96d70aC7E342747D988F2896adFFC62CE2Cc4aF2",
          tokens: [bera["nect"], bera["honey"]],
        },
        {
          id: "HONEY-NECT",
          ichiAddress: "0x4eCC0E962daD165E910209E9E6f09577E3f75EbA",
          tokens: [bera["honey"], bera["nect"]],
        },
        {
          id: "beraETH-WETH",
          ichiAddress: "0xC83952Ac09Ae1810927cEB08d8DCE849Ed409Cb7",
          tokens: [bera["beraeth"], bera["weth"]],
        },
        {
          id: "WETH-beraETH",
          ichiAddress: "0x42F617262Ac5Bb4B465038BEbbDc6d8A5f7B4c0b",
          tokens: [bera["weth"], bera["beraeth"]],
        },
      ]
    }
  }
};
