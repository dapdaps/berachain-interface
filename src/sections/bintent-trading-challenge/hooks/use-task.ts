import useCustomAccount from "@/hooks/use-account";
import { useState, useEffect } from 'react';
import { get, post } from '@/utils/http';
import _ from "lodash";

interface ITask {
  quests: any[]
  trade_days: number
}
export default function useTask() {
  const { account } = useCustomAccount()
  const [task, setTask] = useState<ITask>();
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState({
    "boost1.1": false,
    "boost1.2": false
  })
  const [categoryVerify, setCategoryVerify] = useState({
    "boost1.1": false,
    "boost1.2": false
  })
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
  function handleSetCategoryLoading(category, bool) {
    setCategoryLoading(prev => {
      const curr = _.cloneDeep(prev)
      curr[category] = bool
      return curr
    })
  }
  function handleSetCategoryVerify(category, bool) {
    setCategoryVerify(prev => {
      const curr = _.cloneDeep(prev)
      curr[category] = bool
      return curr
    })
  }

  async function queryVerify(category) {
    try {
      handleSetCategoryLoading(category, true)
      const response = await post("/api/bintent/verify", {
        category,
        address: account,
      })
      handleSetCategoryVerify(category, response?.data?.complete)
    } catch (error) {
      throw new Error(error)
    }
    handleSetCategoryLoading(category, false)
  }
  useEffect(() => {
    if (account) {
      queryTask()
      queryVerify("boost1.1")
      queryVerify("boost1.2")
    }
  }, [account]);

  return {
    task,
    loading,
    categoryLoading,
    categoryVerify,
    queryVerify
  };
};