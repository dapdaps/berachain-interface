import Modal from "@/components/modal";
import Bg from "./bg";
import Button from "@/components/button";
import { useMemo, useState } from "react";
import { NftIcon, ItemIcon, TokenIcon } from "./icons";
import OpenModalYap from "./open-modal-yap";

export default function BoxModal({ open: show, onClose, data, loading }: any) {
  const [showYaps, setShowYaps] = useState(false);
  const [imgs, names, yaps, hasNft, hasItem, hasToken] = useMemo(() => {
    const _imgs: any = [];
    let _names = "";

    data.items.forEach((item: any) => {
      _imgs.push({ type: "item", logo: item.logo });
      _names += item.name;
    });
    data.nfts.forEach((item: any) => {
      _imgs.push({ type: "nft", logo: item.logo });
      _names += item.name + (item.token_id || "");
    });
    if (data.snowflake_amount) {
      _imgs.push({ type: "token", amount: data.snowflake_amount });
      _names += data.snowflake_amount + " " + "$Snowflake";
    }
    return [
      _imgs,
      _names,
      data.yaps,
      data.nfts.length > 0,
      data.items.length > 0,
      data.snowflake_amount > 0
    ];
  }, [data]);
  return (
    <>
      <Modal
        open={show}
        onClose={onClose}
        closeIconClassName="right-[-14px] top-[-8px]"
      >
        <Bg className="w-[600px]">
          <div className="flex flex-col items-center pt-[30px]">
            {imgs.length > 0 && (
              <div className="flex justify-center gap-[6px]">
                {imgs.map((img: any, i: number) => (
                  <>
                    {img.type === "nft" && <NftIcon src={img.logo} key={i} />}
                    {img.type === "item" && <ItemIcon src={img.logo} key={i} />}
                    {img.type === "token" && (
                      <TokenIcon amount={img.amount} key={i} />
                    )}
                  </>
                ))}
              </div>
            )}
            <div className="text-[26px] font-CherryBomb mt-[4px]">
              Good Luck!
            </div>
            <div className="text-[14px] font-medium mt-[6px]">
              <div>
                You got a <span className="font-bold">{names}</span>
              </div>
              {hasNft && (
                <div>The NFT will send to your wallet in few days.</div>
              )}
              {hasItem && (
                <div>
                  You can check outfits in your{" "}
                  <a href="/cave" className="underline">
                    Bera Cave
                  </a>
                  .
                </div>
              )}
              {hasToken && (
                <div>
                  <a href="/dex/kodiak" className="underline font-bold">
                    Trade $Snowflake now
                  </a>{" "}
                  or hold? Up to you 😏
                </div>
              )}
            </div>
            <Button
              type="primary"
              className="w-[233px] h-[50px] text-[18px] font-semibold mt-[10px]"
              onClick={() => {
                if (yaps.length > 0) {
                  setShowYaps(true);
                } else {
                  onClose();
                }
              }}
              loading={loading}
            >
              OK
            </Button>
          </div>
        </Bg>
      </Modal>
      <OpenModalYap
        open={showYaps}
        onClose={() => {
          setShowYaps(false);
        }}
        texts={yaps}
      />
    </>
  );
}
