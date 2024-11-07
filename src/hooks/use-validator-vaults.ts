import { asyncFetch } from '@/utils/http';
import { useState } from 'react';

export default function () {
  const [loading, setLoading] = useState(false)
  const [vaults, setVaults] = useState<null | any[]>(null)
  const getValuts = async (address) => {
    setLoading(true)
    try {
      const response = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/vaults?validatorId=" + address)
      setLoading(false)
      setVaults(response?.vaults)
    } catch (error) {
      setLoading(false)
      setVaults([])
      console.error(error)
    }
  }
  return {
    loading,
    vaults,
    getValuts,
  }
}