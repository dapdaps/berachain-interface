import { numberFormatter } from "@/utils/number-formatter";
import LazyImage from "@/components/layz-image";
import { upperFirst } from "lodash";

export const DefaultIcon = "/assets/tokens/default_icon.png";

export const getChainLogo = (name: string) => {
  name = name.toLowerCase();
  if (name === "arbitrum one") {
    name = "arbitrum";
  }
  if (name) {
    return `https://assets.db3.app/chain/${name}.png`;
  }
  return DefaultIcon;
};

export const getDappLogo = (name: string) => {
  name = name.toLowerCase().replace(/\s+/g, "");
  if (name) {
    return `https://assets.db3.app/dapp/${name}.png`;
  }
  return DefaultIcon;
};

export const getTokenLogo = (name: string) => {
  name = name.toLowerCase();

  const _name = name === 'wibgt' ? 'ibgt' : name;
  if (_name) {
    return `https://assets.db3.app/token/${_name}.png`;
  }
  return DefaultIcon;
};

export const executionTokenWay = (record: any) => {
  const tokenKeys = ["tokens_in"];
  if (!record) {
    return {
      tokenKeys: tokenKeys,
      method: ""
    };
  }
  let method = record.sub_type;

  if (record.type) {
    method += (method && " ") + record.type;
  }

  if (record.type === "yield") {
    method = record.method;
  }

  if (
    ["borrow", "remove", "repayborrow", "withdraw"].includes(
      record.sub_type.toLowerCase()
    )
  ) {
    tokenKeys[0] = "tokens_out";
  }

  if (record.type === "swap") {
    tokenKeys.unshift("tokens_out");
  }

  return {
    tokenKeys: tokenKeys,
    method
  };
};

export const formatExecution = (record: any, isMobile?: boolean) => {
  if (!record) return "";

  const { tokenKeys: keys, method } = executionTokenWay(record);

  const formatUsd = (usdValue: any) => {
    const usd = numberFormatter(usdValue, 2, true, { prefix: "$" });
    return `${usd}`;
  };

  const getDirection = (key: string) => {
    const add = {
      direction: "+ ",
      color: "#06C17E"
    };
    const minus = {
      direction: "- ",
      color: ""
    };
    if (key === "tokens_out") {
      if (["swap", "bridge"].includes(record.type)) {
        return add;
      }
      return minus;
    }
    if (["swap", "bridge"].includes(record.type)) {
      return minus;
    }
    return add;
  };

  const amount: any = (
    <>
      {keys.map((key) => {
        const direction = getDirection(key);
        if (record[key]) {
          return (
            <>
              {record[key].map((it: any, idx: number) => {
                const isNFT = it.type === "nft" && it.nft_token_id;
                const tks = isNFT
                  ? [...it.nft_token_id.split(",")].map((i: any) => ({
                      ...it,
                      nft_id: i
                    }))
                  : [it];
                return tks.map((_tk: any, _idx: number) => (
                  <div className="flex gap-[4px]" key={idx + "-" + _idx}>
                    <LazyImage
                      className="shrink-0 rounded-full"
                      src={getTokenLogo(isNFT ? _tk.address : _tk.symbol)}
                      alt=""
                      width={20}
                      height={20}
                      fallbackSrc={DefaultIcon}
                    />
                    <span
                      className=""
                      style={{
                        color: direction.color
                      }}
                    >
                      {`${direction.direction}${numberFormatter(
                        _tk.amount,
                        4,
                        true
                      )} ${isNFT ? "#" + _tk.nft_id : _tk.symbol} ${
                        !isNFT ? "(" + formatUsd(_tk.usd) + ")" : ""
                      }`}
                    </span>
                  </div>
                ));
              })}
            </>
          );
        }
        return null;
      })}
    </>
  );

  return (
    <div className="flex items-center flex-wrap gap-[6px] break-all text-[14px]">
      {!isMobile && <span>{upperFirst(method)}</span>}
      {amount || "-"}
    </div>
  );
};

export const gasFormatter = (record: any) => {
  if (!record || !record.gas) return "-";
  return `${numberFormatter(record.gas.amount, 4, true)} ${
    record.gas.symbol
  }($${numberFormatter(record.gas.usd, 2, true)})`;
};

export function txTimeFormatter(timeStr: number) {
  const date = new Date(timeStr * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
