import { useCallback } from "react";
import { getSignature } from "@/utils/signature";
import chains from "@/configs/chains";
import useAccount from "./use-account";
import { useWalletName } from "@/hooks/use-wallet-name";
import { getReportTokenSymbol } from "@/utils/token/symbol";
import { post } from "@/utils/http";


// 
export default function useAddAction(source: string, isNear = false) {
  const { account, chainId } = useAccount();
  const { name: walletName } = useWalletName();

  const addAction = useCallback(
    (data: any) => {
      let params: any = {};
      
      if (!isNear && (!chainId || !account) ) return;

      const currentChain = chains[chainId];

      if (!currentChain) return;

      console.info("addAction data: ", data);

      if (data.type === "Swap" && data.template !== "launchpad") {
        params = {
          // action_title: `Swap ${Number(data.inputCurrencyAmount)} ${data.inputCurrency.symbol} on ${data.template}`,
          action_title: `Swap ${data.inputCurrency.symbol} on ${data.template}`,
          action_type: "Swap",
          action_tokens: JSON.stringify([
            `${getReportTokenSymbol(data.inputCurrency)}`,
            `${getReportTokenSymbol(data.outputCurrency)}`
          ]),
          action_amount: data?.inputCurrencyAmount
            ? data?.inputCurrencyAmount.toString()
            : '',
          account_id: data.account_id || account,
          template: data.template,
          tx_id: data.transactionHash,
          chain_id: data.chainId || chainId,
          token_in_currency: data?.token_in_currency,
          token_out_currency: data?.token_out_currency,
          extra_data: data?.extra_data
            ? JSON.stringify(data?.extra_data)
            : null,
          sub_type: data.sub_type
        };
      }
      if (data.type === "Bridge") {
        try {
          const toChain = chains[data.toChainId] || {
            name: "Ethereum Mainnet"
          };
          params = {
            action_title: `Bridge ${data.amount} ${data.token.symbol} to ${toChain?.name}`,
            action_type: "Bridge",
            action_tokens: JSON.stringify([`${data.token.symbol}`]),
            action_amount: data.amount,
            account_id: data.account_id || account,
            template: data.template,
            tx_id: data.transactionHash,
            chain_id: data.fromChainId,
            to_chain_id: data.toChainId,
            extra_data: JSON.stringify(data.extra_data),
            sub_type: data.sub_type
          };
        } catch (error) {
          console.info("bridge err", error);
        }
      }
      if (data.type === "Lending") {
        params = {
          action_type: 'Lending',
          account_id: data.account_id || account,
          template: data.template,
          sub_type: data.action === "Deposit" ? "Supply" : data.action,
          tx_id: data.transactionHash,
          chain_id: chainId
        };

        if (data.extra_data?.lending_actions) {
          params.extra_data = JSON.stringify(data.extra_data);
        } else {
          params.action_title = `${data.action} ${Number(data.amount).toFixed(
            3
          )} ${data.token.symbol} on ${data.template}`;
          params.action_tokens = JSON.stringify([`${data.token.symbol}`]);
          params.action_amount = data.amount;
        }
      }
      if (data.type === "Liquidity") {
        const symbols = data.tokens.map((token: any) => token.symbol);

        if (data.extra_data) {
          data.tokens.forEach((token: any, i: number) => {
            data.extra_data[`token${i}Symbol`] = getReportTokenSymbol(token);
            data.extra_data[`amount${i}`] = data.amounts[i];
          });
        }
        params = {
          action_title: `${data.action} ${symbols.join("-")} on ${
            data.template
          }`,
          action_type: data.type,
          action_tokens: JSON.stringify(symbols),
          action_amount: data.amount,
          account_id: data.account_id || account,
          template: data.template,
          tx_id: data.transactionHash,
          chain_id: chainId,
          extra_data: data.extra_data ? JSON.stringify(data.extra_data) : null,
          sub_type: data.sub_type
        };
      }
      if (data.type === "Staking") {
        const symbols = data.tokens.map((token: any) => token.symbol);

        if (data.extra_data) {
          data.tokens.forEach((token: any, i: number) => {
            data.extra_data[`token${i}Symbol`] = getReportTokenSymbol(token);
            data.extra_data[`amount${i}`] = data.amounts[i];
          });
        }
        params = {
          action_title: !!symbols.length
            ? `${data.action} ${data.amount} ${symbols.join("-")} on ${
                data.template
              }`
            : "",
          action_type: "Staking",
          action_tokens: !!symbols.length
            ? JSON.stringify([`${symbols.join("-")}`])
            : "",
          action_amount: data.amount,
          account_id: data.account_id || account,
          template: data.template,
          chain_id: data.chainId || chainId,
          action_switch: data.add ? 1 : 0,
          action_status: data.status === 1 ? "Success" : "Failed",
          tx_id: data.transactionHash,
          action_network_id: currentChain?.name || data.action_network_id,
          extra_data: data.extra_data ? JSON.stringify(data.extra_data) : null,
          sub_type: data.sub_type
        };
      }

      if (data.type === "Delegate") {
        params = {
          action_title: data.token
            ? `${data.action} ${data.amount} ${data.symbol} on ${data.template}`
            : "",
          action_type: data.type,
          action_tokens: JSON.stringify([data.symbol]),
          action_amount: data.amount,
          account_id: data.account_id || account,
          template: data.template,
          tx_id: data.transactionHash,
          chain_id: chainId,
          extra_data: data.extra_data,
          sub_type: data.sub_type
        };
      }

      if (data.type === "Yield") {
        params = {
          action_title: `${data.action} ${
            data?.token0 + (data?.token1 ? "-" + data.token1 : "")
          } on ${data.template}`,
          action_type: data.type,
          action_tokens: JSON.stringify([
            data?.token0 ?? "",
            data?.token1 ?? ""
          ]),
          action_amount: data.amount,
          account_id: data.account_id || account,
          template: data.template,
          tx_id: data.transactionHash,
          chain_id: chainId,
          extra_data: data.extra_data,
          sub_type: data.sub_type
        };
      }

      if (data.template === "launchpad" || data.template === "Launchpad") {
        params = {
          action_title: `Launchpad ${
            data?.token0.symbol +
            (data?.token1.symbol ? "-" + data.token1.symbol : "")
          } on ${data.template}`,
          action_type: "Swap",
          action_tokens: JSON.stringify([
            data?.token0.symbol ?? "",
            data?.token1.symbol ?? ""
          ]),
          action_amount: data.amount,
          account_id: data.account_id || account,
          template: data.template,
          tx_id: data.transactionHash,
          chain_id: chainId,
          pool: data.pool,
          extra_data: JSON.stringify({
            token0: data?.token0,
            token1: data?.token1,
            type: "Swap",
            trade_type: data.trade_type,
            shareTokenPrice: data.shareTokenPrice,
            pool: data.pool
          }),
          sub_type: data.sub_type
        };
      }

      if (data.type === "NFT") {
        params = {
          action_title: `${data.action} ${data.name} NFT on ${data.template}`,
          action_type: "NFT",
          action_tokens: JSON.stringify([`${data.name}`]),
          action_amount: data.price.toString(),
          account_id: data.account_id || account,
          template: data.template,
          tx_id: data.transactionHash,
          chain_id: chainId,
          sub_type: data.action  // 'mint' | 'list' | 'delist' | 'transfer' | 'burn'
        };
      }

      params.ss = getSignature(
        `template=${data.template}&action_type=${data.type}&tx_hash=${data.transactionHash
        }&chain_id=${data.chainId || chainId}&time=${Math.ceil(Date.now() / 1000)}`
      );
      params.source = source;
      params.wallet = walletName;

      post("/api/action/add", params);
    },
    [chainId, account]
  );

  return { addAction };
}
