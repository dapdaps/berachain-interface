import { useEffect, useState } from "react";
import { get } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";

export default function useVoteData(round?: number) {
  const [voteAddress, setVoteAddress] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();

  const onQuery = async () => {
    if (!account || !provider || !round) return;
    try {
      setLoading(true);
      const result = await get(
        `/api/meme/vote?round=${round}&account=${account}`
      );

      setVoteAddress(result.data?.token_address);
    } catch (err) {
      console.log(err);
      setVoteAddress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onQuery();
  }, [account, provider]);

  return { loading, voteAddress, onQuery };
}
