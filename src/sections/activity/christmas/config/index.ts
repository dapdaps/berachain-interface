import { beraB } from "@/configs/tokens/bera-bArtio";

export const EcosystemQuests: any = {
  "The Honey Jar": {
    categories: ["Community"],
    icon: "/images/activity/christmas/quest/logos/the-honey-jar.svg",
    banner: "/images/activity/christmas/quest/banners/The Honey Jar.jpg",
    description:
      "Berachain cult venture studio BUIDLing honeycomb (largest bera NFT), Henlo ( grade cultcoin) & da largest cult validator",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.0xhoneyjar.xyz/" },
      { label: "X", link: "https://twitter.com/0xhoneyjar" },
      { label: "Discord", link: "https://discord.com/invite/thehoneyjar" },
      { label: "Docs", link: "https://0xhoneyjar.mirror.xyz/" },
    ]
  },
  Henlo: {
    categories: ["Memecoin"],
    icon: "/images/activity/christmas/quest/logos/henlo.svg",
    banner: "/images/activity/christmas/quest/banners/Henlo.jpg",
    description:
      "dumb memecoin built by 0xhoneyjar the biggest cult org in the berachain ecosystem. crypto is hard, henlo is easy",
    missions: {
      view: {
        text: (amount: number) => `Go to the website and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Go"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      },
      address: {
        text: (amount: number) => `Verify if you’re a crew member and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
    },
    socials: [
      { label: "Website", link: "https://www.henlo.com/" },
      { label: "X", link: "https://twitter.com/henlo" },
      // { label: "Discord", link: "" },
      { label: "Docs", link: "https://cult.henlo.com/" },
    ]
  },
  Kingdomly: {
    categories: ["NFT", "Launchpad"],
    icon: "/images/activity/christmas/quest/logos/kingdomly.svg",
    banner: "/images/activity/christmas/quest/banners/Kingdomly.jpg",
    description:
      "An all in one NFT Dapp, launch, mint, trade (coming thoon) on Kingdomly",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.kingdomly.app/" },
      { label: "X", link: "https://twitter.com/KingdomlyApp" },
      { label: "Discord", link: "https://discord.com/invite/GpQFyde3Sv" },
      { label: "Docs", link: "https://docs.kingdomly.app/kingdomly-developer-docs" },
    ]
  },
  Ramen: {
    categories: ["Launchpad", "NFT"],
    icon: "/images/activity/christmas/quest/logos/ramen-hungry-bera.svg",
    banner: "/images/activity/christmas/quest/banners/Ramen.png",
    description:
      "Token launchpad powering liquidity for next-gen protocols on Berachain.",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://ramen.finance/" },
      { label: "X", link: "https://twitter.com/ramen_finance" },
      { label: "Discord", link: "https://discord.gg/ramenfinance" },
      { label: "Docs", link: "https://docs.ramen.finance/ramen-finance" },
    ]
  },
  "Big Fat Bera (Beraborrow NFTs)": {
    categories: ["NFT"],
    icon: "/images/activity/christmas/quest/logos/big-fat-bera.jpg",
    banner: "/images/activity/christmas/quest/banners/Big Fat Bera.jpg",
    description:
      "Big Fat Beras by Beraborrow. A 6,900 collection of the biggest and fattest Beras. Ooga Matata.",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://opensea.io/collection/big-fat-beras-beraborrow" },
      { label: "X", link: "https://x.com/bigfatberas" },
      { label: "Discord", link: "https://discord.com/invite/beraborrowofficial" },
      { label: "Docs", link: "https://opensea.io/collection/big-fat-beras-beraborrow" },
    ]
  },
  Beraji: {
    categories: ["NFT", "Wallet"],
    icon: "/images/activity/christmas/quest/logos/beraji.svg",
    banner: "/images/activity/christmas/quest/banners/Beraji.jpg",
    description:
      "A proof-of-engagement ecosystem blending gamification to drive meaningful on-chain actions on berachain.",
    missions: {
      wallet1: {
        text: (amount: number) => `Claim $BERA from the faucet in BeraSig Wallet and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Claim"
      },
      wallet2: {
        text: (amount: number) => `Swap $BERA to STGUSDC in BeraSig Wallet and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Swap"
      },
      wallet3: {
        text: (amount: number) => `Mint $Honey in BeraSig Wallet and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Mint"
      }
    },
    socials: [
      // { label: "Website", link: "" },
      { label: "X", link: "https://twitter.com/Berajibears" },
      { label: "Discord", link: "https://discord.com/invite/berajibears" },
      // { label: "Docs", link: "" },
    ]
  },
  Yeet: {
    categories: ["BetFi", "GameFi"],
    icon: "/images/activity/christmas/quest/logos/yeet.svg",
    banner: "/images/activity/christmas/quest/banners/Yeet.jpg",
    description: "The bremiere bonzi of berachain",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.yeetit.xyz/" },
      { label: "X", link: "https://twitter.com/eatsleepyeet" },
      { label: "Discord", link: "https://discord.gg/yeetards" },
      { label: "Docs", link: "https://www.cia.gov/report-information/" },
    ]
  },
  Honeypot: {
    categories: ["DeFi", "Dex", "Launchpad"],
    icon: "/images/activity/christmas/quest/logos/honeypot.svg",
    banner: "/images/activity/christmas/quest/banners/Honeypot.jpg",
    description:
      "PoL Accelerator that unites a fair launchpad & a secure DEX on Berachain",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://honeypotfinance.xyz/" },
      { label: "X", link: "https://twitter.com/honeypotfinance" },
      { label: "Discord", link: "https://discord.gg/honeypotfi" },
      { label: "Docs", link: "https://docs.honeypotfinance.xyz/" },
    ]
  },
  "Eden labs": {
    categories: ["Sexualfi"],
    icon: "/images/activity/christmas/quest/logos/eden-labs.svg",
    banner: "/images/activity/christmas/quest/banners/Eden labs.jpg",
    description: "The first sexual products on blockchain",
    missions: {
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://eden.sexualfi.com" },
      { label: "X", link: "https://x.com/EdenWeb3_Global" },
      { label: "Discord", link: "https://discord.com/invite/edenweb3" },
      { label: "Docs", link: "https://eden.sexualfi.com" },
    ]
  },
  Puffpaw: {
    categories: ["VAPE2EARN", "RWA", "DePin"],
    icon: "/images/activity/christmas/quest/logos/puffpaw.svg",
    banner: "/images/activity/christmas/quest/banners/Puffpaw.jpg",
    description: "Vape 2 quit smoking and earn",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://puffpass.puffpaw.xyz" },
      { label: "X", link: "https://twitter.com/puffpaw_xyz" },
      { label: "Discord", link: "https://discord.com/invite/puffpaw" },
      { label: "Docs", link: "https://mirror.xyz/puffpaw.eth" },
    ]
  },
  memeswap: {
    categories: ["DeFi", "Dex"],
    icon: "/images/activity/christmas/quest/logos/meme-swap.svg",
    banner: "/images/activity/christmas/quest/banners/memeswap.jpg",
    description: "All your memes are belong to us. Much liquidity. Such yield.",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://memeswap.fi/" },
      { label: "X", link: "https://twitter.com/memeswapfi" },
      { label: "Discord", link: "https://discord.gg/gxTzq3WYa8" },
      { label: "Docs", link: "https://docs.memeswap.fi/" },
    ]
  },
  Beradrome: {
    categories: ["Marketplace", "DeFi"],
    icon: "/images/activity/christmas/quest/logos/beradrome.svg",
    banner: "/images/activity/christmas/quest/banners/Beradrome.jpg",
    description: "Native liquidity marketplace on berachain",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://bartio.beradrome.com/" },
      { label: "X", link: "https://twitter.com/beradrome" },
      { label: "Discord", link: "https://discord.beradrome.com" },
      { label: "Docs", link: "https://docs.beradrome.com/" },
    ]
  },
  Beraboyz: {
    categories: ["NFT", "Memecoin"],
    icon: "/images/activity/christmas/quest/logos/beraboyz.svg",
    banner: "/images/activity/christmas/quest/banners/Beraboyz.jpg",
    description: "First n Only NFT on berachain",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "learn"
      }
    },
    socials: [
      { label: "Website", link: "https://app.berascout.com/" },
      { label: "X", link: "https://twitter.com/BeraBoyzGG" },
      { label: "Discord", link: "https://discord.com/invite/zaQKp2bTGB" },
      { label: "Docs", link: "https://opensea.io/collection/beraboyz-4" },
    ]
  },
  cubhub: {
    categories: ["NFT", "GameFi"],
    icon: "/images/activity/christmas/quest/logos/cubhub.svg",
    banner: "/images/activity/christmas/quest/banners/Cubhub.jpg",
    description:
      "Poke The Bear, Get The Claws. An Augmented Reality Based Project On berachain",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.cubhubx.com/" },
      { label: "X", link: "https://twitter.com/CubhubX" },
      { label: "Discord", link: "https://discord.gg/djmu7n9fak" },
      { label: "Docs", link: "https://cubhubnft-whitepaper.gitbook.io/official-cubhub-whitepaper" },
    ]
  },
  Bakeland: {
    categories: ["GameFi"],
    icon: "/images/activity/christmas/quest/logos/bakeland.svg",
    banner: "/images/activity/christmas/quest/banners/Bakeland.png",
    description: "turning crypto into a P2E metaRPG",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://bakeland.xyz" },
      { label: "X", link: "https://x.com/bakelandxyz" },
      { label: "Discord", link: "https://discord.gg/PNheR6h5vB" },
      { label: "Docs", link: "https://bakeland.xyz" },
    ]
  },
  Beramonium: {
    categories: ["GameFi", "NFT"],
    icon: "/images/activity/christmas/quest/logos/beramonium.svg",
    banner: "/images/activity/christmas/quest/banners/Beramonium.jpg",
    description:
      "Building the first & biggest idle RPG on berachain. Get your Beras & join the game!",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://gemhunters.beramonium.io/welcome" },
      { label: "X", link: "https://x.com/Beramonium" },
      { label: "Discord", link: "https://discord.com/invite/beramonium" },
      { label: "Docs", link: "https://beramonium-chronicles.gitbook.io/gemhunters" },
    ]
  },
  Beraplug: {
    categories: ["Memecoin"],
    icon: "/images/activity/christmas/quest/logos/beraplug.svg",
    banner: "/images/activity/christmas/quest/banners/Beraplug.jpg",
    description:
      "wtf is $plug —» left curve: butt plug shitcoin —» mid curve: migrates honey comb from jeets to chads —» right curve: (3,3) reinforcement protocol",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.plug.sucks/" },
      { label: "X", link: "https://x.com/beraplug" },
      { label: "Discord", link: "https://discord.com/invite/3NcBevpJev" },
      { label: "Docs", link: "https://docs.plug.sucks/" },
    ]
  },
  Bullas: {
    categories: ["GameFi"],
    icon: "/images/activity/christmas/quest/logos/bullas.svg",
    banner: "/images/activity/christmas/quest/banners/Bullas.jpg",
    description: "Bullas on berachain, Backed by 0xhoneyjar",
    missions: {
      view: {
        text: (amount: number) => `Go to the website and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Go"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.bullas.xyz/" },
      { label: "X", link: "https://x.com/TheBullas_" },
      { label: "Discord", link: "https://discord.com/invite/bullas" },
      { label: "Docs", link: "https://bullas.gitbook.io/docs.bullish.com" },
    ]
  },
  Berahome: {
    categories: ["Community"],
    icon: "/images/activity/christmas/quest/logos/berahome.svg",
    banner: "/images/activity/christmas/quest/banners/Berahome.jpg",
    description:
      "小熊之家致力于为中文加密用户播报berachain的前沿资讯及生态项目解读",
    missions: {
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://berahome.org/" },
      { label: "X", link: "https://x.com/0xBeraHome" },
      { label: "Discord", link: "https://discord.com/invite/DfnZwHK4FD" },
      { label: "Docs", link: "https://link3.to/berahome" },
    ]
  },
  Beraland: {
    categories: ["Community", "Infrastructure"],
    icon: "/images/activity/christmas/quest/logos/beraland.svg",
    banner: "/images/activity/christmas/quest/banners/Beraland.jpg",
    description: "The community hub and validator for all things Bera.",
    missions: {
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://app.beraland.xyz" },
      { label: "X", link: "https://x.com/Bera_Land" },
      { label: "Discord", link: "https://discord.gg/beraland" },
      { label: "Docs", link: "https://app.beraland.xyz/dl/Ecosystem" },
    ]
  },
  Bedrock: {
    categories: ["DeFi", "Depin", "Liquidity"],
    icon: "/images/activity/christmas/quest/logos/bedrock.png",
    banner: "/images/activity/christmas/quest/banners/Bedrock.png",
    description: "A liquid restaking pioneer built on babylonlabs_io, eigenlayer & DePin.",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you're an NFTs holder and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift ${amount > 1 ? 'boxes' : 'box'}.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.bedrock.technology/" },
      { label: "X", link: "https://x.com/Bedrock_DeFi" },
      { label: "Discord", link: "https://discord.com/invite/ctXrm6wfeg" },
      { label: "Docs", link: "https://docs.bedrock.technology/" },
    ]
  }
  // 'BeraTown': {
  //   categories: ['Social'],
  //   icon: '/images/activity/christmas/quest/logos/the-honey-jar.svg',
  //   banner: '/images/activity/christmas/quest/banners/The Honey Jar.jpg',
  //   description: '-',
  // },
};

