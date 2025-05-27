import { TOKENS } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useHall } from "@/stores/hall";
import { usePriceStore } from "@/stores/usePriceStore";
import { asyncFetch } from "@/utils/http";
import { useDebounceFn } from "ahooks";
import Big from "big.js";
import { ethers } from "ethers";
import _ from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";


interface IIncentivesContext {

}
export const IncentivesContext = createContext<Partial<IIncentivesContext>>({});

const ERC20_ADDRESS = "0xBDDba144482049382eC79CadfA02f0fa0F462dE3"
const ABI = [{
  "inputs": [
    {
      "components": [
        {
          "internalType": "bytes32",
          "name": "identifier",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "merkleProof",
          "type": "bytes32[]"
        }
      ],
      "internalType": "struct IBGTIncentiveDistributor.Claim[]",
      "name": "_claims",
      "type": "tuple[]"
    }
  ],
  "name": "claim",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]
const PAGE_SIZE = 100
function IncentivesContextProvider({ children, pageData }: { children: ReactNode; pageData: any }) {
  const store = useHall()
  const toast = useToast()
  const { account, provider } = useCustomAccount();
  const prices: any = usePriceStore(store => store.price);
  const [page, setPage] = useState(0)
  const [proofs, setProofs] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [incentivesLoading, setIncentivesLoading] = useState(true)
  const [claimLoading, setClaimLoading] = useState(false)
  const [tokenCurrentPrices, setTokenCurrentPrices] = useState(null)
  const incentives = useMemo(() => tokenCurrentPrices && handleGetIncentives(proofs), [proofs, tokenCurrentPrices])

  const page_incentives = useMemo(() => tokenCurrentPrices && handleGetIncentives(proofs?.slice(page * 100, (page + 1) * 100)), [proofs, tokenCurrentPrices, page])
  const usd_total_unclaimed = useMemo(() => incentives?.reduce((acc, curr) => acc = Big(acc).plus(curr?.usd_total_unclaimed ?? 0).toFixed(), 0), [incentives])
  const max_page = useMemo(() => Math.ceil(proofs?.length / 100) - 1, [proofs])

  const { run: onChangePage } = useDebounceFn((type) => {
    setPage(type === "prev" ? page - 1 : page + 1)
  }, {
    wait: 500
  })

  async function handleGetTokenCurrentPrices(addressIn) {

    const response = await asyncFetch("https://api.berachain.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        operationName: "GetTokenCurrentPrices",
        variables: {
          "chains": [
            "BERACHAIN"
          ],
          "addressIn": addressIn
        },
        query:
          "query GetTokenCurrentPrices($chains: [GqlChain!]!, $addressIn: [String!]!) {\n  tokenGetCurrentPrices(chains: $chains, addressIn: $addressIn) {\n    address\n    chain\n    price\n    updatedAt\n    updatedBy\n    __typename\n  }\n}"
      })
    })
    const priceMap = {
    }
    response?.data?.tokenGetCurrentPrices?.forEach(token => {
      priceMap[token?.address?.toLocaleLowerCase()] = token?.price
    })
    setTokenCurrentPrices(priceMap)
  }

  function handleGetIncentives(rewards) {
    if (!rewards?.length) return []
    const tokenMap = {};
    rewards?.forEach(reward => {
      const token = reward.token;
      const total_unclaimed = Big(tokenMap?.[token]?.total_unclaimed ?? 0)
      tokenMap[token] = {
        token: reward.token,
        total_unclaimed: Big(total_unclaimed).plus(reward?.amount ?? 0).toFixed(),
        count: (tokenMap?.[token]?.count ?? 0 + 1),
        available_at: reward.available_at
      };
    });
    return Object.values(tokenMap).sort((a, b) => b.available_at - a.available_at)?.map(reward => {
      const token = TOKENS?.[reward?.token?.toLowerCase()]
      const total_unclaimed = ethers.utils.formatUnits(reward?.total_unclaimed ?? 0)
      return {
        ...token,
        ...reward,
        total_unclaimed,
        usd_total_unclaimed: Big(total_unclaimed).times(tokenCurrentPrices?.[token?.address?.toLocaleLowerCase()] ?? 0).toFixed()
      }
    })
  }

  async function onClaim() {
    setClaimLoading(true)
    const contract = new ethers.Contract(ERC20_ADDRESS, ABI, provider?.getSigner())
    const _claims = []
    proofs?.slice(page * 100, (page + 1) * 100)?.forEach(proof => {
      _claims.push({
        identifier: proof.dist_id,
        account: proof.recipient,
        amount: proof.amount,
        merkleProof: proof.merkle_proof,
      })
    });
    let estimateGas: any = new Big(1000000);
    try {
      estimateGas = await contract.estimateGas.claim(_claims);
    } catch (err: any) {
      if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
        estimateGas = new Big(3000000);
      }
    }
    try {
      const tx = await contract.claim(_claims, {
        gasLimit: new Big(estimateGas).times(1.2).toFixed(0)
      });
      toast.success({
        title: "Claim Successful!"
      })
      setProofs(prev => {
        const curr = _.cloneDeep(prev)
        curr.splice(page * 100, 100)
        return curr
      })
    } catch (error) {
      toast?.fail({
        title: "Claim Failed!",
        text: error?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : error?.message ?? ""
      });
    }
    setClaimLoading(false)
    onClose?.()
  }

  function onClose() {
    setShowModal(false)
  }
  async function getProofs() {
    try {
      setIncentivesLoading(true)
      const response = await fetch(`/api-claim.berachain.com/api/v1/wallets/${account}/proofs/validator/${pageData?.pubkey}?page=1&per_page=10000`)
      const result = (await response.json()) as any;
      handleGetTokenCurrentPrices(handleGetIncentives(result?.rewards)?.map(incentive => incentive.address))
      setProofs(result?.rewards?.sort((a, b) => b.available_at - a.available_at))
    } catch (error) {
      console.log(error)
    }
    setIncentivesLoading(false)
  }
  useEffect(() => {
    if (pageData && account && Object.keys(prices).length > 0) {
      getProofs()
    } else {
      setProofs(null)
    }
  }, [pageData, prices, account])
  return (
    <IncentivesContext.Provider
      value={{
        PAGE_SIZE,
        page,
        max_page,
        pageData,
        showModal,
        proofs,
        incentives,
        page_incentives,
        usd_total_unclaimed,
        claimLoading,
        incentivesLoading,
        setShowModal,
        onClose,
        onClaim,
        onChangePage,
        handleGetIncentives
      }}
    >
      {children}
    </IncentivesContext.Provider>
  );
}

export default IncentivesContextProvider;
export function useIncentivesContext() {
  const context = useContext(IncentivesContext);

  return context as IIncentivesContext;
}