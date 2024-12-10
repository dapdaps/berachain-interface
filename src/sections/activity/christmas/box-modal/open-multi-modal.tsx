import Modal from "@/components/modal";
import Bg from "./bg";
import Button from "@/components/button";
import { useMemo, useState } from "react";
import { NftIcon, ItemIcon, TokenIcon } from "./icons";
import OpenModalYap from "./open-modal-yap";
import Big from 'big.js';

export default function BoxModal({
  open: show,
  onClose,
  onOpenSwapModal,
  data,
  loading
}: any) {
  const [showYaps, setShowYaps] = useState(false);
  const [
    imgs,
    names,
    yaps,
    hasNft,
    hasItem,
    hasToken,
    isOnlyItem,
    isOnlyNFTs,
    isOnlyRares,
    isOnlySnowflake,
    title
  ] = useMemo(() => {
    const _imgs: any = [];
    let _names = [];

    const isNoItem = !data.items || data.items.length <= 0;
    const isNoNFTs = !data.nfts || data.nfts.length <= 0;
    const isNoRares = !data.rares || data.rares.length <= 0;
    const isNoSnowflake = !data.snowflake_amount || Big(data.snowflake_amount || 0).lte(0);

    const onlyItem = !isNoItem && isNoNFTs && isNoRares && isNoSnowflake;
    const onlyNFTs = !isNoNFTs && isNoItem && isNoRares && isNoSnowflake;
    const onlyRares = !isNoRares && isNoItem && isNoNFTs && isNoSnowflake;
    const onlySnowflake = !isNoSnowflake && isNoItem && isNoNFTs && isNoRares;

    data.items.forEach((item: any) => {
      _imgs.push({ type: "item", logo: item.logo });
      _names.push(1 + " " + item.name);
    });
    data.nfts.forEach((item: any) => {
      _imgs.push({ type: "nft", logo: item.logo });
      _names.push(1 + " " + item.name + (item.token_id || ""));
    });
    data.rares.forEach((item: any) => {
      _imgs.push({ type: "nft", logo: item.logo });
      _names.push(item.amount ? item.amount + " " + item.name : item.name);
    });
    if (data.snowflake_amount) {
      _imgs.push({ type: "token", amount: data.snowflake_amount });
      _names.push(data.snowflake_amount + " " + "$Snowflake");
    }

    let title = 'Good Luck!';
    if (onlyItem) {
      title = 'Lucky you!';
    }

    return [
      _imgs,
      _names.join(', '),
      data.yaps,
      data.nfts.length > 0,
      data.items.length > 0,
      data.snowflake_amount > 0,
      onlyItem,
      onlyNFTs,
      onlyRares,
      onlySnowflake,
      title
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
          <div className="flex flex-col items-center p-[30px_20px_0] w-full">
            {imgs.length > 0 && (
              <div className={`flex gap-[12px] flex-wrap w-full ${imgs?.length > 5 ? 'justify-start' : 'justify-center'}`}>
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
              {title}
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
                  <button
                    onClick={onOpenSwapModal}
                    className="underline font-bold"
                  >
                    Trade $Snowflake now
                  </button>{" "}
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
          onClose();
        }}
        texts={yaps}
      />
    </>
  );
}