export const DAppQuests: any = {
  Marketplace: {
    missions: ["1 Gift Box for each swap to hot tokens/memecoins"]
  },
  Kodiak: {
    missions: ["1 Gift Box for each swap", "2 Gift Boxes per LP transaction"]
  },
  Bex: {
    missions: ["1 Gift Box for each swap", "2 Gift Boxes per LP transaction"]
  },
  "Ooga Booga": {
    missions: ["1 Gift Box for each swap"]
  },
  Bend: {
    missions: [
      "2 Gift Boxes per deposit transaction",
      "2 Gift Boxes per borrow transaction"
    ]
  },
  Beraborrow: {
    missions: [
      "2 Gift Boxes per deposit transaction",
      "2 Gift Boxes per borrow transaction"
    ]
  },
  Dolomite: {
    missions: [
      "2 Gift Boxes per deposit transaction",
      "2 Gift Boxes per borrow transaction"
    ]
  },
  Infrared: {
    missions: [
      "1 Gift Box per stake transaction to the iBGT vault",
      "2 Gift Box per stake transaction to any vault"
    ]
  },
  Berps: {
    missions: ["2 Gift Boxes per deposit transaction to the $HONEY vault"]
  },
  "Top Validators": {
    missions: [
      "3 Gift Boxes per BGT delegate transaction to THJ or THJ x Beradrome validators"
    ]
  }
};

