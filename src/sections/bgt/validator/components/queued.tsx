import { memo, useEffect, useState } from "react";
import QueueList from "@/sections/bgt/components/delegate/queue-list";
import useDelegationQueue, { QueueType } from "@/sections/bgt/components/delegate/hooks/use-delegation-queue";
import useCustomAccount from "@/hooks/use-account";
export default memo(function Queued() {
  const {
    provider, account
  } = useCustomAccount()
  const { loading, delegationQueue, getDelegationQueue } = useDelegationQueue();

  const [updater, setUpdater] = useState(0)
  function onSuccess() {
    setUpdater(Date.now())
  }
  useEffect(() => {
    if (account && provider) {
      getDelegationQueue();
    }
  }, [account, provider])
  return (
    <div>
      <div className="text-xl font-semibold mb-4">Queued</div>
      <QueueList
        loading={loading}
        delegationQueue={delegationQueue}
        onSuccess={onSuccess}
      />
    </div>
  )
})
