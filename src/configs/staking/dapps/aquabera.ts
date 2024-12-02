import { beraB } from '@/configs/tokens/bera-bArtio';

export default {
  name: 'AquaBera',
  icon: '/images/dapps/infrared/aquabera.svg',
  type: 'Vaults',
  chains: {
    80084: {
      ETHVaultWithSlippage: "0x3021359e1d45A43378c94112B3418bF3ab1E5982",
      ICHIVaultDepositGuard: "0x0Dad5a47adbec92E7472F6F34AC066798dEdEE40",
      pairs: [{
        ...beraB["ibgt"],
        pairedTokens: [{
          ...beraB["honey"],
          ichiAddress: "0x2f9961654FBcDE62B8dF385821eE5269cF5D5deE"
        }, {
          ...beraB["wbera"],
          ichiAddress: "0xEF47982c43e8979d1d0Bddf855d60bb84eCf2E65"
        }]
      },
      {
        ...beraB["honey"],
        pairedTokens: [{
          ...beraB["arbera"],
          ichiAddress: "0x374C7385f2189Ee1BB909Ac681314Cdb0856AbCa"
        }, {
          ...beraB["usdc"],
          ichiAddress: "0x76a68ae8744db84b69aCDB02D1CAf3502401c42e"
        }, {
          ...beraB["wbera"],
          ichiAddress: "0xE6C02585Ab235E0B501191201474f4637c91e4DE"
        }]
      },
      {
        ...beraB["wbera"],
        pairedTokens: [{
          ...beraB["gold"],
          ichiAddress: "0x4F2470226aB4eC9aa69f01E6fCA01aB68d2948de"
        }, {
          ...beraB["honey"],
          ichiAddress: "0x1d451e2F5C106A26C0aAe50c7aF1920F21A15330"
        }, {
          ...beraB["kdk"],
          ichiAddress: "0x6d501e865D112A051B42f8845E8b09Aa41765424"
        }, {
          ...beraB["ooga_booga"],
          ichiAddress: "0x8b9ea50619e46E9C72289393AFc11f5256b78E63"
        }, {
          ...beraB["yeet"],
          ichiAddress: "0x2d7622941ee8EBFc4C01fDFd8ab2d006D3D247BB"
        }]
      },
      {
        ...beraB["arbera"],
        pairedTokens: [{
          ...beraB["honey"],
          ichiAddress: "0xEc255B5C8df5069128236767d5Ed54D2bBa74E80"
        }]
      },
      {
        ...beraB["usdc"],
        symbol: "USDC",
        pairedTokens: [{
          ...beraB["honey"],
          ichiAddress: "0xF4585B319e0Ffe82935D8A983A2064b87419b6c6"
        }]
      },
      {
        ...beraB["yeet"],
        pairedTokens: [{
          ...beraB["sip"],
          ichiAddress: "0xaF7A6b24188D709639723162577ab82cc258CeE2"
        }]
      },
      {
        ...beraB["nect"],
        symbol: "NECT",

        pairedTokens: [{
          ...beraB["pollen"],
          ichiAddress: "0xE267Ee642c643BE36CB5C5eC77Cae846F792B7eF"
        }]
      },
      {
        ...beraB["ivxusdc"],
        pairedTokens: [{
          ...beraB["honey"],
          ichiAddress: "0x46944330A8AcDc0235eFF3F8Ef2f38797aF05db8"
        }]
      }]
    }
  }
};
