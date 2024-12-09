import OpenBox from "./open-box";
import Button from "@/components/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useMemo } from "react";
import Hints from "./hints";
import TokenHints from "./hints-token";
import NftHints from "./nft-hints";
import SnowIcon from "../present-icons/icon-snow";
import { NftIcon } from "./icons";

export default function OpenStatus({ data, remainBox, loading, onClick }: any) {
  const [type, item] = useMemo(() => {
    if (!data) return ["", {}];
    if (data.item) return ["item", data.item];
    if (data.nft) return ["nft", data.nft];
    if (data.rare) return ["nft", data.rare];
    if (data.snowflake_amount)
      return ["token", { amount: data.snowflake_amount }];
    return ["yap", { text: data.yap }];
  }, [data]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      {(!!item?.logo || type === "token") && (
        <motion.div
          initial={{
            y: 120
          }}
          animate={{
            y: 0,
            zIndex: 3
          }}
          className={clsx(
            "absolute top-[-168px] z-[1] w-[322px] h-[213px] flex items-center justify-center"
          )}
        >
          {type === "token" ? (
            <SnowIcon />
          ) : type === "nft" ? (
            <NftIcon src={item.logo} />
          ) : (
            <img src={item.logo} />
          )}
        </motion.div>
      )}
      <OpenBox className="mt-[-133px] relative z-[2]" />
      <div className="text-[26px] font-CherryBomb mt-[14px]">Good Luck!</div>
      {type === "token" && <TokenHints amount={item.amount} />}
      {type === "item" && <Hints name={item.name} />}
      {type === "nft" && <NftHints nft={item} />}
      <Button
        type="primary"
        className="w-[233px] h-[50px] text-[18px] font-semibold mt-[10px] flex justify-center items-center"
        onClick={onClick}
        loading={loading}
        isOnlyLoading
      >
        {remainBox > 0 ? "Open the next box" : "OK"}
      </Button>
    </motion.div>
  );
}
