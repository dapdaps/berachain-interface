import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { engineType } from '../lib/type';

const toolMap: Record<string, engineType> = {
    lifi: 'jumper',
    stargate: 'stargate',
  } 

export default function useBridgeType() {
    const { dapp: dappName } = useParams();

    const bridgeType = useMemo(() => {
        if (dappName) {
            return toolMap[(dappName as string).toLowerCase()] || 'jumper'
        }
        return 'jumper'
    }, [dappName])
   

    return {
        bridgeType
    }
}