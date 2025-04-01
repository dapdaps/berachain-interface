import { bera } from "@/configs/tokens/bera";

export default {
  name: "AquaBera",
  icon: "/images/dapps/infrared/aquabera.png",
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
          chainTopTokens: [bera["wbera"], bera["honey"]]
        },
        {
          id: "WBERA-HONEY",
          ichiAddress: "0x3efF586Be3a907D8dEC40178eb35215215F58Af7",
          tokens: [bera["wbera"], bera["honey"]],
          chainTopTokens: [bera["wbera"], bera["honey"]]
        },
        {
          id: "WBERA-GODL",
          ichiAddress: "0x8690964B1E222ff35e8900f8c9bCaee3Ea3eEceF",
          tokens: [bera["wbera"], bera["godl"]],
          chainTopTokens: [bera["wbera"], bera["godl"]]
        },
        {
          id: "NECT-HONEY",
          ichiAddress: "0x96d70aC7E342747D988F2896adFFC62CE2Cc4aF2",
          tokens: [bera["nect"], bera["honey"]],
          chainTopTokens: [bera["nect"], bera["honey"]]
        },
        {
          id: "HONEY-NECT",
          ichiAddress: "0x4eCC0E962daD165E910209E9E6f09577E3f75EbA",
          tokens: [bera["honey"], bera["nect"]],
          chainTopTokens: [bera["nect"], bera["honey"]]
        },
        {
          id: "beraETH-WETH",
          ichiAddress: "0xC83952Ac09Ae1810927cEB08d8DCE849Ed409Cb7",
          tokens: [bera["beraeth"], bera["weth"]],
          chainTopTokens: [bera["weth"], bera["beraeth"]]
        },
        {
          id: "WETH-beraETH",
          ichiAddress: "0x42F617262Ac5Bb4B465038BEbbDc6d8A5f7B4c0b",
          tokens: [bera["weth"], bera["beraeth"]],
          chainTopTokens: [bera["weth"], bera["beraeth"]]
        },


        {
          id: "beraETH-STONE",
          ichiAddress: "0xe871DAb8E23b2D625A818d2299d1c374b8114435",
          tokens: [bera["beraeth"], bera["stone"]],
          chainTopTokens: [bera["beraeth"], bera["stone"]]
        },
        {
          id: "STONE-beraETH",
          ichiAddress: "0xae984315AA572b35EB22A9fb3A38f373F885918c",
          tokens: [bera["stone"], bera["beraeth"]],
          chainTopTokens: [bera["beraeth"], bera["stone"]]
        },

        {
          id: "STONE-WETH",
          ichiAddress: "0x9A340B9432d6F68C11fac381878691287bF5d650",
          tokens: [bera["stone"], bera["weth"]],
          chainTopTokens: [bera["weth"], bera["stone"]]
        },
        {
          id: "WETH-STONE",
          ichiAddress: "0xa4eF88d79072CBb070Be4Ad9D90A5dEd4D8FA8e0",
          tokens: [bera["weth"], bera["stone"]],
          chainTopTokens: [bera["weth"], bera["stone"]]
        },
        {
          id: "GODL-WBERA",
          ichiAddress: "0x9Ee4f9259024d29AA004165334306915E350509D",
          tokens: [bera["godl"], bera["wbera"]],
          chainTopTokens: [bera["wbera"], bera["godl"]]
        },

        {
          id: "RUSD-RUSD OT",
          ichiAddress: "0x20a49a266AE70d07Ba066Ef1F8b6e670216Ab2a6",
          tokens: [bera["rusd"], bera["rusd ot"]],
          chainTopTokens: [bera["rusd ot"], bera["rusd"]]
        },
      ]
    }
  }
};
