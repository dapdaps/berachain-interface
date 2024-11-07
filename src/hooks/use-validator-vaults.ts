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
            "id": "0xAD57d7d39a487C04a44D3522b910421888Fb9C6d",
            "vaultAddress": "0xAD57d7d39a487C04a44D3522b910421888Fb9C6d",
            "stakingTokenAddress": "0xd28d852cbcc68DCEC922f6d5C7a8185dBaa104B7",
            "amountStaked": "0",
            "activeIncentives": [],
            "vaultWhitelist": {
              "whitelistedTokens": [
                {
                  "isWhiteListed": true,
                  "token": {
                    "address": "0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03",
                    "decimals": 18,
                    "symbol": "HONEY",
                    "name": "Honey"
                  }
                }
              ]
            },
            "metadata": {
              "vaultAddress": "0xAD57d7d39a487C04a44D3522b910421888Fb9C6d",
              "receiptTokenAddress": "0xd28d852cbcc68DCEC922f6d5C7a8185dBaa104B7",
              "name": "HONEY-WBERA",
              "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/honeybera.png",
              "product": "BEX",
              "url": "https://bartio.bex.berachain.com/pool/0xd28d852cbcc68DCEC922f6d5C7a8185dBaa104B7",
              "productMetadata": {
                "name": "BEX",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/bex.png",
                "url": "https://bartio.bex.berachain.com",
                "description": "Swap a variety of tokens effortlessly on our decentralized platform. Provide liquidity to pools and earn BGT rewards."
              }
            },
            "activeIncentivesInHoney": 0,
            "activeValidators": [
              {
                "id": "0x0eB8D197A58724Cf8b1046dFE0a9B9E116175051",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/dextrac.png",
                "name": "DexTrac",
                "Description": "Providing critical infrastructure and analytics for various Web3 ecosystems is our mission.",
                "website": "https://www.dextrac.com",
                "twitter": "https://www.twitter.com/DexTracNode"
              },
              {
                "id": "0xb38EEFA932aeA6468aEBF42320163C497104B0Bd",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Moni.png",
                "name": "Moni",
                "Description": "Your good neighbourhood validator by Moni. Moni is an ecosystem of analytical tools and a community of researchers, investors, and degens.",
                "website": "https://getmoni.io/",
                "twitter": "https://x.com/getmoni_io"
              },
              {
                "id": "0xA2B286a781233432204a573d6F40fbd2252cBBd4",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/blockscape.png",
                "name": "Blockscape",
                "Description": "Blockscape Finance AG is a Swiss company that provides enterprise-grade node operations for blockchains. We are running world-class infrastructure in multiple data centers across the globe.",
                "website": "https://www.blockscape.network",
                "twitter": "https://x.com/BlockscapeLab"
              },
              {
                "id": "0xE13456C1De1E04a5F7dE5Db6757eb9239Ab9BE56",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/stakin-logo-square.png",
                "name": "Stakin",
                "Description": "Institutional staking service providers with nearly $2bn in Assets under Delegation, and support for more than 40 blockchain networks",
                "website": "https://stakin.com",
                "twitter": "https://twitter.com/StakinOfficial"
              },
              {
                "id": "0x9357cc9ba2660459Ef9bb52E69cd64FE379Ff1D5",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/imperator.png",
                "name": "Imperator.co",
                "Description": "Imperator empowers investors and token holders to effortlessly secure blockchain networks through non custodial staking",
                "website": "https://www.imperator.co",
                "twitter": "https://x.com/imperator_co"
              },
              {
                "id": "0x51e15e71c865FE702C9347610667f83658A20e00",
                "logoURI": "",
                "name": "Innovix Dog",
                "Description": "Innovix Dog staking validator for innovative blockchain solutions.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xd4963136Cd28CC1c3213F0499A62103171f3468B",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/huginn.png",
                "name": "Huginn",
                "Description": "Professional staking service. 7/24 monitoring and best uptime. Huginn is an organization that aims to teach its community about Cosmos SDK and Blockchain.",
                "website": "https://huginn.tech/",
                "twitter": "https://x.com/HuginnStake"
              },
              {
                "id": "0x64FE2F0C072858A9742917e48e29BD939EeBB179",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/kiln.png",
                "name": "Kiln",
                "Description": "Enterprise-grade staking made easy",
                "website": "https://www.kiln.fi",
                "twitter": "https://x.com/Kiln_Finance"
              },
              {
                "id": "0x560015b1bEFbDD56c32B70c3B43eC7721732AEd7",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x675547750F4acdf64eD72e9426293f38d8138CA8",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xdb96E9cDD1e457b602f97d33e51736D7a5216496",
                "logoURI": "",
                "name": "Aether Solutions",
                "Description": "Aether Solutions staking validator for seamless blockchain integration.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x6AD344AE0dd15671c8e94B4A95a3965d3CC2F11D",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x9fc867Eb3B841ec3068B768eBc2B03dd95A0Ab6F",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/fnl.png",
                "name": "FNL",
                "Description": "FNL provides institutional-grade blockchain infrastructure and services.",
                "website": "https://fnl.qa/",
                "twitter": ""
              },
              {
                "id": "0x63Ba2DD43EA2DD8e6C8B9dfEf8940d4bFd4682D3",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/OKXEarn.png",
                "name": "OKX Earn",
                "Description": "OKX Earn serves as a one-stop shop for all the decentralised earning options available on the OKX platform and we are the leading staking service provider for blockchain projects",
                "website": "https://www.okx.com/",
                "twitter": "https://x.com/okx"
              },
              {
                "id": "0x6e8dc7aabb2aE046a1EC20606FE1bD13441B8B65",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xAD5FAc408dC3cDaf42b0394B09C661d43137C5Ed",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/blockhunters.png",
                "name": "BlockHunters 🎯",
                "Description": "Hunt for the best ooga booga",
                "website": "https://www.blockhunters.org",
                "twitter": "https://www.x.com/blockhuntersOrg"
              },
              {
                "id": "0x6A11E320a01E30eD762ef0Fa7da03812924C6CD1",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/blrd.gif",
                "name": "BLRD",
                "Description": "BLRD is a subsidiary of GREE, a Japanese game company.",
                "website": "https://blrd.inc",
                "twitter": "https://x.com/helloblrd"
              },
              {
                "id": "0x95e0aE2F9581fdC1F4FC7fc111c13D62eeF3b888",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x5f639f8E6c120F0497DBdA309F8CA5be9113aB01",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/hashkey.png",
                "name": "HashKey Cloud",
                "Description": "Cloud for WEB3 More Than Staking",
                "website": "https://www.hashkey.cloud/",
                "twitter": "https://x.com/HashKeyCloud"
              },
              {
                "id": "0x4A8c9a29b23c4eAC0D235729d5e0D035258CDFA7",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xF6c8e5f65ea829913D37C275d2DB60e8FD36d3a1",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/upnodewhitebg.png",
                "name": "Upnode",
                "Description": "Professionally managed institutional grade blockchain infrastructure provider.",
                "website": "https://upnode.org",
                "twitter": "https://x.com/upnodeIntern"
              },
              {
                "id": "0x0000000000000000000000000000000000000000",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x1A466C9707D1CD8fDF3Db56a7A683D30d54d955F",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xD26d9aC83558268F5f71Fd48AF2078718E43E762",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/allnodes.png",
                "name": "Allnodes",
                "Description": "Reliable non-custodial Validator run by the industry leader - Allnodes.",
                "website": "https://www.allnodes.com",
                "twitter": "https://x.com/allnodes"
              },
              {
                "id": "0xDcb7DE385dA16c69284351C9fAfEda1Bfeee6ceE",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/kintsugi.png",
                "name": "Kintsugi Nodes",
                "Description": "Your professional, global PoS validator. Delegate, earn, and join our journey to a golden blockchain.",
                "website": "https://www.kintsugi.tech",
                "twitter": "https://x.com/kintsugi_tech"
              },
              {
                "id": "0xe74800e06678fd161b215419A8718583Ec2Cde23",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xD25E4b02C09AD1c6A01a59C75929A4e62647754B",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/bedrock-logo.png",
                "name": "BedRock",
                "Description": "The largest Asian-based institutional grade staking and RPC provider.",
                "website": "https://www.bedrock.technology",
                "twitter": "https://x.com/Bedrock_DeFi"
              },
              {
                "id": "0xC653E9188532238A36Dd2c02d63eE1931F3E46F0",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/polkachu.png",
                "name": "polkachu.com",
                "Description": "Polkachu is the trusted staking service provider for blockchain projects. 100% refund for downtime slash. Contact us at hello@polkachu.com",
                "website": "https://polkachu.com",
                "twitter": "https://www.twitter.com/polka_chu"
              },
              {
                "id": "0x4A32ed6B31527d3fbF5184cb96b0E3dBeb9328c9",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x0484Cc87F35088af7a0bCe3b155FFE2e91A9baa8",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xaa1B325cD67528a78E202A79933154d024B812Af",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xBAB7a9C5EE624E1C6d9e5331a4C6c0344f5387D4",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x06A7D20154c336be6103B2D588e6c6ECeB571186",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x8b59F2F0a9Fc5A994756F5dc76f16d047434C413",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/rockawayxinfra.png",
                "name": "RockawayX Infra",
                "Description": "RockawayX Infra is an institution-grade bare-metal staking operator",
                "website": "https://rockawayx.com/infrastructure",
                "twitter": "https://x.com/RockawayX_Infra"
              },
              {
                "id": "0x3Cc1AdB0f1F0083251E91eD680edE394703bEBdb",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x000000D5Eb1528A06C83F0b4F2C86F5b48500000",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x9c57247136f873E7fE0120cbaE911458c57ce224",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x7A2FC32df0Dba4B3E452301C4f2b59F92b9f8BdB",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x913f641923aDA6B7cE6CBE2BBCC61a1bD8cad1BA",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x849a5C52e1CA4AB0407E5BE3030cC420E7222F13",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/restake.jpg",
                "name": "Restake",
                "Description": "Effortless staking with institutional standards",
                "website": "https://restake.net",
                "twitter": "https://x.com/restakestaking"
              },
              {
                "id": "0x33A57eE044f0778a8C46CdA61C67a54fB322fe7e",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/GoldenRatioStakingLogo.png",
                "name": "Golden Ratio Staking",
                "Description": "Bare Metal Interchain Relayer and Validator. Powered by the most beautiful number in Cosmos!",
                "website": "https://www.goldenstaking.com",
                "twitter": "https://x.com/GoldenStaking"
              },
              {
                "id": "0x745e986D3899f5d61338Db7352cc1d0a8dBB17fE",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x1F64DaE2F11E5D385b811e964D2D72db5902Af6b",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/figment.png",
                "name": "Figment",
                "Description": "",
                "website": "https://figment.io/",
                "twitter": "https://twitter.com/Figment_io"
              },
              {
                "id": "0xbb2d162A78a08f6456fc0E55aea1267BC74C29DC",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xBE4AC4705CFc15630D88f92a58Fe004498aDD783",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/stakely-io-small-logo.png",
                "name": "Stakely",
                "Description": "🔥 Professional validator highly experienced in PoS 🔥 Slashing protection & Eligible for airdrops | Learn with our staking guides, video tutorials and FAQs | Part of the commission of our nodes will go to our Multicoin Faucet funds and other tools 🌱 Carbon Neutral 🌱",
                "website": "https://stakely.io",
                "twitter": "https://x.com/Stakely_io"
              },
              {
                "id": "0xC667891581280551ad01A0feeCE6b925D9C9Bb08",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x2c11C4C97ca866d64CC09Ea2dcD76f2D2EC6Ae55",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/citadelone.png",
                "name": "Citadel.one",
                "Description": "Citadel.one is a multi-asset non-custodial staking platform that lets anyone become a part of decentralized infrastructure and earn passive income. Stake with our nodes or any other validator across multiple networks in a few clicks.",
                "website": "https://citadel.one",
                "twitter": "https://twitter.com/CitadelDAO"
              },
              {
                "id": "0x48f6d382ADb33b50944489D4f303B2B68C21a530",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x7b7080aDDF3d3884706e4bb0e0E1B82642C4cc17",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x3F12999A9122fD5B254405FB8A797dB162eAAC9c",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xFa174BD57b20f0EE338b9699391B9f49f767FbEd",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xF9fA3564BC56Dd5B1307B98000447419FC4A3d0a",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x364020282B9A82f6Be32fd20Ff829b7F0AacD118",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/BlockPI-Network.jpg",
                "name": "BlockPI Network",
                "Description": "Distributed multi-chain acceleration layer. Solving the RPC requests congestion problem with infinite scalability.",
                "website": "https://blockpi.io/",
                "twitter": "https://twitter.com/RealBlockPI"
              },
              {
                "id": "0x388Ff9fdB11A22aD78e9C5977CC4eD130cE5E88b",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/cosmostation.png",
                "name": "Cosmostation",
                "Description": "Cosmostation validator node. Delegate your tokens and Start Earning Staking Rewards",
                "website": "https://www.cosmostation.io",
                "twitter": "https://x.com/CosmostationVD"
              },
              {
                "id": "0xD073a84e2ccDF91a9025179330438485E886D206",
                "logoURI": "",
                "name": "Hyperion Inc.",
                "Description": "Hyperion Inc. staking validator with top-notch security.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xF60fD8632Fc77E19b3A0637d115d0fdd06F36968",
                "logoURI": "",
                "name": "Aether Labs",
                "Description": "Aether Labs staking validator for seamless blockchain integration.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x185F4Eebd01614aE3d12a5E49b184B054C46d37B",
                "logoURI": "",
                "name": "Cypher Inc.",
                "Description": "Cypher Inc. staking validator for secure and private transactions.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xbDa130737BDd9618301681329bF2e46A016ff9Ad",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x63cBc5DCf0921f81941983F2b1b214B231f19353",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x78CF043a915c430e3ca1E926F1cC8B8b142f85Ea",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xb3047c1c481E407Dd90EAD9ad8D79F29C35152CC",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x20FB4a3366bC54a981F7E6173e52EA645C825679",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/verse2.png",
                "name": "verse2",
                "Description": "Starting as a builder, Verse2 has expanded its business to node validators, crypto investors, and advisors for web3 projects, growing its influence in the Asian crypto scene. Verse2 has an outstanding and professional track record in running nodes for Layer 1 Mainnets. The team has been a node operator for major chains both locally and globally.",
                "website": "https://verse2.io",
                "twitter": "https://x.com/verse2official"
              },
              {
                "id": "0x36393255e8BB9042c2eD32728Acd01c0E013aE48",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Forest_Staking.png",
                "name": "Forest_Staking",
                "Description": "Forest Staking is a team of military and civilian trained cybersecurity engineers, Linux admins and blockchain enthusiasts",
                "website": "https://foreststaking.com",
                "twitter": "https://x.com/ForestStaking"
              },
              {
                "id": "0x4a463C6bDDf724D11F14165B4d733fE2895C347a",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x422bF55a30431d0328Da39602B8EB83994acE3E0",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x3bd0E8f1B1E8Ec99a4E1762F4058F9884C93af31",
                "logoURI": "",
                "name": "Nexa Solutions",
                "Description": "Nexa Solutions staking validator for efficient blockchain operations.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x1B9a5E47Edf68D7C676908fAeF39808e87b64335",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x4cb5274FA9961D2Ef329C1b4A0bAA9dE690f3959",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x4Afe0DFDAcc91F0fA2AEe39F9eAd66b64d03EbD6",
                "logoURI": "",
                "name": "Helix Inc.",
                "Description": "Helix Inc. staking validator for robust and scalable solutions.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x7b75F753c1677502d878f8924d5a9dBC54292BF1",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/validationcloud.png",
                "name": "Validation Cloud",
                "Description": "Validation Cloud is a Web3 platform that delivers elite, high-performance node and staking infrastructure.",
                "website": "https://www.validationcloud.io",
                "twitter": "https://x.com/ValidationCloud"
              },
              {
                "id": "0x6FDF39bEbD553846515C34174FDD5887Df584E55",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x93174B2DaD595F35582cC62FCBf96b86709863D5",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/stakefish.png",
                "name": "stakefish",
                "Description": "We are the leading staking service provider for blockchain projects. Join our community to help secure networks and earn rewards. Stake. Earn. Relax.",
                "website": "https://stake.fish/",
                "twitter": "https://twitter.com/stakefish"
              },
              {
                "id": "0xDc6De65f6070b409125217a12Cf576A208Cc1998",
                "logoURI": "",
                "name": "Lumina Labs",
                "Description": "Lumina Labs staking validator for bright and efficient operations.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x0331A9665E8f47b4C289eb665f8466f68e9ae9a5",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xbc96B233211AD9b200b7a77d6c60B6eD868f3E3f",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x6c9E29A5B5fC44D7044Ea42699cEf92F0B063Eb5",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x2Ecd703B119C3FbFb2ec4b9FFa6d8756f7De9428",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/manticore.jpg",
                "name": "MantiCore",
                "Description": "Secure and reliable individual PoS/PoW validator. Best uptime and 24/7 support.",
                "website": "https://manticore.team",
                "twitter": "https://twitter.com/MantiCoreNodes"
              },
              {
                "id": "0xb9a344c2138E555B73064Fa8349D8CE68f6E5582",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/benmo.png",
                "name": "Benmo",
                "Description": "BenMo Block is a DeFi community in the Asia-Pacific region, with many advanced blockchain investors actively involved.",
                "website": "https://www.benmo.io",
                "twitter": "https://x.com/Super4DeFi"
              },
              {
                "id": "0x377bcA11d71eBE440F797Af3cf2a08fd120b4e94",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Provalidator.jpg",
                "name": "Provalidator",
                "Description": "Supporting Blockchain Infrastructure",
                "website": "https://provalidator.com",
                "twitter": "https://x.com/Provalidator"
              },
              {
                "id": "0x597554a9e66F45EAba7Dec28E7fc482df0AAC2Bf",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x14eA75C0e1aB985A9594163D27C802D36f8c1497",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xDEd1dB9b2FBEf998908Af69dA6addd9fD72D86f3",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x760B5898079046E8Daa0059d3A3080fF28EBC3f0",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xCA8042d73B82e6aA4bCB37Ad520c36549D136819",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/amber.jpg",
                "name": "Amber Group",
                "Description": "Amber is building the future of digital assets",
                "website": "https://www.ambergroup.io/",
                "twitter": "https://x.com/ambergroup_io"
              },
              {
                "id": "0x142E206186d582dF6CA2D7110a653054CDBAed51",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/node101.png",
                "name": "node101",
                "Description": "We provide infrastructure services, host non-profit developer-focused events, and offer user-friendly products for you to make the most of distributed value. Building klein.run",
                "website": "https://node101.io",
                "twitter": "https://x.com/node_101"
              },
              {
                "id": "0x7aFFA845a2b4d1602cd8c8BbC4D1D61910d05F06",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x602b08F34919D3aa107c481DBAbF11Fb76B10BB9",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/bwarelabs.png",
                "name": "BwareLabs",
                "Description": "Guaranteed availability and up-time backed by a professional blockchain infrastructure team.",
                "website": "https://bwarelabs.com/",
                "twitter": "https://x.com/bwarelabs"
              },
              {
                "id": "0x3649839562C8dA64E6215EB0f5371629Ead9729D",
                "logoURI": "",
                "name": "Zenith Inc.",
                "Description": "Zenith Inc. staking validator for maximum reliability and uptime.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xBC3c03b4185A6F10618CC4E7B9f4AdD59AB5FbbA",
                "logoURI": "",
                "name": "Vertex Dog",
                "Description": "Vertex Dog staking validator for pinnacle performance.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xBC9BC89b295a14F3976234Cc37C73e3D286f3a49",
                "logoURI": "",
                "name": "OmniCore Labs",
                "Description": "OmniCore Labs staking validator for comprehensive blockchain support.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xCe8D4e158981c4BB9B830FD729E415B5F7b666aF",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x1e2e53c2451d0f9ED4B7952991BE0c95165D5c01",
                "logoURI": "",
                "name": "Quantum Labs",
                "Description": "Quantum Labs staking validator for secure transactions.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x12De044207a90709Ef2602D3D9D945d64dAe6147",
                "logoURI": "",
                "name": "Aero Solutions",
                "Description": "Aero Solutions staking validator for lightweight and fast transactions.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x34D68dFFa8cFe02Dd9C480b8bfB7C3A9ED3fc24a",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/rhino.png",
                "name": "RHINO 🦏",
                "Description": "An Active, Independent and Secure Blockchain Validator. We deliver redundant and geo-distributed infrastructure at-scale for Aptos, Sei, Chainlink, Ethereum, and Cosmos",
                "website": "https://rhinostake.com",
                "twitter": "https://twitter.com/rhinostake"
              },
              {
                "id": "0x1A594e7aCb60a4fA0C9d7525695ef7524D047525",
                "logoURI": "https://res.cloudinary.com/duv0g402y/image/upload/v1723065834/src/assets/brown-bear.png",
                "name": "Brownstake",
                "Description": "Brownstake provides staking services for all friends at high rates and low returns.",
                "website": "https://www.brownbear.com/",
                "twitter": "https://x.com/BrownBear__Bear"
              },
              {
                "id": "0x10B1dEbfE066e79E26f21B0212e9693658Fdb12d",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x723b1804C8FB4E1B997817608A7a5CACdCAc0BFD",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x7760D27dB62acf2699ea0A58fB7D2DC0b72d4e83",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/informal-systems.png",
                "name": "Informal Systems",
                "Description": "Informal Systems x Cephalopod Equipment - infrastructure for decentralized intelligence",
                "website": "https://www.informal.systems",
                "twitter": "https://x.com/informalinc"
              },
              {
                "id": "0xB4198e19B7370d199d928A479D72D5D3c043DC38",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/BCW.png",
                "name": "BCW",
                "Description": "BCW Group is an enterprise technology firm & venture studio dedicated to building Web3 infrastructure & applications that connect and interact with the on-demand digital universe.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xeb0cC289eDeC06F9fA1373d0641B3Aa01cF33ab4",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x2E8410239bB4b099EE2d5683e3EF9d6f04E321CC",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x6863E136EaDfD9915EE2a2b07870Ea64328868A8",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
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
                "id": "0x35DaAEB5B592d963D6B3b5f2f7EB71e259C96f98",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/gumi.png",
                "name": "gumi",
                "Description": "One of the largest Japanese game publisher.As pioneers in the creation of entertainment using new technologies, gumi will continue to deliver surprises and excitement to the world.Creating a new business ecosystem through decentralization and capitalization of digital data.",
                "website": "https://gu3.co.jp/en/blockchain/",
                "twitter": "https://x.com/gumi_oshi3_en"
              },
              {
                "id": "0x7276365135e103C622c991De0bc7fD600F2eB577",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/node-guardians.png",
                "name": "Node Guardians",
                "Description": "Berachain Testnet Network is under the watchful eyes of the Node Guardians - nodeguardians.io",
                "website": "https://infra.nodeguardians.io",
                "twitter": "https://x.com/nodeguardians"
              },
              {
                "id": "0x8a88215ae882dfA519730c40109556c1C235729f",
                "logoURI": "",
                "name": "Vortex Dog",
                "Description": "Vortex Dog staking validator for rapid transaction validation.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xf74d43D6b926FBC48f8a97eFBde60EdBa6a9DeaD",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x9D46d1460FB230d7B1066e2A8908D49Fcd597EB4",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xd35c4d1416A0A38B1D4b40d0Df638B63476C5071",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x1Badfd6B19d78a7A4FB78d59dAa0CA7745d8E0bE",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x9a3B94371A1b524A7963D10A015d053d5E7d2989",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/01node.png",
                "name": "01node",
                "Description": "Securely validating one block at a time since 2019",
                "website": "https://01node.com",
                "twitter": "https://twitter.com/01node"
              },
              {
                "id": "0x1cD956d95bf46d71828661f8efd1AEaC9F052A71",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/P2P.png",
                "name": "P2P.ORG - P2P Validator",
                "Description": "P2P.org Provides Non-Custodial Staking Services For Professional Investors",
                "website": "https://p2p.org/",
                "twitter": "https://x.com/P2Pvalidator"
              },
              {
                "id": "0x11F668185a1553E93838e514B3D22a197fC350f6",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x1a0A57e5e6a66aD732295ddAF0aed286a4e64310",
                "logoURI": "",
                "name": "Synapse Labs",
                "Description": "Synapse Labs staking validator for reliable and fast transactions.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x7d0f205f4a7F10B7B1c6282193aA202dC16fBbbe",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/noders.png",
                "name": "[NODERS]TEAM",
                "Description": "Professional blockchain validator and web3 developer team",
                "website": "https://nodersteam.com/",
                "twitter": "https://twitter.com/NODERS_TEAM"
              },
              {
                "id": "0x034855669054BEbe87374317F1c848237a591046",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x714da3f7c024f743477A4FA29da3926D8807DDd3",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x77e6E4cdDEEAC03f39A846F28cA036141e04A0Ba",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x2D764DFeaAc00390c69985631aAA7Cc3fcfaFAfF",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/infrared.jpg",
                "name": "Infrared",
                "Description": "Proof of Liquidity in one click 🐻⛓️",
                "website": "https://infrared.finance",
                "twitter": "https://x.com/infraredfinance"
              },
              {
                "id": "0xDA2e2BBcf58573F2aF0Eca77393FAe7Cd525e5eb",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/quantnode.png",
                "name": "QuantNode",
                "Description": "Safe & Easy2Use Staking Provider. Supporting networks at early stage",
                "website": "https://quantnode.tech",
                "twitter": "https://x.com/quantnodetech"
              },
              {
                "id": "0x3A554156aeA1921Abb277F63D6109cA81B530A3E",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/Angelhack.jpg",
                "name": "Angelhack",
                "Description": "World's Leader in Hackathons and Developer Relations",
                "website": "https://angelhack.com/",
                "twitter": "https://x.com/AngelHack"
              },
              {
                "id": "0xbC600d92B5eb535cfcCb4450E84fD7b857E545Ca",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x0d8e54696b5BBB0BF5444b9D18b118f9C01a0729",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x4FD9AD23AeF709f9405Cbe6fdD89ab63d67F2c80",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xaD76712146E358570614b795Bac79A96bc0e75D9",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/coinhall_logo.png",
                "name": "coinhall.org 📈🔄",
                "Description": "Coinhall is a community first platform providing real time price charts & analytics, and aggregating DEXes across the Cosmos ecosystem",
                "website": "https://coinhall.org",
                "twitter": "https://x.com/coinhall_org"
              },
              {
                "id": "0x44a5FBfa7d6f3Fd92cca01f6764509f8Fc33dfa5",
                "logoURI": "",
                "name": "Fluxion Labs",
                "Description": "Fluxion Labs staking validator for high-speed transaction processing.",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xa5E4cA774F3c8dA67487560c7131ff82b675c6Ab",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xEF9dc1166C1E1C6b46294eBb1e653d46D7d3e0d4",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xBd44230DE8a458e5355Ed390F125F11848053bDc",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/staked.png",
                "name": "Staked",
                "Description": "Staked is the leading provider of validation technology and services.",
                "website": "https://staked.us",
                "twitter": ""
              },
              {
                "id": "0x11575d9095762B5063b620Ba169642E9F2679f46",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x447B00FF9F40725C91BBb159068Be136F1dbb434",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/meria.png",
                "name": "Meria",
                "Description": "Meria is an institutional-grade staking service provider running blockchain infrastructure on more than +35 networks.",
                "website": "https://meria.com",
                "twitter": "https://x.com/Meria_Finance"
              },
              {
                "id": "0xD6203addb3a895008777fb2bF8930c6323d6Dbe5",
                "logoURI": "https://res.cloudinary.com/dvcbkhryu/image/upload/v1730431515/Pump_BTC_logo_pjqzyc.png",
                "name": "PumpBTC",
                "Description": "PumpBTC serves as a Liquid Staking Solution for Babylon. PumpBTC aims to help BTC holders maximize yields through Babylon's staking",
                "website": "https://pumpbtc.xyz",
                "twitter": "https://x.com/Pumpbtcxyz"
              },
              {
                "id": "0x93F64bA2948914d65Cd227c3501E22C93EBee19f",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x6Ae5c02469F78E04e5dB3f03AeAc639797578fbe",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x4752959D19f8ffFF2A6F0B7624cbe2Bf25A2292a",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0xa276371eE792c346DcA19b7F4669EE96212299B2",
                "logoURI": "",
                "name": "",
                "Description": "",
                "website": "",
                "twitter": ""
              },
              {
                "id": "0x6aB7C955d64Dd7A1fbAffD9DC27E8425Ddb7441b",
                "logoURI": "https://x.com/Beranames/photo",
                "name": "Beranames",
                "Description": "Official Name Service of @Berachain",
                "website": "https://www.beranames.com",
                "twitter": "https://x.com/Beranames"
              },
              {
                "id": "0xcE8A09bAa9f732649f620E8b7dc1356d649CF5Ed",
                "logoURI": "https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/pearl.png",
                "name": "Pearl",
                "Description": "",
                "website": "",
                "twitter": ""
              }
            ],
            "activeValidatorsCount": 138,
            "bgtInflationCapture": 1916.2782815123403,
            "totalBgtReceived": 22494274.207115296
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