export const NFTs: any = {
  Beraboyz: {
    icon: "/images/activity/christmas/nft/beraboyz.png"
  },
  yeetards: {
    icon: "/images/activity/christmas/nft/yeetards.png"
  },
  cubhub: {
    icon: "/images/activity/christmas/nft/cubhub.png"
  },
  Bruuvvprint: {
    icon: "/images/activity/christmas/nft/bruuvvprint.png"
  },
  HoneyGenesis: {
    icon: "/images/activity/christmas/nft/honey-genesis.png"
  },
  "Tour de Berance": {
    icon: "/images/activity/christmas/nft/tour-de-berance.png"
  },
  "Smoke and Mirrors": {
    icon: "/images/activity/christmas/nft/smoke-and-mirrors.png"
  },
  Beramonium: {
    icon: "/images/activity/christmas/nft/beramonium.png"
  },
  "Hungry Bera": {
    icon: "/images/activity/christmas/nft/hungrybera.png"
  },
  "Big fat bera": {
    icon: "/images/activity/christmas/nft/big-fat-beras.png"
  },
  Beradeluna: {
    icon: "/images/activity/christmas/nft/beradeluna.png"
  },
  Beradelic: {
    icon: "/images/activity/christmas/nft/beradelic.png"
  },
  SumerMoney: {
    icon: "/images/activity/christmas/nft/sumer-money.png"
  }
};

