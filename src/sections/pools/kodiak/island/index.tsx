import List from "./list";
import Detail from "./detail";
import { useEffect, useState } from "react";
import usePoolsIslands from "../use-pools-islands";

export default function Island({ page, setPage, searchVal, setIsPlain, withBaults, setPageLoading, dapp, loadPools, loadCurrent }: any) {
  const { loading, pools: islands } = usePoolsIslands({ withBaults, setPageLoading });
  const [record, setRecord] = useState<any>();

  useEffect(() => {
    setIsPlain(!!record);
    loadCurrent?.(record);
  }, [record]);

  useEffect(() => {
    loadPools?.(islands);
  }, [islands]);

  return record ? (
    <Detail
      data={record}
      dapp={dapp}
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
