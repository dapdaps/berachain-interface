import useCustomAccount from "@/hooks/use-account";
import { useState, useEffect } from 'react';
import { get, post } from '@/utils/http';

interface ITask {
  quests: any[]
  trade_days: number
}
export default function useTask() {
  const { account } = useCustomAccount()
  const [task, setTask] = useState<ITask>();
  const [loading, setLoading] = useState(false);
  async function queryTask() {
    try {
      setLoading(true)
      const response = await get("/api/bintent/user/" + account)
      if (response.code === 0) {
        setTask(response.data)
      }
    } catch (error) {
      throw new Error(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    account && queryTask();
  }, [account]);

  return {
    task,
    loading
  };
};