export const SnowToken = beraB["sfc"];

export const protocols = ["Kodiak"];

export const WinningOdds: Record<string, {dailyAllocation: number; cumulativeAllocation: number; dailyRareRewardProbability: string; display: string;}> = {
  '2024-12-10': {
    dailyAllocation: 3,
    cumulativeAllocation: 3,
    dailyRareRewardProbability: '1%',
    display: '2%',
  },
  '2024-12-11': {
    dailyAllocation: 4,
    cumulativeAllocation: 7,
    dailyRareRewardProbability: '1.2%',
    display: '2.5%',
  },
  '2024-12-12': {
    dailyAllocation: 5,
    cumulativeAllocation: 12,
    dailyRareRewardProbability: '1.5%',
    display: '3%',
  },
  '2024-12-13': {
    dailyAllocation: 6,
    cumulativeAllocation: 18,
    dailyRareRewardProbability: '1.8%',
    display: '3.5%',
  },
  '2024-12-14': {
    dailyAllocation: 7,
    cumulativeAllocation: 25,
    dailyRareRewardProbability: '2.2%',
    display: '4%',
  },
  '2024-12-15': {
    dailyAllocation: 8,
    cumulativeAllocation: 33,
    dailyRareRewardProbability: '2.5%',
    display: '4.5%',
  },
  '2024-12-16': {
    dailyAllocation: 9,
    cumulativeAllocation: 42,
    dailyRareRewardProbability: '2.8%',
    display: '5%',
  },
  '2024-12-17': {
    dailyAllocation: 10,
    cumulativeAllocation: 52,
    dailyRareRewardProbability: '3.1%',
    display: '5.5%',
  },
  '2024-12-18': {
    dailyAllocation: 11,
    cumulativeAllocation: 63,
    dailyRareRewardProbability: '3.4%',
    display: '6%',
  },
  '2024-12-19': {
    dailyAllocation: 12,
    cumulativeAllocation: 75,
    dailyRareRewardProbability: '3.7%',
    display: '6.5%',
  },
  '2024-12-20': {
    dailyAllocation: 13,
    cumulativeAllocation: 88,
    dailyRareRewardProbability: '4%',
    display: '7%',
  },
  '2024-12-21': {
    dailyAllocation: 14,
    cumulativeAllocation: 102,
    dailyRareRewardProbability: '4.3%',
    display: '7.5%',
  },
  '2024-12-22': {
    dailyAllocation: 15,
    cumulativeAllocation: 117,
    dailyRareRewardProbability: '4.6%',
    display: '8%',
  },
  '2024-12-23': {
    dailyAllocation: 16,
    cumulativeAllocation: 133,
    dailyRareRewardProbability: '4.9%',
    display: '8.5%',
  },
  '2024-12-24': {
    dailyAllocation: 37,
    cumulativeAllocation: 170,
    dailyRareRewardProbability: '12%',
    display: '20%',
  },
  '2024-12-25': {
    dailyAllocation: 17,
    cumulativeAllocation: 187,
    dailyRareRewardProbability: '5.2%',
    display: '9%',
  },
  '2024-12-26': {
    dailyAllocation: 18,
    cumulativeAllocation: 205,
    dailyRareRewardProbability: '5.5%',
    display: '9.5%',
  },
  '2024-12-27': {
    dailyAllocation: 19,
    cumulativeAllocation: 224,
    dailyRareRewardProbability: '5.8%',
    display: '10%',
  },
  '2024-12-28': {
    dailyAllocation: 20,
    cumulativeAllocation: 244,
    dailyRareRewardProbability: '6.2%',
    display: '10.5%',
  },
  '2024-12-29': {
    dailyAllocation: 21,
    cumulativeAllocation: 265,
    dailyRareRewardProbability: '6.5%',
    display: '11%',
  },
  '2024-12-30': {
    dailyAllocation: 22,
    cumulativeAllocation: 287,
    dailyRareRewardProbability: '6.8%',
    display: '11.5%',
  },
  '2024-12-31': {
    dailyAllocation: 38,
    cumulativeAllocation: 325,
    dailyRareRewardProbability: '12%',
    display: '20%',
  },
};
