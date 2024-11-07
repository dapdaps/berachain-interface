import { asyncFetch } from '@/utils/http';
import { useState } from 'react';

export default function () {
  const [loading, setLoading] = useState(false)
  const [vaults, setVaults] = useState<null | any[]>(null)
  const getValuts = async (address) => {
    setLoading(true)
    try {
      // const response = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/vaults?validatorId=" + address)
      const response = {
        "vaults": [
          {
            "id": "0x1992b26E2617928966B4F8e8eeCF41C6e7A77010",
            "vaultAddress": "0x1992b26E2617928966B4F8e8eeCF41C6e7A77010",
            "stakingTokenAddress": "0xa51afAF359d044F8e56fE74B9575f23142cD4B76",
            "amountStaked": "0",
            "activeIncentives": [
              {
                "id": "0x1992b26e2617928966b4f8e8eecf41c6e7a77010-0xb43fd1dc4f02d81f962e98203b2cc4fd9e342964",
                "token": {
                  "address": "0xB43fd1dC4f02d81f962E98203b2cc4FD9E342964",
                  "decimals": 18,
                  "symbol": "PAW",
                  "name": "Paw Token"
                },
                "amountLeft": 29928.804984210874,
                "incentiveRate": 0.3
              }
            ],
            "vaultWhitelist": {
              "whitelistedTokens": [
                {
                  "isWhiteListed": true,
                  "token": {
                    "address": "0x32Cf940DB5d7ea3e95e799A805B1471341241264",
                    "decimals": 18,
                    "symbol": "LBGT",
                    "name": "Liquid BGT"
                  }
                },
                {
                  "isWhiteListed": true,
                  "token": {
                    "address": "0xB43fd1dC4f02d81f962E98203b2cc4FD9E342964",
                    "decimals": 18,
                    "symbol": "PAW",
                    "name": "Paw Token"
                  }
                }
              ]
            },
            "metadata": {
              "vaultAddress": "0x1992b26E2617928966B4F8e8eeCF41C6e7A77010",
              "receiptTokenAddress": "0xa51afAF359d044F8e56fE74B9575f23142cD4B76",
              "name": "PAW-HONEY",
              "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/pawhoney.png",
              "product": "BEX",
              "url": "https://bartio.bex.berachain.com/pool/0xa51afaf359d044f8e56fe74b9575f23142cd4b76",
              "productMetadata": {
                "name": "BEX",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/bex.png",
                "url": "https://bartio.bex.berachain.com",
                "description": "Swap a variety of tokens effortlessly on our decentralized platform. Provide liquidity to pools and earn BGT rewards."
              }
            },
            "activeIncentivesInHoney": 1113427.2243567726,
            "activeValidators": [
              {
                "id": "0x450f6A64c1DB2e8EF127a6F1b5a5EE2c0414D793",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/A41.png",
                "name": "A41",
                "Description": "A41 is a blockchain infrastructure company. We provide staking service on multichain. Stake your token with us now and earn rewards!",
                "website": "https://a41.io",
                "twitter": "https://x.com/a41_allforone"
              },
              {
                "id": "0x72C656611EEB26Ec863A7878092c47Ad96BEC878",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xDDfDa961410B2815B48679377bAA0009AcE173A2",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/L0vd.svg",
                "name": "L0vd",
                "Description": "Professional validator, staking and infrastructure provider. More than 50 networks contributed. With L0ve.",
                "website": "https://chain-services.l0vd.com",
                "twitter": "https://x.com/L0vdstaking"
              },
              {
                "id": "0xDcCE0cB56b5a94bD6A5A889b324342981C3c16d4",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/pops.png",
                "name": "P-OPS Team",
                "Description": "P-OPS TEAM is a decentralized organization providing you with validation and staking services, blockchain consultation, growth acceleration and investment capital for innovative Web 3.0 projects.",
                "website": "https://pops.one",
                "twitter": "https://twitter.com/POpsTeam1"
              },
              {
                "id": "0xbf5c95B4C2BDc9A75EeA876a956A97Bf13c21106",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/lavenderfive.png",
                "name": "Lavender.Five Nodes 🐝",
                "Description": "Fortifying crypto networks with Horcrux security, slash insurance, and open source contributions. Connect with us at https://linktr.ee/lavenderfive.",
                "website": "https://www.lavenderfive.com/",
                "twitter": "https://twitter.com/lavender_five"
              },
              {
                "id": "0x7e8d2356240A1F0e249e628b6964C6227a11d945",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/ebunker.png",
                "name": "Ebunker",
                "Description": "Ebunker is a leading node operator and blockchain infrastructure company.",
                "website": "https://www.ebunker.io/",
                "twitter": "https://twitter.com/ebunker_eth"
              },
              {
                "id": "0xeA64C51a82a2ECAC2544740B2d1798AD77d4D133",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/cryptomind.jpg",
                "name": "Cryptomind",
                "Description": "Cryptomind Group, Thailand’s premier ecosystem builder, comprises a diverse portfolio of ventures: Cryptomind Media, operating “Bitcoin Addict” and organizing Thailand Blockchain Week; Cryptomind Advisory, offering SEC-licensed crypto research; Merkle Capital, providing digital asset fund services for both individuals and institutions; and Cryptomind Lab, incubating global-scale projects like Zentry and providing Web3 strategy consulting.",
                "website": "https://cryptomind.group",
                "twitter": "https://x.com/cryptomindgroup"
              },
              {
                "id": "0x19Bfe7b58D3D2C63Ee082A1C1db33F970Ca1fA44",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/kingnodes.jpg",
                "name": "kingnodes 👑",
                "Description": "ooga booga Professional PoS validator securing only the best interchain networks. Join our community of delegators Telegram: https://t.me/kingnodes Twitter: https://twitter.com/kingnodes",
                "website": "https://www.kingnodes.com",
                "twitter": "https://x.com/kingnodes"
              },
              {
                "id": "0x2aBCffD5bd93947FD7ddb7A3ecd4e914442B1AA6",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/shinlabs.png",
                "name": "Shinlabs",
                "Description": "Thesis-driven, crypto-native venture studio",
                "website": "https://www.shinlabs.xyz",
                "twitter": ""
              },
              {
                "id": "0xd1e53f65434838c6DCeC6c9112a30BA57E753E77",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/republic-crypto.png",
                "name": "Republic Crypto",
                "Description": "Republic Crypto provides infrastructure for institutional staking on networks like Avalanche, Aptos and Sui with tailored services to meet your needs",
                "website": "https://republic.com",
                "twitter": "https://www.twitter.com/RepublicCrypto"
              },
              {
                "id": "0x4790ECe0447C45D4037bea8eb166cB5eee396d58",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/despread.png",
                "name": "DeSpread",
                "Description": "We provide refined perspective for Web3 pioneers. Founded in 2019, DeSpread is a consulting firm specializing in Web3 & blockchain. It actively contributes to Web3’s mass adoption by supporting the growth of various startups and protocols.",
                "website": "https://despread.io/",
                "twitter": "https://x.com/DeSpreadLabs"
              },
              {
                "id": "0x1Cc335D9c67a71C777282fdb28b0a2d5eBf42AF4",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/flipside.png",
                "name": "Flipside",
                "Description": "Explore the best data and insights in Web3.",
                "website": "https://flipsidecrypto.xyz",
                "twitter": "https://www.twitter.com/flipsidecrypto"
              },
              {
                "id": "0x201c74de018aa34214BEEFFaF717e1d5F36261a7",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/nodeinfra.png",
                "name": "Nodeinfra",
                "Description": "We run nodes for blockchain protocols",
                "website": "https://nodeinfra.com",
                "twitter": "https://x.com/nodeinfra"
              },
              {
                "id": "0xE066B88A5c17180c0A774683363a2C69A4F54c1f",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/daic_cng.png",
                "name": "Coinage x DAIC",
                "Description": "The official validator node from Coinage (Coinage.Media) and DAIC (https://daic.capital/telegram)",
                "website": "https://daic.capital",
                "twitter": "https://x.com/coinage_x_daic"
              },
              {
                "id": "0xFc81ADDEE6D47B1EFba13E4e2268064D4a3cD065",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/OriginStake.png",
                "name": "OriginStake",
                "Description": "OriginStake is a trusted Proof-of-Stake infrastructure provider and validator to comfortably stake your coins and earn rewards with Berachain.",
                "website": "https://originstake.com",
                "twitter": "https://x.com/originstake"
              },
              {
                "id": "0xddE659DC0dfD9E9598268C7dEe6aF780be0aAf6e",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/BeraBucks.png",
                "name": "BeraBucks",
                "Description": "Ooga Booga. We are Berachain’s premier gaming focused validator, giving you access to the best games Web3 has to offer.",
                "website": "https://www.berabucks.com",
                "twitter": ""
              },
              {
                "id": "0x40495A781095932e2FC8dccA69F5e358711Fdd41",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/thj.jpg",
                "name": "The-Honey-Jar",
                "Description": "Henlo! Based community gateway to the berachain ecosystem",
                "website": "https://www.0xhoneyjar.xyz/",
                "twitter": "https://twitter.com/0xhoneyjar"
              },
              {
                "id": "0xC09A619A872c56C8de1354A4309aBBF317938084",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/kudasaijp.png",
                "name": "KudasaiJP",
                "Description": "KudasaiJP/Omakase is a professional staking and validation service. We also contribute to innovative projects via marketing and development support.",
                "website": "https://kudasai.co.jp",
                "twitter": "https://x.com/kudasai_japan"
              },
              {
                "id": "0x6c2917368A4d1A9d3edfe2EbDEc97C7E23e5a477",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/infstones.png",
                "name": "InfStones",
                "Description": "Easily launch and manage nodes, stake PoS tokens, use our API, and more.",
                "website": "https://infstones.com/",
                "twitter": "https://x.com/infstones"
              },
              {
                "id": "0x73B969ADE706e89469134f3b78b4E74FC16477bE",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/blacknodes.png",
                "name": "BlackNodes",
                "Description": " Blacknodes is an Enterprise-Level Validator and staking platform based out of INDIA, provides reliable nodes and diverse geolocations for a truly decentralized network. We provide high APR and no downtime.",
                "website": "https://blacknodes.net",
                "twitter": "https://www.twitter.com/BlackNodesHQ"
              },
              {
                "id": "0xC5b889a28950e7F8c1F279f758d8a0ab1C89cC38",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/StakeLab.png",
                "name": "StakeLab",
                "Description": "Staking and relaying Hub for Cosmos ecosystem",
                "website": "https://www.stakelab.zone",
                "twitter": "https://x.com/StakeLab"
              },
              {
                "id": "0x6fc5e7b9afE7b9538b2c7c0bD7652E782a6e945D",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/laminated.png",
                "name": "Laminated Labs",
                "Description": "Flaky, buttery validators just taste better.",
                "website": "https://laminatedlabs.com",
                "twitter": ""
              },
              {
                "id": "0x6f06dD615817886E8e1c3Cb837BF69F94e903472",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Everstake.png",
                "name": "Everstake",
                "Description": "Everstake is a staking-as-a-service company. We help institutional investors and regular token holders to profit off their crypto assets. Choose the most promising projects, delegate with Everstake, and make a stable passive income.",
                "website": "https://everstake.one",
                "twitter": "https://twitter.com/everstake_pool"
              },
              {
                "id": "0x9937642630228CA5d3b212e75b25dE2f1940d2D1",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/alienkong.png",
                "name": "0xak",
                "Description": "0xak node",
                "website": "",
                "twitter": "https://twitter.com/0xak_"
              },
              {
                "id": "0xDE8DF6cD1908D23f894B4cf5F8878EBd39DD4c1b",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Brightlystake-logo.png",
                "name": "Brightlystake",
                "Description": "Stake with Confidence",
                "website": "https://www.brightlystake.com",
                "twitter": "https://twitter.com/brightlystake"
              },
              {
                "id": "0xF050996f46b752a29D0d65Bf6348BDD37883ee83",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Synergy_Nodes_Logo.png",
                "name": "Synergy_Nodes",
                "Description": "We are operating a secure, stable Validator Node for 26 mainnet chains. We provide infrastructure support - public RPC, LCD endpoints, daily snapshots, operate multiple IBC Relayers, Blockchain Explorers, Youtube tutorials, etc. All info on our website.",
                "website": "https://www.synergynodes.com",
                "twitter": "https://x.com/SynergyNodes"
              },
              {
                "id": "0x208c27aA44ee2549F0a39e61483E18cC6bC99773",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/web3wizards.jpg",
                "name": "Web3 Wizards x Symmetry",
                "Description": "Web3 Wizards help organizations succeed in the Web3 space. Symmetry is an SEA-focussed incubator working with global ecosystems to empower builders in SEA.",
                "website": "https://web3wizards.xyz",
                "twitter": "https://x.com/Web3WizardsLabs"
              },
              {
                "id": "0xc1E61E119D4710c7ED90bad431812d30aEBbA091",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/stakingcabin.png",
                "name": "StakingCabin",
                "Description": "Trusted infrastructure and validator service provider for over 50 networks. Dedicated to delivering reliable and secure solutions. ",
                "website": "https://stakingcabin.com",
                "twitter": "https://twitter.com/StakingCabin"
              },
              {
                "id": "0xA7B927Cc85bFB997765aC86a86e46d36413e9B57",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/nodemeister.png",
                "name": "nodemeister",
                "Description": "freedom through decentralization",
                "website": "",
                "twitter": "https://x.com/nodemeister"
              },
              {
                "id": "0x29ECe5efcae11206474b16F29bb7C73B3F33cF6e",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/ghost.png",
                "name": "Ghost",
                "Description": "Ghost is building the next-gen blockchain indexing stack with GhostLogs and GhostGraph. GhostGraph is live on Berachain and lets developers create APIs for smart contracts. Stay in Solidity and create blazingly fast subgraphs",
                "website": "https://tryghost.xyz",
                "twitter": "https://x.com/0xGhostLogs"
              },
              {
                "id": "0xeC6d3f350BcdCe0F451D52e69f61Bf3630240B66",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/whispernode.png",
                "name": "WhisperNode 🤐",
                "Description": "WhisperNode is a premier web3 infrastructure provider renowned for powering the backbone of blockchain ecosystems with our state-of-the-art validation services, RPC endpoints, and IBC relayers. Our commitment to reliability is showcased through our deployment of robust, geographically dispersed validators ensuring maximal uptime and unparalleled security.",
                "website": "https://www.whispernode.com",
                "twitter": "https://www.twitter.com/whispernode"
              },
              {
                "id": "0x34D023ACa5A227789B45A62D377b5B18A680BE01",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/beradrome.jpg",
                "name": "beradrome-x-thj",
                "Description": "Joint validator of Beradrome and The Honey Jar. Delegate or stay poor",
                "website": "https://beradrome.com",
                "twitter": "https://twitter.com/beradrome"
              },
              {
                "id": "0x3Ab20D8fC60bDEddC1195C82eFD971024E7f90f4",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/staketab.png",
                "name": "Staketab",
                "Description": "Professional staking provider offering infrastructure solutions for the Web3 ecosystem.",
                "website": "https://staketab.com/",
                "twitter": "https://x.com/staketab"
              },
              {
                "id": "0x7F1d8CD8120722F937338208412318d9c5d35E1f",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/stakecito_logo.png",
                "name": "Stakecito",
                "Description": "Securing & Decentralizing PoS Networks.",
                "website": "https://www.stakecito.com",
                "twitter": "https://x.com/stakecito"
              },
              {
                "id": "0x99fC13a5b46491D84494165FFaa540fFE7AB78D1",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/ContributionDAO.png",
                "name": "ContributionDAO",
                "Description": "Secure Network With Institutional Grade Solution",
                "website": "https://contributiondao.com",
                "twitter": "https://x.com/contributedao"
              },
              {
                "id": "0x79Aac6a60C5EeDB512443F6B8D237F6CfbC6ce00",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Neuler.png",
                "name": "Neuler",
                "Description": "Accelerating decentralization",
                "website": "https://neuler.xyz",
                "twitter": ""
              }
            ],
            "activeValidatorsCount": 36,
            "bgtInflationCapture": 3370.8046658709054,
            "totalBgtReceived": 4498733.855900148
          }
        ],
        "total": 1
      }
      setLoading(false)
      setVaults(response?.vaults)
    } catch (error) {
      setLoading(false)
      setVaults([])
      console.error(error)
    }
  }
  return {
    loading,
    vaults,
    getValuts,
  }
}