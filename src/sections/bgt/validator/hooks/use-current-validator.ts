import { useSearchParams } from 'next/navigation';
import { useRequest } from 'ahooks';
import { getValidatorsResponse } from '@/sections/bgt/validators/hooks/use-list';
import { useEffect } from 'react';

export function useCurrentValidator(props?: any) {
  const {} = props ?? {};

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { runAsync: getCurrentValidator, data: currentValidator, loading: currentValidatorLoading } = useRequest(async (_id?: string) => {
    let queryId: any = _id;
    if (!queryId) {
      queryId = id;
    }
    const res = await getValidatorsResponse({
      sortBy: "boostApr",
      sortOrder: "desc",
      search: "",
      pageSize: 10,
      "chain": "BERACHAIN",
      "where": {
        idIn: [queryId]
      },
      "skip": 0,
    });
    if (!res) {
      return {};
    }
    return res.validators?.[0] ?? {};
  }, { manual: true });

  useEffect(() => {
    if (!id) return;
    getCurrentValidator();
  }, [id]);

  return {
    currentValidator,
    currentValidatorLoading,
    getCurrentValidator,
  };
}
