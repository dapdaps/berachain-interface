import { NFTItem, Status } from "../types";

export const mockNFTs: NFTItem[] = [
  {
    id: '1',
    title: 'Land NFT by Grand Conquest',
    image: 'https://www.kingdomly.app/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fkingdomly-appv2.appspot.com%2Fo%2Fprojects%252FKQ708jQmfQwfCXjvZZiP%252Fmint_page%252Fcard_img.png%3Falt%3Dmedia%26token%3D1e352460-2a27-478b-858b-78e1d6a1f663&w=1080&q=75',
    href: '/land-nft-by-grand-conquest',
    mintStatus: Status.LIVE,
    price: {
      amount: 0.15,
      currency: 'ETH'
    }
  },
  // ...更多NFT数据
];

// 下面是 list of NFTs 的服务端返回数据结构
/**
 * 
 * {
  "partnerCollections": {
    "live": [
      {
        "collection_name": "Beraboyz",
        "header_image": "https://example.com/image.png",
        "profile_image": "https://example.com/profile.png",
        "description": "BERABOYZ GOT BLOCK ON LOCK",
        "description_RTE": "<p>BERABOYZ GOT BLOCK ON LOCK</p>",
        "total_supply": 1250,
        "mint_live_timestamp": 1729000800000,
        "mint_group_data": [
          {
            "name": "Public",
            "price": 0.025,
            "allocation": 500,
            "max_mint_per_wallet": 10,
            "mint_group_description": "Public mint phase",
            "mint_group_description_RTE": "<p>Public mint phase</p>"
          }
        ],
        "slug": "beraboyz-gg",
        "chain": {
          "chain_id": 42161,
          "chain_name": "Arbitrum One",
          "native_currency": "ETH"
        },
        "contract_address": "0xe6f67000ecc765cb51d9a63d47be94b0cbcba8e2"
      }
    ],
    "upcoming": [
      {
        "collection_name": "Beraboyz",
        "header_image": "https://example.com/image.png",
        "profile_image": "https://example.com/profile.png",
        "description": "BERABOYZ GOT BLOCK ON LOCK",
        "description_RTE": "<p>BERABOYZ GOT BLOCK ON LOCK</p>",
        "total_supply": 1250,
        "mint_live_timestamp": 1729000800000,
        "mint_group_data": [
          {
            "name": "Public",
            "price": 0.025,
            "allocation": 500,
            "max_mint_per_wallet": 10,
            "mint_group_description": "Public mint phase",
            "mint_group_description_RTE": "<p>Public mint phase</p>"
          }
        ],
        "slug": "beraboyz-gg",
        "chain": {
          "chain_id": 42161,
          "chain_name": "Arbitrum One",
          "native_currency": "ETH"
        },
        "contract_address": "0xe6f67000ecc765cb51d9a63d47be94b0cbcba8e2"
      }
    ],
    "sold_out": [
      {
        "collection_name": "Beraboyz",
        "header_image": "https://example.com/image.png",
        "profile_image": "https://example.com/profile.png",
        "description": "BERABOYZ GOT BLOCK ON LOCK",
        "description_RTE": "<p>BERABOYZ GOT BLOCK ON LOCK</p>",
        "total_supply": 1250,
        "mint_live_timestamp": 1729000800000,
        "mint_group_data": [
          {
            "name": "Public",
            "price": 0.025,
            "allocation": 500,
            "max_mint_per_wallet": 10,
            "mint_group_description": "Public mint phase",
            "mint_group_description_RTE": "<p>Public mint phase</p>"
          }
        ],
        "slug": "beraboyz-gg",
        "chain": {
          "chain_id": 42161,
          "chain_name": "Arbitrum One",
          "native_currency": "ETH"
        },
        "contract_address": "0xe6f67000ecc765cb51d9a63d47be94b0cbcba8e2"
      }
    ]
  },
  "partners_results": 35
}
 * 
 */
