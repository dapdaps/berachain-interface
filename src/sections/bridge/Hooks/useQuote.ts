import { useDebounce } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import type { ExecuteRequest, QuoteRequest, QuoteResponse } from '../lib/type';
import { execute, getQuote, getStatus } from '../lib/index';
import useAccount from '@/hooks/use-account';


const timeout = 1000 * 40;

export default function useQuote(
  quoteRequest: QuoteRequest | null,
  identification: string | number,
  quickLoading: boolean = true
) {
  const [routes, setRoutes] = useState<QuoteResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const newestIdentification = useRef(identification);
  const { provider, chainId } = useAccount();
  // Request sequence number to ensure only the latest request's results are processed
  const requestIdRef = useRef(0);

  // const inputValue = useDebounce(quoteLoading, { wait: 500 });

  async function getRoutes(quoteRequest: QuoteRequest | null) {

    if (!quoteRequest) {
      setRoutes(null);
      setQuoteLoading(false);
      setLoading(false);
      return;
    }

    // Generate a new request ID
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setQuoteLoading(true);
    setRoutes(null);
    const routes: QuoteResponse[] = [];
    let stop = false;
    let timeoutId: NodeJS.Timeout | null = null;

    timeoutId = setTimeout(() => {
      // Only handle timeout for the current request ID (check if it's still the latest request)
      if (currentRequestId === requestIdRef.current && quoteRequest.identification === newestIdentification.current) {
        if (!stop) {
          stop = true;
          setQuoteLoading(false);
          setLoading(false);
        }
      }
    }, timeout);

    const start = Date.now();

    const _routes = await getQuote(quoteRequest, provider?.getSigner(), function (val: QuoteResponse) {
      // Only process callback for the latest request (check if it's still the latest request)
      if (currentRequestId !== requestIdRef.current || stop) {
        return;
      }

      if (val.identification === newestIdentification.current) {
        routes.push(val);
        if (quickLoading) {
          setLoading(false);
        }
        setRoutes([...routes]);
      }
    });

    // Clear timeout timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Only process results for the latest request (check if it's still the latest request)
    if (currentRequestId !== requestIdRef.current) {
      return;
    }

    if (_routes && _routes.length && _routes[0].identification === newestIdentification.current) {
      setLoading(false);
      setQuoteLoading(false);
      setRoutes(_routes);
      return;
    }

    if (quoteRequest.identification === newestIdentification.current) {
      setLoading(false);
      setQuoteLoading(false);
    }
  }

  useEffect(() => {
    getRoutes(quoteRequest);
  }, [quoteRequest, provider]);

  useEffect(() => {
    if (identification) {
      newestIdentification.current = identification;
    }
  }, [identification]);

  return {
    routes,
    loading,
    quoteLoading,
    getRoutes,
  };
}
