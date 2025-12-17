import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { engineType } from '../lib/type';

const toolMap: Record<string, engineType> = {
    lifi: 'jumper',
    stargate: 'stargate',
    oneclick: 'oneclick',
  } 

export default function useBridgeType(props: { type?: string | null }) {
    const { dapp: dappName } = useParams();
    const pathname = usePathname();
    const { type = 'bridge' } = props;

    const bridgeType = useMemo(() => {
        if (type) {
            return type === 'super-swap' ? 'superSwap' : 'jumper'
        }

        if (pathname.includes('/super-swap')) {
            return 'superSwap'
        }

        if (dappName) {
            return toolMap[(dappName as string).toLowerCase()] || 'jumper'
        }
        return 'jumper'
    }, [dappName, pathname, type])
   

    return {
        bridgeType
    }
}