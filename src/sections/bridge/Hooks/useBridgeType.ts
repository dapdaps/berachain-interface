import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { engineType } from '../lib/type';

const toolMap: Record<string, engineType> = {
    jumper: 'liFi',
    stargate: 'stargate',
  } 

export default function useBridgeType() {
    const { dapp: dappName } = useParams();

    const bridgeType = useMemo(() => {
        return toolMap[(dappName as string).toLowerCase()] || 'stargate'
    }, [dappName])
   

    return {
        bridgeType
    }
}