import List from "./list";
import Detail from "./detail";
import { useEffect, useState } from "react";
import usePoolsIslands from "../use-pools-islands";

export default function Island({ page, setPage, searchVal, setIsPlain }: any) {
  const { loading, pools: islands } = usePoolsIslands();
  const [record, setRecord] = useState<any>();
  useEffect(() => {
    setRecord(islands?.[10]);
  }, [islands]);

  useEffect(() => {
    setIsPlain(!!record);
  }, [record]);

  return record ? (
    <Detail
      data={record}
      onBack={() => {
        setRecord(null);
      }}
    />
  ) : (
    <List
      onSelect={(item: any) => {
        setRecord(item);
      }}
      pools={islands || []}
      loading={loading}
      {...{ page, setPage, searchVal }}
    />
  );
}
