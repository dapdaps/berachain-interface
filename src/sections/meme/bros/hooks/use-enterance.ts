import { useEffect, useState } from "react";
import { get } from "@/utils/http";

export default function useEnteranceToken() {
  const [token, setToken] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await get(`/api/meme/recommendToken`);
        setToken(result.data);
      } catch (err) {
        setToken(null);
      }
    };
    init();
  }, []);

  return { token };
}
