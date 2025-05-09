import Laptop from "./laptop";
import Mobile from "./mobile";
import Detail from "../detail";
import useIsMobile from "@/hooks/use-isMobile";
import { useEffect, useState } from "react";

export default function Yours({ setIsPlain }: any) {
  const isMobile = useIsMobile();
  const [record, setRecord] = useState<any>();

  useEffect(() => {
    setIsPlain(!!record);
  }, [record]);

  return (
    <>
      {record ? (
        <Detail
          data={record}
          onBack={() => {
            setRecord(null);
          }}
        />
      ) : isMobile ? (
        <Mobile
          onClick={(item: any) => {
            setRecord(item);
          }}
        />
      ) : (
        <Laptop
          onClick={(item: any) => {
            setRecord(item);
          }}
        />
      )}
    </>
  );
}
