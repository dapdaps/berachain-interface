import { useCallback, useState } from "react";
import { post } from "@/utils/http";

export default function useOpenBox(onSuccess: any) {
  const [loading, setLoading] = useState(false);

  const getPostUrl = (all: boolean) => all ? "/api/mas/reward/draw/batch" : "/api/mas/reward/draw";
  const getPostData = (all: boolean) => all ? {} : { all };

  const onOpen = async (all: boolean) => {
    try {
      setLoading(true);
      const url = getPostUrl(all);
      const data = getPostData(all);
      const response = await post(url, data);
      if (response.code === 0) {
        onSuccess(response.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { loading, onOpen };
}
