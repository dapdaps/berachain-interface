import { useMemo, useState } from "react";
import Loading from "@/components/loading";
import Item from "./item";

export default function Tokens({ tokens, loading }: any) {
  const [selectToken, setSelectToken] = useState<number>();
  const list = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];
    const [t1, t2, t3, ...rest] = tokens;

    const _t1 = { ...t1, rank: 1 };
    const _t2 = { ...t2, rank: 2 };
    const _t3 = { ...t3, rank: 3 };

    if (tokens.length === 1) return [_t1];
    if (tokens.length === 2) return [_t2, _t1];

    return [_t3, _t2, _t1, ...rest];
  }, [tokens]);

  return (
    <div className="mt-[86px] w-[1070px] mx-[auto] flex justify-between h-[200px] md:w-[560px] md:mt-[40px] md:pl-[18px]">
      {list.map((token: any, i: number) => (
        <Item
          key={token.address}
          token={token}
          i={i}
          show={i === selectToken}
          onClick={() => {
            setSelectToken(i);
          }}
        />
      ))}
      {loading && (
        <div className="flex justify-center w-full">
          <Loading size={40} />
        </div>
      )}
    </div>
  );
}
