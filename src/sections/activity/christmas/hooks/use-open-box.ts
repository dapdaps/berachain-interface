import { useCallback, useState } from "react";
import { post } from "@/utils/http";

export default function useOpenBox(onSuccess: any) {
  const [loading, setLoading] = useState(false);

  const onOpen = useCallback(async (all: boolean) => {
    try {
      setLoading(true);
      const response = await post(
        all ? "/api/mas/reward/draw/batch" : "/api/mas/reward/draw",
        all
          ? {}
          : {
              all
            }
      );
      if (response.code === 0) {
        onSuccess(response.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, onOpen };
}
