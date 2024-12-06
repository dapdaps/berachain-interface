import { useCallback, useEffect, useState } from "react";
import { get } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";

export default function useHomepageData() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { account } = useCustomAccount();

  const onQuery = useCallback(async () => {
    if (!account) return;
    try {
      setLoading(true);
      const response = await get(`/api/mas/user/box?account=${account}`);
      setData(response.data);
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (account) onQuery();
  }, [account]);

  return { loading, data, onQuery };
}
