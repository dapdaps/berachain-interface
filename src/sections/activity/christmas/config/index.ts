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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Go to the website and get ${amount} gift boxes.`,
        action: "Go"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
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
        text: (amount: number) => `Mint NFTs and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://ramen.finance/" },
      { label: "X", link: "https://twitter.com/ramen_finance" },
      { label: "Discord", link: "discord.gg/ramenfinance" },
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Claim $BERA from the faucet in BeraSig Wallet and get ${amount} gift boxes.`,
        action: "Claim"
      },
      wallet2: {
        text: (amount: number) => `Swap $BERA to STGUSDC in BeraSig Wallet and get ${amount} gift boxes.`,
        action: "Swap"
      },
      wallet3: {
        text: (amount: number) => `Mint $Honey in BeraSig Wallet and get ${amount} gift boxes.`,
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://www.yeetit.xyz/" },
      { label: "X", link: "https://twitter.com/eatsleepyeet" },
      { label: "Discord", link: "discord.gg/yeetards" },
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://honeypotfinance.xyz/" },
      { label: "X", link: "https://twitter.com/honeypotfinance" },
      { label: "Discord", link: "discord.gg/honeypotfi" },
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
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "eden.sexualfi.com" },
      { label: "X", link: "https://x.com/EdenWeb3_Global" },
      { label: "Discord", link: "https://discord.com/invite/edenweb3" },
      { label: "Docs", link: "eden.sexualfi.com" },
    ]
  },
  Puffpaw: {
    categories: ["GameFi", "RWA", "DePin"],
    icon: "/images/activity/christmas/quest/logos/puffpaw.svg",
    banner: "/images/activity/christmas/quest/banners/Puffpaw.jpg",
    description: "Vape 2 quit smoking and earn",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://memeswap.fi/" },
      { label: "X", link: "https://twitter.com/memeswapfi" },
      { label: "Discord", link: "discord.gg/gxTzq3WYa8" },
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "https://bartio.beradrome.com/" },
      { label: "X", link: "https://twitter.com/beradrome" },
      { label: "Discord", link: "discord.beradrome.com" },
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
    banner: "/images/activity/christmas/quest/banners/Bakeland.jpg",
    description: "turning crypto into a P2E metaRPG",
    missions: {
      token_balance: {
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Verify if you are a holder of NFT and get ${amount} gift boxes.`,
        action: "Verify"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Go to the website and get ${amount} gift boxes.`,
        action: "Go"
      },
      learn: {
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
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
        text: (amount: number) => `Learn about us and get ${amount} gift box.`,
        action: "Learn"
      }
    },
    socials: [
      { label: "Website", link: "app.beraland.xyz" },
      { label: "X", link: "https://x.com/Bera_Land" },
      { label: "Discord", link: "https://discord.gg/beraland" },
      { label: "Docs", link: "https://app.beraland.xyz/dl/Ecosystem" },
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
    missions: ["1 Gift Box for each swap", "2 Gift Boxes for each LP deposit"]
  },
  Bex: {
    missions: ["1 Gift Box for each swap", "2 Gift Boxes for each LP deposit"]
  },
  "Ooga Booga": {
    missions: ["1 Gift Box for each swap"]
  },
  Bend: {
    missions: [
      "2 Gift Boxes for each tokens deposit",
      "2 Gift Boxes for each tokens borrowing"
    ]
  },
  Beraborrow: {
    missions: [
      "2 Gift Boxes for each tokens deposit",
      "2 Gift Boxes for each tokens borrowing"
    ]
  },
  Dolomite: {
    missions: [
      "2 Gift Boxes for each tokens deposit",
      "2 Gift Boxes for each tokens borrowing"
    ]
  },
  Infrared: {
    missions: [
      "1 Gift Box for staking iBGT to the iBGT vault",
      "2 Gift Box for staking assets to any vault"
    ]
  },
  Berps: {
    missions: ["2 Gift Boxes for depositing $HONEY to the vault"]
  },
  "Top Validators": {
    missions: [
      "3 boxes for each 5 BGT delegated to the THJ validator or the Beradrome x THJ validator"
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
