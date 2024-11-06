import { asyncFetch } from '@/utils/http';
import { useState } from 'react';

export default function () {

  const [loading, setLoading] = useState(false)
  const [pageData, setPageData] = useState(null)
  const getPageData = async (address) => {
    setLoading(true)
    try {
      const response = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/validators/" + address)
      setLoading(false)
      setPageData(response?.validator)
    } catch (error) {
      setLoading(false)
      setPageData(null)
      console.error(error)
    }
  }
  return {
    loading,
    pageData,
    getPageData,
  }
}