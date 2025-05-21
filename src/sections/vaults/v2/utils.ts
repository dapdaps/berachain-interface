import { getDappLogo, getTokenLogo } from '@/sections/dashboard/utils';
import { DISABLED_DEPOSIT_VAULTS, SPECIAL_VAULTS } from '@/sections/vaults/v2/config';
import Big from 'big.js';
import kodiakConfig from '@/configs/pools/kodiak';
import { bera } from '@/configs/tokens/bera';
import chains from '@/configs/chains';
import { providers } from 'ethers';
import getD2FinanceInfo from '@/sections/vaults/dapps/d2-finance/info';
import { uniqBy } from 'lodash';

export const parseJSONString = (str: any, defaultValue: any = {}) => {
  if (typeof str !== "string") return str || defaultValue;
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export const getCurrentTokenAddress = (item: any, list: any) => {
  let _addr = item.pool_address;
  if (
    item.project?.toLowerCase() === "berapaw" &&
    list.some(
      (it: any) =>
        it.id !== item.id &&
        it.vault_address.toLowerCase() === item.pool_address.toLowerCase()
    )
  ) {
    _addr = item.vault_address;
  }
  if (_addr === "0x0000000000000000000000000000000000000000") {
    _addr = "native";
  }
  return _addr;
};

export const vaultsDataFormatter = async (list: any) => {
  let d2FinanceIdx = -1;
  const _data = list
    // .filter((item: any) => SUPPORTED_PROTOCOLS.includes(item.pool_project))
    .map((item: any, index: number) => {
      for (const disabledDepositVault of DISABLED_DEPOSIT_VAULTS) {
        if (
          disabledDepositVault.project.toLowerCase() === item.project.toLowerCase()
          && disabledDepositVault.pool_project.toLowerCase() === item.pool_project.toLowerCase()
          && disabledDepositVault.pool_address.toLowerCase() === item.pool_address.toLowerCase()
          && disabledDepositVault.vault_address.toLowerCase() === item.vault_address.toLowerCase()
        ) {
          item.depositDisabled = true;
          break;
        }
      }
      item.apr = parseJSONString(item.apr, {});
      item.reward_tokens = parseJSONString(item.reward_tokens, []);
      item.tokens = parseJSONString(item.tokens, []);
      item.extra_data = parseJSONString(item.extra_data, {});
      item.user_reward = item.user_reward || [];
      item.user_stake = item.user_stake || {};

      item.tokens.forEach((token: any) => {
        token.icon = getTokenLogo(token.symbol?.replace(/\s/g, ""));
      });
      item.reward_tokens.forEach((token: any) => {
        token.icon =
          item.project === "BeraBorrow" && item.tokens.length > 1
            ? item.tokens.map((token: any) => getTokenLogo(token.symbol))
            : getTokenLogo(token.symbol);
        token.link = `https://berascan.com/token/${token.address}`;
      });
      item.user_reward.forEach((reward: any) => {
        reward.icon = getTokenLogo(reward.symbol);
        reward.link = `https://berascan.com/token/${reward.address}`;
      });

      const specialVault: any = SPECIAL_VAULTS.find((sp) => {
        return (
          sp.vaultAddress?.toLowerCase() ===
          item.vault_address.toLowerCase() ||
          sp.project?.toLowerCase() === item.project.toLowerCase()
        );
      });
      if (specialVault) {
        for (const key in specialVault) {
          item[key] = specialVault[key];
        }
      }
      item.apy = item.apr.pool || "0";
      let totalApy = Big(item.apy || 0);
      if (item.apr) {
        Object.keys(item.apr)
          .filter((ak) => ak !== "pool")
          .forEach((ak: any) => {
            totalApy = totalApy.plus(Big(item.apr[ak] || 0));
          });
      }
      item.totalApy = totalApy;
      const poolToken = item.tokens?.find((_token: any) => _token.address.toLowerCase() === item.pool_address.toLowerCase());
      item.token = {
        // symbol: item.name,
        address: getCurrentTokenAddress(item, list),
        decimals: poolToken?.decimals || 18
      };
      item.protocol = item.project;
      item.protocolIcon = getDappLogo(item.project);
      item.poolProjectIcon = getDappLogo(item.pool_project);
      item.creatorProtocolIcon = getDappLogo(item.creator_project);
      item.lpProtocol = item.pool_project;
      item.backendId = item.id;
      item.id = item.pool_address;
      item.balance = item.user_stake?.usd;
      item.vaultAddress = item.vault_address;

      if (item.protocol === "Kodiak") {
        item.vaultAddress =
          item.extra_data?.farm ||
          (kodiakConfig.sweetenedIslands as any)[item.pool_address]
            ?.farmAddress;
      }

      if (
        item.pool_project === "Dolomite" &&
        item.tokens?.length === 1 &&
        ["BERA", "WBERA"].includes(item.tokens[0]?.symbol?.toUpperCase())
      ) {
        item.pool_address = "0x0000000000000000000000000000000000000000";
        item.tokens[0] = {
          ...bera.bera,
          address: "0x0000000000000000000000000000000000000000"
        };
        item.token = {
          ...bera.bera
        };
      }

      if (item.protocol === "D2 Finance") {
        d2FinanceIdx = index;
      }

      if (item.pool_project === "Bex") {
        item.id = item.extra_data.pool_id;
      }

      if (item.protocol === "Yeet") {
        const symbols = item.tokens.map((token: any) => token.symbol);
        item.reward_tokens = [
          {
            address: item.pool_address,
            symbol: symbols.join("-"),
            icon: symbols.map((symbol: any) => getTokenLogo(symbol)),
            decimals: 18
          }
        ];
      }

      return item;
    });
  if (d2FinanceIdx !== -1) {
    const rpcUrl = chains[80094].rpcUrls.default.http[0];
    const rpcProvider = new providers.JsonRpcProvider(rpcUrl);
    const d2FinanceInfo = await getD2FinanceInfo({
      provider: rpcProvider,
      address: _data[d2FinanceIdx].vaultAddress
    });
    _data[d2FinanceIdx].extra_data = {
      ...(_data[d2FinanceIdx].extra_data || {}),
      ...d2FinanceInfo
    };
    _data[d2FinanceIdx].token = _data[d2FinanceIdx].tokens[0];
  }
  return _data;
};

export const addIcon2List = (iconList: any, icon: any) => {
  if (iconList.some((_icon: any) => _icon === icon)) {
    return;
  }
  iconList.push(icon);
};

export const addItem2Group = (group: any, item: any) => {
  group.list.push(item);
  group.tvl = Big(group.tvl).plus(Big(item.tvl || 0));
  group.user_stake.amount = Big(group.user_stake?.amount || 0).plus(
    item.user_stake?.amount || 0
  );
  group.user_stake.usd = Big(group.user_stake?.usd || 0).plus(
    item.user_stake?.usd || 0
  );
  if (Big(item.totalApy || 0).lt(Big(group.totalApy[0] || 0))) {
    group.totalApy[0] = item.totalApy;
    group.totalApyList[0] = { apr: item.apr, apy: item.apr.pool };
  }
  if (Big(item.totalApy || 0).gt(Big(group.totalApy[1] || 0))) {
    group.totalApy[1] = item.totalApy;
    group.totalApyList[1] = { apr: item.apr, apy: item.apr.pool };
  }
  group.apr.push(item.apr);
  addIcon2List(group.creatorProtocolIcon, item.creatorProtocolIcon);
  addIcon2List(group.protocolIcon, item.protocolIcon);
  addIcon2List(group.poolProjectIcon, item.poolProjectIcon);
  group.reward_tokens = uniqBy(
    group.reward_tokens.concat(item.reward_tokens),
    "address"
  );
  group.user_reward = group.user_reward.concat(item.user_reward);
  group.balance = Big(group.balance).plus(item.balance || 0);

  item.tokens?.forEach((token: any) => {
    if (
      !group.tokens?.some(
        (_token: any) =>
          _token.address.toLowerCase() === token.address.toLowerCase()
      )
    ) {
      group.tokens.push(token);
    }
  });

  return group;
};

export const generateGroup = (listData: any, defaultGroupList = []) => {
  return listData.reduce((acc: any[], item: any) => {
    const group = acc.find(
      (g: any) => g.pool_address === item.pool_address
    );
    if (group) {
      addItem2Group(group, item);
    } else {
      acc.push({
        pool_address: item.pool_address,
        pool_project: item.pool_project,
        name: item.name,
        tvl: Big(item.tvl || 0),
        user_stake: {
          amount: Big(item.user_stake?.amount || 0),
          usd: Big(item.user_stake?.usd || 0)
        },
        // [min, max]
        totalApy: [item.totalApy, item.totalApy],
        totalApyList: [
          { apr: item.apr, apy: item.apr.pool },
          { apr: item.apr, apy: item.apr.pool }
        ],
        apr: [item.apr],
        creatorProtocolIcon: [item.creatorProtocolIcon],
        protocolIcon: [item.protocolIcon],
        poolProjectIcon: [item.poolProjectIcon],
        tokens: item.tokens,
        reward_tokens: item.reward_tokens || [],
        user_reward: item.user_reward || [],
        balance: Big(item.balance || 0),
        list: [item]
      });
    }
    return acc;
  }, defaultGroupList);
};