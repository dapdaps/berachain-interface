import List from "./list";
import Detail from "./detail";
import { useEffect, useState } from "react";
import usePoolsIslands from "../use-pools-islands";

export default function Island({ page, setPage, searchVal, setIsPlain }: any) {
  const { loading, pools: islands } = usePoolsIslands();
  const [record, setRecord] = useState<any>(true);

  useEffect(() => {
    setIsPlain(!!record);
  }, [record]);

  return record ? (
    <Detail data={record} />
  ) : (
    <List
      onSelect={(item: any) => {}}
      pools={islands || []}
      loading={loading}
      {...{ page, setPage, searchVal }}
    />
  );
}
