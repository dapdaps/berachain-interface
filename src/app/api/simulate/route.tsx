import { createClient } from "@supabase/supabase-js";
import { http, createConfig } from "@wagmi/core";
import {
  sepolia,
  mainnet,
  arbitrumSepolia,
  arbitrum,
  baseSepolia,
  base,
} from "@wagmi/core/chains";
import { prepareTransactionRequest } from "@wagmi/core";
import { TransactionOptionsType } from "@/sdk/types";
import { Address } from "abitype";
import { constructBaseSortingFilterClauses, getChain } from "@/sdk/utils";
import { ContractMap } from "@/sdk/contracts";
import { encodeFunctionData, createPublicClient, Chain } from "viem";
import { RPC_API_KEYS } from "@/components/constants";
import { BigNumber } from "ethers";

export const dynamic = true;

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: http(RPC_API_KEYS[sepolia.id]),
    [mainnet.id]: http(RPC_API_KEYS[mainnet.id]),
    [arbitrumSepolia.id]: http(RPC_API_KEYS[arbitrumSepolia.id]),
    [arbitrum.id]: http(RPC_API_KEYS[arbitrum.id]),
    [baseSepolia.id]: http(RPC_API_KEYS[baseSepolia.id]),
    [base.id]: http(RPC_API_KEYS[base.id]),
  },
});

export const simulateTransaction = async ({
  chainId,
  transactions,
  account,
}: {
  chainId: number;
  transactions: Array<TransactionOptionsType>;
  account: Address;
}) => {
  try {
    // Get latest block number for the current chain
    const chain: Chain = getChain(chainId);
    const client = createPublicClient({
      chain,
      transport: http(RPC_API_KEYS[chainId]),
    });
    // const blockNumberRes = await client.getBlockNumber();

    const blockNumber = Number(await client.getBlockNumber());

    // Prepare transactions for a sequential simulation via Tenderly
    let transactionsToSimulate = [];
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      // @ts-ignore
      const contractInfo = ContractMap[chainId][transaction.contractId];

      const simulatableTransaction = {
        network_id: chainId.toString(),
        from: account,
        to: transaction.address,
        input: encodeFunctionData({
          // @ts-ignore
          abi: contractInfo.abi,
          functionName: transaction.functionName,
          args: transaction.args,
        }),
        block_number: blockNumber,
      };

      transactionsToSimulate.push(simulatableTransaction);
    }

    // Perform simulations
    const simulations = await simulateBundle(transactionsToSimulate);

    // Marshal response based on simulation results
    let response = [];
    for (let i = 0; i < simulations["simulation_results"].length; i++) {
      const responseForSimulation = {
        balance_changes:
          simulations["simulation_results"][i]["transaction"][
            "transaction_info"
          ]["balance_changes"],
        asset_changes:
          simulations["simulation_results"][i]["transaction"][
            "transaction_info"
          ]["asset_changes"],
      };

      response.push(responseForSimulation);
    }

    return {
      status: "success",
      // data: simulations,
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      data: null,
    };
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chainId, transactions, account } = body;

    const result = await simulateTransaction({
      chainId,
      transactions,
      account,
    });

    return Response.json(
      {
        status: result.status,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

async function simulateBundle(transactionsToSimulate: Array<any>) {
  // Tenderly API URL path params
  const accountSlug = process.env.TENDERLY_ACCOUNT_SLUG;
  const projectSlug = process.env.TENDERLY_PROJECT_SLUG;

  const url = `https://api.tenderly.co/api/v1/account/${accountSlug}/project/${projectSlug}/simulate-bundle`;

  const body = {
    simulations: transactionsToSimulate,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      // @ts-ignore
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Access-Key": process.env.TENDERLY_API_KEY, // Replace with your actual access key
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error sending simulation bundle:", error);
    throw error;
  }
}
