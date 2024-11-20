import { TOKENS } from "../laptop/config";
import { useMemo, useState } from "react";
import Item from "./item";

export default function Tokens() {
  const tokens = useMemo(() => Object.values(TOKENS), [TOKENS]);
  const [selectToken, setSelectToken] = useState<number>();
  return (
    <div className="mt-[86px] w-[1070px] mx-[auto] flex justify-between md:w-[560px] md:mt-[40px] md:pl-[18px]">
      {Object.values(tokens).map((token, i) => (
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
    </div>
  );
}
