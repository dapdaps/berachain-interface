import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { engineType } from '../lib/type';

const toolMap: Record<string, engineType> = {
    lifi: 'jumper',
    stargate: 'stargate',
  } 

export default function useBridgeType() {
    const { dapp: dappName } = useParams();
    const pathname = usePathname();


    const bridgeType = useMemo(() => {
        if (pathname.includes('/super-swap')) {
            return 'kodiak'
        }

        if (dappName) {
            return toolMap[(dappName as string).toLowerCase()] || 'jumper'
        }
        return 'jumper'
    }, [dappName, pathname])
   

    return {
        bridgeType
    }
}