import useUser from '@/hooks/use-user';
import { useDebounceFn } from 'ahooks';
import { useEffect } from 'react';

export function useAuthQuery(props: Props) {
  const { query, onEmpty } = props;

  const { accessToken, accessTokenLoading } = useUser();

  const { run: queryDelay } = useDebounceFn(query, { wait: 50 });

  useEffect(() => {
    if (!accessToken) {
      onEmpty && onEmpty();
      return;
    }
    if (accessTokenLoading) return;
    queryDelay();
  }, [accessToken, accessTokenLoading]);
}

interface Props {
  query(): any;
  onEmpty?(): void;
}
