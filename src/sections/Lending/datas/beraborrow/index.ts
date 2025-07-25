import axios from "axios";
import Big from "big.js";
import { Contract, ethers, utils } from "ethers";
import { useEffect } from "react";
import multicallAddresses from "@/configs/contract/multicall";
import { multicall } from "@/utils/multicall";

import { numberFormatter, numberRemoveEndZero } from "@/utils/number-formatter";
import { Den, UserDen, UserDenStatus, SCALING_FACTOR as SCALING_FACTOR_DEN, DenStatusWithGoldsky } from "./den";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    type: "function",
    name: "fetchPrice",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  }
];

export const DEN_ABI = [
  {
    type: "function",
    name: "getTotalActiveCollateral",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getTotalActiveDebt",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getEntireDebtAndColl",
    inputs: [
      {
        internalType: "address",
        name: "_borrower",
        type: "address"
      }
    ],
    outputs: [
      {
        internalType: "uint256",
        name: "debt",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "coll",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "pendingDebtReward",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "pendingCollateralReward",
        type: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getDenStatus",
    inputs: [
      {
        internalType: "address",
        name: "_borrower",
        type: "address"
      }
    ],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getEntireSystemBalances",
    inputs: [],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "MCR",
    inputs: [],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "CCR",
    inputs: [],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getBorrowingRate",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  }
];
const BERABORROW_CORE_ABI = [
  {
    "inputs": [],
    "name": "CCR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const APY_ABI = [
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [
      { name: "amountInAsset", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  }
];

const DEN_MANAGER_GETTERS_ABI = [
  {
    inputs: [],
    name: "getAllCollateralsAndDenManagers",
    outputs: [
      {
        components: [
          { internalType: "address", name: "collateral", type: "address" },
          { internalType: "address[]", name: "denManagers", type: "address[]" }
        ],
        internalType: "struct DenManagerGetters.Collateral[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const calcTCR = (collateral: any, debt: any, price: any) => {
  if (!collateral || Big(collateral).lte(0)) return 0;
  if (!debt || Big(debt).lte(0)) return 0;
  return Big(collateral)
    .times(price || 1)
    .div(debt)
    .times(100)
    .toFixed(0);
};

const SCALING_FACTOR = Big(1000000000000000000);

/**
 * Get APY.
 * r = T / t * ln(Q'/Q)
 * r: APY
 * T: 1 year
 * t: 1 week
 * Q: Initial share price
 * Q`: Current share price
 * @param currentBlockNumber CurrentBlock Number
 * @param startBlock The deployment block of the vault
 * @param contractAddress the vault address
 * @param averageBlockTime average block times
 * @param multicallAddress multicall address
 * @returns returns apy percentage with 18 decimals so SCALING_FACTOR 100%
 */
const getAPY = async (
  currentBlockNumber: number,
  startBlock: number,
  contractAddress: any,
  averageBlockTime = 2,
  multicallAddress: string,
  multicall: any,
  provider: any
) => {
  const BLOCKS_IN_WEEK = (7 * 24 * 60 * 60) / averageBlockTime;
  // const blockNumberOneWeekAgo = currentBlockNumber - BigInt(BLOCKS_IN_WEEK) < BigInt(startBlock) ? BigInt(startBlock) : currentBlockNumber - BigInt(BLOCKS_IN_WEEK);
  const blockNumberOneWeekAgo = Big(currentBlockNumber)
    .minus(
      Big(BLOCKS_IN_WEEK).lt(startBlock)
        ? startBlock
        : Big(currentBlockNumber).minus(BLOCKS_IN_WEEK)
    )
    .toNumber();

  const calls = [
    {
      address: contractAddress,
      name: "totalSupply",
      params: []
    },
    {
      address: contractAddress,
      name: "totalAssets",
      params: []
    }
  ];

  let [
    blockOneWeekAgo,
    [[currentTotalSupply], [currentTVL]],
    [[oneWeekAgoTotalSupply], [oneWeekAgoTVL]]
  ] = await Promise.all([
    provider.getBlock(blockNumberOneWeekAgo),
    multicall({
      abi: APY_ABI,
      calls: calls,
      options: {},
      multicallAddress,
      provider: provider
    }),
    multicall({
      abi: APY_ABI,
      calls: calls,
      options: {
        blockTag: blockNumberOneWeekAgo
      },
      multicallAddress,
      provider: provider
    })
  ]);

  currentTotalSupply = utils.formatUnits(currentTotalSupply, 18);
  currentTVL = utils.formatUnits(currentTVL, 18);
  oneWeekAgoTotalSupply = utils.formatUnits(oneWeekAgoTotalSupply, 18);
  oneWeekAgoTVL = utils.formatUnits(oneWeekAgoTVL, 18);

  // const realOneWeekAgo = Date.now() / 1000 - Number(blockOneWeekAgo.timestamp);
  const realOneWeekAgo = Date.now() / 1000 - Number(blockOneWeekAgo.timestamp);
  // const sharePriceOneWeekAgo = oneWeekAgoTotalSupply == 0n ? 0n : (oneWeekAgoTVL * SCALING_FACTOR) / oneWeekAgoTotalSupply;
  const sharePriceOneWeekAgo = Big(oneWeekAgoTotalSupply).eq(0)
    ? Big(0)
    : Big(Big(oneWeekAgoTVL).times(SCALING_FACTOR)).div(oneWeekAgoTotalSupply);
  // const sharePriceNow = currentTotalSupply == 0n ? 0n : (currentTVL * SCALING_FACTOR) / currentTotalSupply;
  const sharePriceNow = Big(currentTotalSupply).eq(0)
    ? Big(0)
    : Big(Big(currentTVL).times(SCALING_FACTOR)).div(currentTotalSupply);
  const SECONDS_IN_YEAR = Big(31536000);
  // const apy = sharePriceOneWeekAgo == 0n ? 0 : (SECONDS_IN_YEAR / realOneWeekAgo) * Math.log(Number(sharePriceNow) / Number(sharePriceOneWeekAgo));
  const apy = Big(sharePriceOneWeekAgo).eq(0)
    ? 0
    : Big(Big(SECONDS_IN_YEAR).div(realOneWeekAgo)).times(
      Math.log(Big(sharePriceNow).div(sharePriceOneWeekAgo).toNumber())
    );

  // return BigInt((apy * Number(SCALING_FACTOR)).toFixed(0));
  return Big(apy).times(SCALING_FACTOR).toFixed(0);
};

const BeraborrowData = (props: any) => {
  const {
    onLoad,
    markets,
    graphApi,
    denManagersParams,
    priceParams,
    borrowParams,
    prices,
    riskyRatio,
    account,
    update,
    provider,
    chainId,
    borrowToken,
    beraborrowCore,
    denManagerGetters
  } = props;

  const multicallAddress = multicallAddresses[chainId];

  useEffect(() => {
    if (!update || !account || !provider) return;
    const handleGetDenManager = (market: any) => {
      return new Promise((resolve) => {
        axios
          .post(graphApi, denManagersParams(market))
          .then((denManagersRes) => {
            const { denManager = null } = denManagersRes?.data?.data || {};
            resolve({
              id: market.id,
              collVault: market.collVault,
              symbol: market.symbol,
              interestRate: Big(denManager?.interestRate ?? "0")
                .div(100)
                .toFixed()
            });
          })
          .catch((err: any) => {
            resolve([]);
            console.log("getDenManagers failure: %o", err);
          });
      });
    };
    const getDenManagers = () => {
      const promiseArray: any = [];
      markets.forEach((market: any) => {
        promiseArray.push(handleGetDenManager(market));
      });

      try {
        return Promise.all(promiseArray);
      } catch (err) {
        console.log("getDenManagers failure: %o", err);
      }
      return [];
      // return new Promise((resolve) => {
      //   axios
      //     .post(graphApi, denManagersParams(markets))
      //     .then((denManagersRes) => {
      //       const { denManagers = [] } = denManagersRes?.data?.data || {};
      //       const result = markets.map((m: any) => {
      //         const obj: any = {
      //           id: m.id,
      //           collVault: m.collVault,
      //           symbol: m.symbol,
      //           price: prices?.[m.symbol] || '0',
      //           interestRate: '0',
      //         };
      //         const curr = denManagers.find((d: any) => {
      //           return d.collateral.id.toLowerCase() === obj.collVault.toLowerCase();
      //         });
      //         if (!curr) return obj;
      //         obj.price = utils.formatUnits(curr.collateral.price.price, 36 - curr.collateral.decimals);
      //         obj.interestRate = Big(curr.interestRate || 0).div(100).toString();
      //         return obj;
      //       });
      //       resolve(result);
      //     })
      //     .catch((err: any) => {
      //       resolve([]);
      //       console.log('getDenManagers failure: %o', err);
      //     });
      // });
    };

    const getNectPrice = () => {
      return new Promise((resolve) => {
        axios
          .post(graphApi, priceParams([borrowToken]))
          .then((priceRes) => {
            const { tokens } = priceRes?.data?.data || {};
            const nextPrice = tokens?.[0]?.price?.price;
            // resolve(utils.formatUnits(nextPrice, 36 - borrowToken.decimals));
            console.log(
              "NectPrice is %o",
              utils.formatUnits(nextPrice, 36 - borrowToken.decimals)
            );
            resolve({
              price: "1",
              realPrice: utils.formatUnits(nextPrice, 36 - borrowToken.decimals)
            });
          })
          .catch((err: any) => {
            resolve({ price: "1", realPrice: "1" });
            console.log("get Nect Price failure: %o", err);
          });
      });
    };

    const getPrices = () => {
      return new Promise((resolve) => {
        const result: any = [];
        const calls: any = [];
        markets.forEach((token: any) => {
          calls.push({
            address: token.denManager,
            name: "fetchPrice",
            params: []
          });
        });
        multicall({
          abi: ERC20_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then((res: any) => {
            markets.forEach((token: any, index: number) => {
              let denManagerPrice = res?.[index]?.[0] ?? "0";
              denManagerPrice = utils.formatUnits(
                denManagerPrice,
                36 - token.decimals
              );
              result.push({
                id: token.id,
                price: denManagerPrice
              });
            });
            resolve(result);
          })
          .catch((err: any) => {
            console.log("getPrices error", err);
            resolve(result);
          });
      });
    };

    const getBorrows = () => {
      return new Promise((resolve) => {
        axios
          .post(graphApi, borrowParams(account))
          .then((borrowsRes) => {
            const { user = {} } = borrowsRes?.data?.data || {};
            const result = markets.map((m: any) => {
              const obj: any = {
                id: m.id,
                address: m.address,
                collVault: m.collVault,
                symbol: m.symbol,
                decimals: m.decimals,
                collToken: m.collToken,
                collateral: "0",
                debt: "0",
                status: ""
              };
              const curr = user?.dens?.find((d: any) => {
                return (
                  d.denManager?.collateral?.id.toLowerCase() ===
                  obj.collVault.toLowerCase()
                );
              });

              if (!curr) return obj;
              obj.collateral = ethers.utils.formatUnits(curr.collateral);
              obj.debt = ethers.utils.formatUnits(curr.debt);
              obj.status = curr.status;
              return obj;
            });
            resolve(result);
          })
          .catch((err: any) => {
            resolve([]);
            console.log("getBorrows failure: %o", err);
          });
      });
    };

    const getWalletBalance = () => {
      const result: any = {};
      return new Promise((resolve) => {
        let nativeOToken = "";
        const tokenList: any = markets.filter((market: any) => {
          if (market.isNative) nativeOToken = market.address;
          return market.address && !market.isNative;
        });
        const calls = tokenList.map((token: any) => ({
          address: token.address,
          name: "balanceOf",
          params: [account]
        }));
        multicall({
          abi: ERC20_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then((res: any) => {
            for (let i = 0; i < res.length; i++) {
              result[tokenList[i].address.toLowerCase()] =
                res[i] && res[i][0]
                  ? ethers.utils.formatUnits(
                    res[i][0]._hex,
                    tokenList[i].decimals
                  )
                  : "0";
            }
            if (nativeOToken) {
              provider.getBalance(account).then((rawBalance: any) => {
                result[nativeOToken.toLowerCase()] = ethers.utils.formatUnits(
                  rawBalance._hex,
                  18
                );
                resolve(result);
              });
              return;
            }
            resolve(result);
          })
          .catch((err: any) => {
            console.log("getWalletBalance error", err);
            resolve(result);
          });
      });
    };

    const getBorrowWalletBalance = () => {
      const contract = new ethers.Contract(
        borrowToken.address,
        ERC20_ABI,
        provider
      );
      return new Promise((resolve) => {
        contract
          .balanceOf(account)
          .then((balance: any) => {
            resolve(utils.formatUnits(balance || "0", borrowToken.decimals));
          })
          .catch((err: any) => {
            console.log("getBorrowWalletBalance failure: %o", err);
            resolve("0");
          });
      });
    };

    const getTCR = () => {
      return new Promise((resolve) => {
        const result: any = [];
        const calls: any = [];
        markets.forEach((token: any) => {
          calls.push({
            address: token.denManager,
            name: "getTotalActiveCollateral",
            params: []
          });
          calls.push({
            address: token.denManager,
            name: "getTotalActiveDebt",
            params: []
          });
        });
        multicall({
          abi: DEN_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then((res: any) => {
            markets.forEach((token: any, index: number) => {
              let totalCollateral = res?.[index * 2]?.[0] ?? "0";
              let totalDebt = res?.[index * 2 + 1]?.[0] ?? "0";
              totalCollateral = utils.formatUnits(totalCollateral, 18);
              totalDebt = utils.formatUnits(totalDebt, 18);
              result.push({
                id: token.id,
                totalCollateral: totalCollateral,
                totalDebt: totalDebt
              });
            });
            resolve(result);
          })
          .catch((err: any) => {
            console.log("getPrices error", err);
            resolve(result);
          });
      });
    };

    const getNectData = () => {
      const result: any = {};

      return new Promise((resolve) => {
        const calls = [
          {
            address: borrowToken?.earnToken?.address,
            name: "balanceOf",
            params: [account]
          }
        ];
        multicall({
          abi: ERC20_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then(async (res: any) => {
            let balance = res?.[0]?.[0] ?? "0";
            balance = utils.formatUnits(balance || "0", borrowToken.decimals);
            result.balance = balance;

            const currentBlockNumber = await provider.getBlock();
            // const apy = await getAPY(
            //   currentBlockNumber.number,
            //   2867937,
            //   '0x597877Ccf65be938BD214C4c46907669e3E62128',
            //   2,
            //   multicallAddress,
            //   multicall,
            //   provider,
            // );
            // result.apy = Big(apy).div(Math.pow(10, 18)).toFixed(2) + '%';

            resolve(result);
          })
          .catch((err: any) => {
            console.log("getNectData error", err);
            resolve(result);
          });
      });
    };

    const getDenDetails = async () => {
      let denDetailsRes: any;
      const result: any = [];
      const calls: any = [];
      // 0 - getEntireDebtAndColl
      // 1 - getDenStatus
      // 2 - getEntireSystemBalances
      // 3 - MCR
      // 4 - CCR
      markets.forEach((token: any) => {
        calls.push({
          address: token.denManager,
          name: "getEntireDebtAndColl",
          params: [account]
        });
        calls.push({
          address: token.denManager,
          name: "getDenStatus",
          params: [account]
        });
        calls.push({
          address: token.denManager,
          name: "getEntireSystemBalances",
          params: []
        });
        calls.push({
          address: token.denManager,
          name: "MCR",
          params: []
        });
        calls.push({
          address: beraborrowCore,
          name: "CCR",
          params: []
        });
        calls.push({
          address: token.denManager,
          name: "getBorrowingRate",
          params: []
        });
      });
      try {
        denDetailsRes = await multicall({
          abi: [...DEN_ABI, ...BERABORROW_CORE_ABI],
          calls,
          options: {},
          multicallAddress,
          provider: provider
        });
        markets.forEach((token: any, index: number) => {
          let EntireDebtAndColl = denDetailsRes?.[index * 5 + index] ?? [];
          let DenStatus = denDetailsRes?.[index * 5 + 1 + index]?.[0] ?? "";
          let EntireSystemBalances = denDetailsRes?.[index * 5 + 2 + index] ?? [];
          DenStatus = DenStatus ? Number(DenStatus.toString()) : 0;
          let MCR = denDetailsRes?.[index * 5 + 3 + index]?.[0] ?? "0";
          let CCR = denDetailsRes?.[index * 5 + 4 + index]?.[0] ?? "0";
          MCR = utils.formatUnits(MCR, 18);
          CCR = utils.formatUnits(CCR, 18);

          let [debt = "0", coll = "0"] = EntireDebtAndColl;
          let [totalColl = "0", totalDebt = "0", price = "0"] = EntireSystemBalances;
          const densTotal = new Den(BigInt(totalColl.toString()), BigInt(totalDebt.toString()));
          const den = DenStatus === UserDenStatus.active
            ? new UserDen(account, UserDenStatus[DenStatus], BigInt(coll.toString()), BigInt(debt.toString()))
            : new UserDen(account, UserDenStatus[DenStatus]);

          let BorrowingRate = denDetailsRes?.[index * 5 + 5 + index]?.[0] ?? "0";
          BorrowingRate = utils.formatUnits(BorrowingRate, 18);

          result.push({
            id: token.id,
            MCR: Big(MCR).times(100).toFixed(0),
            CCR: Big(CCR).times(100).toFixed(0),
            denStatus: DenStatus,
            densTotal,
            den,
            borrowingRate: BorrowingRate,
          });
        });
      } catch (err: any) {
        console.log("getDenDetails failed: %o", err);
      }
      return result;
    };

    // const getDenManagerGetters = async () => {
    //   const contract = new Contract(denManagerGetters, DEN_MANAGER_GETTERS_ABI, provider);
    //   const res = await contract.getAllCollateralsAndDenManagers();
    //   return res.map((item: any, index: number) => ({
    //     index,
    //     collateral: item.collateral,
    //     denManagers: item.denManagers,
    //   }));
    // };

    const getVaults = async () => {
      try {
        const res = await axios.get("https://api.beraborrow.com/v1/vaults");
        if (res.status !== 200 || !res.data) {
          return [];
        }
        return res.data;
      } catch (err: any) {
        console.log("getVaults failed: %o", err);
      }
      return [];
    };

    const getCTokensData = async () => {
      try {
        const [
          DenManagers,
          Prices,
          // Borrows,
          WalletBalance,
          BorrowWalletBalance,
          TCRs,
          NECTPrice,
          NECTData,
          DenDetails,
          vaultsList
        ]: any = await Promise.all([
          getDenManagers(),
          getPrices(),
          // getBorrows(),
          getWalletBalance(),
          getBorrowWalletBalance(),
          getTCR(),
          getNectPrice(),
          getNectData(),
          getDenDetails(),
          getVaults()
        ]);
        let borrowTokenRes: any = borrowToken;
        const result = markets.map((market: any) => {
          let _address = market.address.toLowerCase();
          // if (market.isNative && wrappedToken) {
          //   _address = wrappedToken.address.toLowerCase();
          // }

          const currPrice = Prices.find((b: any) => b.id === market.id);
          const currDenManager = DenManagers?.find(
            (b: any) => b.id === market.id
          );
          const currTCR = TCRs.find((b: any) => b.id === market.id);
          const currWalletBalance = WalletBalance[_address];
         
          const TCR = calcTCR(
            currTCR?.totalCollateral,
            currTCR?.totalDebt,
            currPrice?.price
          );

          const denDetails = DenDetails.find((b: any) => b.id === market.id);
          let currentDebt = denDetails?.den?.debt;
          let currentColl = denDetails?.den?.collateral;
          currentDebt = Big(currentDebt.toString()).div(SCALING_FACTOR_DEN.toString()).toString();
          currentColl = Big(currentColl.toString()).div(SCALING_FACTOR_DEN.toString()).toString();

          let liquidationPrice = Big(0);
          if (Big(currentColl || 0).gt(0)) {
            liquidationPrice = Big(currentDebt || 0)
              .times(Big(parseFloat(market.MCR)).div(100))
              .div(currentColl);
          }
          const balanceUsd = Big(currentColl || 0).times(
            currPrice?.price || 0
          );

          let collateralRatio = Big(0);
          if (Big(currentDebt || 0).gt(0)) {
            collateralRatio = Big(balanceUsd).div(currentDebt).times(100);
          }

          borrowTokenRes = {
            ...borrowToken,
            price: NECTPrice.price,
            priceShow: numberFormatter(NECTPrice.price, 2, true),
            realPrice: NECTPrice.realPrice,
            realPriceShow: numberFormatter(NECTPrice.realPrice, 2, true),
            walletBalance: BorrowWalletBalance,
            walletBalanceShown: numberFormatter(BorrowWalletBalance, 2, true),
            balance: NECTData?.balance || "0",
            balanceShown: numberFormatter(NECTData?.balance, 2, true),
            apy: NECTData?.apy || "0.00%"
          };

          const currentVault = vaultsList.find((_vault: any) => _vault.vaultAddress.toLowerCase() === market.collVault.toLowerCase());

          // Underlying Amount = price * currentColl / collPrice
          const underlyingBalance = numberRemoveEndZero(Big(currPrice?.price || 0).times(currentColl || 0).div(currentVault?.collPrice || 1).toFixed(market.decimals));

          return {
            ...market,
            riskyRatio,
            TCR,
            MCR: denDetails?.MCR,
            CCR: denDetails?.CCR,
            denStatus: denDetails?.denStatus,
            densTotal: denDetails?.densTotal,
            den: denDetails?.den,
            borrowingRate: denDetails?.borrowingRate,
            borrowToken: borrowTokenRes,
            status: DenStatusWithGoldsky[denDetails?.denStatus],
            balance: currentColl,
            underlyingBalance: underlyingBalance,
            balanceUsd: balanceUsd.toFixed(2),
            balanceShown: numberFormatter(currentColl, 2, true),
            balanceUsdShown: numberFormatter(balanceUsd, 2, true, {
              prefix: "$"
            }),
            borrowed: currentDebt,
            borrowedShown: numberFormatter(currentDebt, 2, true),
            walletBalance: currWalletBalance,
            walletBalanceShown: numberFormatter(currWalletBalance, 2, true),
            price: currPrice?.price,
            collPrice: currentVault?.collPrice,
            vaultApy: currentVault?.apy,
            vaultTvl: currentVault?.tvl,
            priceShown: numberFormatter(currPrice?.price, 2, true, {
              prefix: "$"
            }),
            interestRate: currDenManager?.interestRate,
            interestRateShown: currDenManager?.interestRate + "%",
            apy: "100",
            apyShown: "100%",
            liquidationPrice: liquidationPrice.toFixed(2),
            liquidationPriceShown: numberFormatter(liquidationPrice, 2, true, {
              prefix: "$"
            }),
            collateralRatio: collateralRatio,
            collateralRatioShown:
              numberFormatter(collateralRatio, 2, true) + "%",
            collateralRatioRisk: Big(collateralRatio).lt(riskyRatio)
              ? "HighRisk"
              : "LowRisk"
          };
        });

        onLoad({
          borrowToken: borrowTokenRes,
          markets: result
        });
      } catch (error) {
        console.log("getCTokensData error", error);
      }
    };
    getCTokensData();
  }, [update, account, provider]);

  return null;
};

export default BeraborrowData;
