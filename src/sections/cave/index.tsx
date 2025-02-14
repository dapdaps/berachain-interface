import PageBack from "@/components/back";
import { SceneContext } from "@/context/scene";
import { useChristmas } from "@/hooks/use-christmas";
import useCollect, {
  cloth_cateogries,
  giftBoxTips,
  hat_categories,
  sockTips
} from "@/sections/cave/useCollect";
import { useBearEqu } from "@/stores/useBearEqu";
import { useCavePhotoList } from "@/stores/useCavePhotoList";
import { useCaveWelcome } from "@/stores/useCaveWelcome";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import Bear from "./Bear";
import CheckBox from "./CheckBox";
import ImportEquipments from "./ImportEquipments";
import NftModal from "./NftModal";
import Tips from "./Tip";
import Welcome from "./Welcome";
import TransferItemsModal from "@/sections/cave/components/TransferItems/Modal";
import { useTransferItemsStore } from "@/sections/cave/stores/useTransferItems";

const hatPositions = [
  {
    width: 102
  },
  {
    width: 106
  },
  {
    width: 103
  },
  {
    width: 107
  }
];

const carPositions = [
  { left: 70, top: 60 },
  { left: 137, top: 54 },
  { left: 204, top: 46 },
  { left: 272, top: 38 }
];

const clothPositions = [
  {},
  {
    marginLeft: 20
  },
  {},
  {}
];

const carsSize = [
  {
    height: 102,
    marginLeft: -14
  },
  {
    height: 102,
    marginLeft: -21
  },
  {
    height: 102,
    marginLeft: -16
  },
  {
    height: 102,
    marginLeft: -13
  }
];

const stakeDapps = [
  {
    icon: "/images/dapps/infrared.svg",
    name: "Infrared",
    link: "/staking/infrared"
  }
];

const lendDapps = [
  {
    icon: "/images/dapps/dolomite.svg",
    name: "Dolomite",
    link: "/lending/dolomite"
  },
  {
    icon: "/images/dapps/bend.svg",
    name: "Bend",
    link: "/lending/bend"
  }
];

const swapDapps = [
  {
    icon: "/images/dapps/kodiak.svg",
    name: "Kodiak",
    link: "/dex/kodiak"
  },
  {
    icon: "/images/dapps/beraswap.svg",
    name: "BeraSwap",
    link: "/dex/beraswap"
  },
  {
    icon: "/images/dapps/ooga-booga.svg",
    name: "Ooga Booga",
    link: "/dex/ooga-booga"
  }
];

const bridgeDapps = [
  {
    icon: "/images/dapps/stargate.svg",
    name: "Stargate",
    link: "/bridge"
  }
];

const hatTips = [
  {
    name: "Baseball Cap",
    content: "$1+ transaction, at least 1 transactions.",
    img: "/images/cave/hat/hat-1-1.png",
    link: "/bridge",
    btnText: "Bridge",
    dapps: bridgeDapps
  },
  {
    name: "Basic Helmet",
    content: "$10+ transaction, at least 10 transactions.",
    img: "/images/cave/hat/hat-2-2.png",
    link: "/bridge",
    btnText: "Bridge",
    dapps: bridgeDapps
  },
  {
    name: "Flying Helmet",
    content: "$100+ transaction, at least 100 transactions.",
    img: "/images/cave/hat/hat-3-3.png",
    link: "/bridge",
    btnText: "Bridge",
    dapps: bridgeDapps
  },
  {
    name: "Motor Helmet",
    content: "$1000+ transaction, at least 1000 transactions.",
    img: "/images/cave/hat/hat-4-4.png",
    link: "/bridge",
    btnText: "Bridge",
    dapps: bridgeDapps
  }
];

const clothTips = [
  {
    name: "Hoodie",
    content: "$1+ transaction, at least 1 transactions.",
    img: "/images/cave/clothing/cloth-1-1.png",
    link: "/swap",
    btnText: "Swap",
    dapps: swapDapps
  },
  {
    name: "Baseball Jacket",
    content: "$10+ transaction, at least 10 transactions.",
    img: "/images/cave/clothing/cloth-2-2.png",
    link: "/swap",
    btnText: "Swap",
    dapps: swapDapps
  },
  {
    name: "Vintage Jacket",
    content: "$100+ transaction, at least 100 transactions.",
    img: "/images/cave/clothing/cloth-3-3.png",
    link: "/swap",
    btnText: "Swap",
    dapps: swapDapps
  },
  {
    name: "Windcheater",
    content: "$1000+ transaction, at least 1000 transactions.",
    img: "/images/cave/clothing/cloth-4-4.png",
    link: "/swap",
    btnText: "Swap",
    dapps: swapDapps
  }
];

const carTips = [
  {
    name: "Bicycle",
    content: "Bicycle, Delegate 1 BGT.",
    img: "/images/cave/key/key-tip-1.png",
    link: "/swap",
    btnText: "Delegate",
    dapps: stakeDapps
  },
  {
    name: "Scooter",
    content: "Scooter, Delegate 100 BGT.",
    img: "/images/cave/key/key-tip-2.png",
    link: "/swap",
    btnText: "Delegate",
    dapps: stakeDapps
  },
  {
    name: "Motobike",
    content: "Motobike, Delegate 10,000 BGT.",
    img: "/images/cave/key/key-tip-3.png",
    link: "/swap",
    btnText: "Delegate",
    dapps: stakeDapps
  },
  {
    name: "Lambo",
    content: "Lambo, Delegate 1,000,000 BGT.",
    img: "/images/cave/key/key-tip-4.png",
    link: "/swap",
    btnText: "Delegate",
    dapps: stakeDapps
  }
];

const neckTips = [
  {
    name: "Alloy Necklace",
    content: "$Lend and Borrow in total $50.",
    img: "/images/cave/neck/neck-tip-1.png",
    link: "/swap",
    btnText: "Lending",
    dapps: lendDapps
  },
  {
    name: "Silver Necklace",
    content: "$Lend and Borrow in total $1000.",
    img: "/images/cave/neck/neck-tip-2.png",
    link: "/swap",
    btnText: "Lending",
    dapps: lendDapps
  },
  {
    name: "Golden Necklace",
    content: "$Lend and Borrow in total $500,000.",
    img: "/images/cave/neck/neck-tip-3.png",
    link: "/swap",
    btnText: "Lending",
    dapps: lendDapps
  },
  {
    name: "Diamond Necklace",
    content: "$Lend and Borrow in total $1,000,000.",
    img: "/images/cave/neck/neck-tip-4.png",
    link: "/swap",
    btnText: "Lending",
    dapps: lendDapps
  }
];

export default function Cave() {
  const { currentSceneInfoValid } = useContext(SceneContext);
  const { isChristmas } = useChristmas();
  const { address: account } = useAccount();
  const [tipLocation, setTipLocation] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const [tipMsg, setTipMsg] = useState<any>();
  const [tipShow, setTipShow] = useState<boolean>();
  const [openImportEquipments, setOpenImportEquipments] = useState(false);
  const setEqu = useBearEqu((store: any) => store.set);

  const tipDisabled = useMemo(() => {
    if (!tipMsg || currentSceneInfoValid) return false;
    if (tipMsg.btnText === "Campaign Ended") return true;
    return false;
  }, [currentSceneInfoValid, tipMsg]);

  const store: any = useCaveWelcome();
  const storePhotoList: any = useCavePhotoList();
  const searchParams = useSearchParams();
  const {
    transferItem,
    transferItems,
    setTransferItem,
    setTransferSelectedItems,
    setTransferItemsVisible
  } = useTransferItemsStore();

  const [checkPhotoIndex, setCheckPhotoIndex] = useState(-1);

  const { cars, hats, clothes, necklaces, items, nfts, getItems } = useCollect({
    address: account as string
  });

  const tipClick = useCallback((e: any, item: any, gameItem: any) => {
    console.log("tipClick", item, gameItem);
    if (
      e.target.classList.contains("cave-tip") ||
      e.target?.parentNode?.classList.contains("cave-tip")
    ) {
      e.nativeEvent.stopImmediatePropagation();
      let y = e.clientY - 30;
      if (y + 220 > window.innerHeight) {
        y = y - 220;
      }

      setTipLocation({
        x: e.clientX,
        y
      });
      setTipMsg(item);
      setTipShow(true);
      setTransferItem(gameItem);
      setTransferSelectedItems([gameItem]);
    }
  }, []);

  const docClick = useCallback((e: any) => {
    if (
      !e.target.classList.contains("cave-tip") &&
      !e.target?.parentNode?.classList.contains("cave-tip")
    ) {
      setTipShow(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", docClick, false);

    return () => {
      document.removeEventListener("click", docClick);
    };
  }, []);

  return (
    <div className="relative w-screen h-full min-w-[1200px] min-h-[890px]">
      <PageBack
        isBlack={false}
        className="ml-[30px] text-white absolute top-[20px] left-[30px] z-10"
      />
      {/*#region Christmas Items on Left-bottom*/}
      {isChristmas && (
        <div className="absolute top-[-68px] left-0 w-full bottom-0">
          <div className="absolute left-0 top-0 w-full h-[310px]">
            <img
              className="w-full"
              src="/images/cave/christmas/ribbons.svg"
              alt="ribbons"
            />
          </div>
          <div
            style={{ left: "calc(50% - (772px - 255px))" }}
            className="absolute translate-x-[-50%] bottom-[28px] z-10"
          >
            <div className="w-[510px]">
              <img src="/images/cave/christmas/stove.png" alt="stove" />
            </div>
            <div className="absolute left-[43px] top-[11px] w-[442px] z-[1]">
              <img src="/images/cave/christmas/ribbons_2.svg" alt="ribbons_2" />
            </div>

            {items.slice(0, -2).map((item, index) => {
              const Positions = [
                {
                  left: 67,
                  top: 122
                },
                {
                  left: 153,
                  top: 115
                },
                {
                  left: 245,
                  top: 112
                },
                {
                  left: 327,
                  top: 92
                },
                {
                  left: 406,
                  top: 75
                }
              ];
              return (
                <div
                  style={{
                    left: Positions[index]?.left,
                    top: Positions[index]?.top
                  }}
                  className={clsx("absolute w-[72px] cursor-pointer cave-tip")}
                  onClick={(e) => {
                    tipClick(
                      e,
                      currentSceneInfoValid
                        ? sockTips[index]
                        : { ...sockTips[index], btnText: "Campaign Ended" },
                      item
                    );
                  }}
                >
                  <div
                    className={clsx(
                      "absolute left-[38px] w-[4px] bg-black",
                      index === 2
                        ? "h-[48px] top-[-43px]"
                        : "h-[26px] top-[-18px]"
                    )}
                  />
                  <img
                    src={`/images/cave/christmas/sock${
                      item.pc_item ? "_has" : ""
                    }.svg`}
                    alt="sock"
                  />

                  {item.pc_item && (
                    <div className="absolute left-[26px] top-[-2px] z-10">
                      <CheckBox
                        checked={item.checked}
                        onCheckChange={(isChecked) => {
                          const isHat =
                            hat_categories.indexOf(item.category as string) >
                            -1;
                          const isCloth =
                            cloth_cateogries.indexOf(item.category as string) >
                            -1;
                          setEqu({
                            [isHat ? "hat" : isCloth ? "cloth" : "necklace"]:
                              isChecked ? item.category : 0
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {items.slice(-2).map((item, index) => {
              const Positions = [
                {
                  left: 12,
                  top: 301
                },
                {
                  left: 126,
                  top: 321
                }
              ];
              return (
                <div
                  style={{
                    left: Positions[index]?.left,
                    top: Positions[index]?.top
                  }}
                  className={clsx(
                    "absolute cursor-pointer cave-tip",
                    index === 0 ? "w-[125px]" : "w-[108px]"
                  )}
                  onClick={(e) => {
                    tipClick(
                      e,
                      currentSceneInfoValid
                        ? giftBoxTips[index]
                        : { ...giftBoxTips[index], btnText: "Campaign Ended" },
                      item
                    );
                  }}
                >
                  <img
                    src={
                      index === 0
                        ? `/images/cave/christmas/gift_box_1${
                            item.pc_item ? "_has" : ""
                          }.png`
                        : `/images/cave/christmas/gift_box_2${
                            item.pc_item ? "_has" : ""
                          }.png`
                    }
                    alt="giftBox"
                  />
                  {item.pc_item && (
                    <div
                      className={clsx(
                        "absolute",
                        index === 0
                          ? "right-[14px] top-[40px]"
                          : "right-[-5px] top-[20px]"
                      )}
                    >
                      <CheckBox
                        checked={item.checked}
                        onCheckChange={(isChecked) => {
                          setEqu({
                            car: isChecked ? item.category : 0
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/*#endregion*/}

      {!isChristmas && (
        <div className="absolute w-[5.829vw] bottom-[37.5px] left-[17.23%]">
          <img className="w-full" src="/images/cave/leaves.png" alt="" />
        </div>
      )}

      <div className="relative h-full">
        {/*#region Title*/}
        <div className="text-[60px] text-center text-[#fff] font-CherryBomb">
          <div className="  inline-block relative">
            Bera Cave
            <img
              onClick={() => {
                store.set({ welcomeShow: true });
              }}
              className="w-[58px] top-[38%] right-[-70px] cursor-pointer absolute"
              src="/images/cave/ruler.png"
            />
          </div>
        </div>
        {/*#endregion*/}
        {/*#region NFT*/}
        <div className="flex gap-[65px] justify-center">
          {storePhotoList?.photoList?.map((photo: any, index: number) => (
            <div className="relative w-[159px] h-[184px] group">
              <img
                className="relative z-[3]"
                src="/images/cave/christmas/photo_frame.svg"
                alt="photo_frame"
              />
              <div className="absolute left-[18px] top-[42px] z-[2]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="118"
                  height="114"
                  viewBox="0 0 118 114"
                  fill="none"
                >
                  <path
                    d="M11.02 19.0435V109.182C11.02 111.4 9.22165 113.199 7.00332 113.199C4.83003 113.199 3.05092 111.47 2.98834 109.298L0.0176601 6.17277C-0.0797058 2.79278 2.63378 0 6.01517 0H111.697C115.011 0 117.697 2.68629 117.697 6V7.04348C117.697 10.3572 115.011 13.0435 111.697 13.0435H17.02C13.7063 13.0435 11.02 15.7298 11.02 19.0435Z"
                    fill="black"
                    fill-opacity="0.54"
                  />
                </svg>
              </div>

              <div
                className="absolute left-[38px] top-[86px] flex items-center justify-center w-[81px] h-[36px] rounded-[18px] border-[2px] border-[#4B371F] bg-[#FFDC50] cursor-pointer text-black font-CherryBomb text-[18px] z-[5] opacity-0 group-hover:opacity-100"
                onClick={() => {
                  nfts?.length > 0 && setCheckPhotoIndex(index);
                }}
              >
                Change
              </div>
              {photo ? (
                <>
                  <div className="absolute top-[54px] left-[28px] right-[28px] bottom-[32px] z-[1]">
                    <img
                      className="w-full"
                      src={photo?.logo}
                      alt={photo?.name}
                    />
                  </div>
                  <div className="z-[4] flex items-center justify-center absolute left-[13px] bottom-[6px] w-[123px] h-[26px] rounded-[8px] border border-[#B18249] bg-[linear-gradient(90deg,_#CDB34D_0%,_#675A27_100%)] text-[#FFEAA5] font-CherryBomb text-[14px]  text-stroke-1">
                    {photo?.name}
                  </div>
                </>
              ) : (
                <div className="absolute top-[54px] left-[28px] right-[28px] bottom-[32px] z-[1] bg-[#656565] flex items-center justify-center">
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M40.0846 2.1665C45.5013 2.1665 49.8346 6.49984 49.8346 11.9165C49.8346 14.4082 48.8596 16.8998 47.1263 18.6332C48.2096 21.3415 48.7513 24.1582 48.7513 27.0832C48.7513 39.6498 38.568 49.8332 26.0013 49.8332C13.4346 49.8332 3.2513 39.6498 3.2513 27.0832C3.2513 24.1582 3.79297 21.3415 4.8763 18.6332C3.14297 16.8998 2.16797 14.4082 2.16797 11.9165C2.16797 6.49984 6.5013 2.1665 11.918 2.1665C14.7346 2.1665 17.3346 3.35817 19.1763 5.4165C23.618 4.00817 28.3846 4.00817 32.8263 5.4165C34.668 3.35817 37.268 2.1665 40.0846 2.1665ZM42.5763 19.0665C42.143 18.0915 42.3596 17.0082 43.2263 16.3582C44.6346 15.2748 45.5013 13.6498 45.5013 11.9165C45.5013 8.88317 43.118 6.49984 40.0846 6.49984C38.1346 6.49984 36.5096 7.47484 35.4263 9.09984C34.8846 9.9665 33.8013 10.3998 32.8263 9.9665C28.493 8.23317 23.618 8.23317 19.1763 9.9665C18.2013 10.3998 17.118 9.9665 16.5763 9.09984C15.6013 7.47484 13.868 6.49984 11.918 6.49984C8.99297 6.49984 6.5013 8.88317 6.5013 11.9165C6.5013 13.6498 7.36797 15.2748 8.7763 16.3582C9.64297 17.0082 9.96797 18.0915 9.4263 19.0665C8.23464 21.5582 7.58463 24.2665 7.58463 27.0832C7.58463 37.2665 15.818 45.4998 26.0013 45.4998C36.1846 45.4998 44.418 37.2665 44.418 27.0832C44.418 24.2665 43.768 21.5582 42.5763 19.0665Z"
                      fill="#8D8D8D"
                    />
                    <path
                      d="M29.9013 30.3335H22.1013C21.5596 30.3335 21.2346 31.0918 21.7763 31.4168L24.0513 33.0418C24.593 33.3668 24.918 33.9085 25.0263 34.4502L25.4596 36.1835C25.568 36.7252 26.3263 36.7252 26.4346 36.1835L26.868 34.4502C27.0846 33.9085 27.4096 33.3668 27.843 33.0418L30.3346 31.4168C30.768 31.0918 30.5513 30.3335 29.9013 30.3335ZM33.5846 20.5835C31.743 20.5835 30.3346 21.9918 30.3346 23.8335C30.3346 25.6752 31.743 27.0835 33.5846 27.0835C35.4263 27.0835 36.8346 25.6752 36.8346 23.8335C36.8346 21.9918 35.4263 20.5835 33.5846 20.5835ZM18.418 20.5835C16.5763 20.5835 15.168 21.9918 15.168 23.8335C15.168 25.6752 16.5763 27.0835 18.418 27.0835C20.2596 27.0835 21.668 25.6752 21.668 23.8335C21.668 21.9918 20.2596 20.5835 18.418 20.5835Z"
                      fill="#8D8D8D"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        {/*#endregion*/}
        {/*#region Hats*/}
        <div className="flex items-end px-[30px] absolute w-[583px] left-[50%] top-[270px] translate-x-[-50%]">
          {hats.map((item) => {
            return (
              <div
                className="flex-1 relative cursor-pointer cave-tip"
                onClick={(e) => {
                  tipClick(e, hatTips[item.level - 1], item);
                }}
              >
                <img
                  className="cursor-pointer"
                  style={hatPositions[item.level - 1]}
                  src={`/images/cave/hat/hat-${item.level}${
                    item.pc_item ? "-" + item.level : ""
                  }.png`}
                />
                {item.pc_item && (
                  <div className=" absolute bottom-[15px] left-[50%] translate-x-[-50%]">
                    <CheckBox
                      checked={item.checked}
                      onCheckChange={(isChecked) => {
                        setEqu({
                          hat: isChecked ? item.level : 0
                        });
                      }}
                      item={item}
                    />
                  </div>
                )}

                {}
              </div>
            );
          })}
        </div>
        {/*#endregion*/}
        {/*#region Coats*/}
        <div className="absolute w-[583px] left-[50%] translate-x-[-50%] top-[355px] h-[398px] overflow-hidden">
          <div className="absolute w-[583px] top-[-80px] h-[398px] bg-[url('/images/cave/sheet.png')] bg-contain bg-no-repeat bg-bottom">
            <div className="flex px-[30px] pt-[120px]">
              {clothes.map((item) => {
                return (
                  <div
                    className="flex-1 cave-tip relative"
                    onClick={(e) => {
                      tipClick(e, clothTips[item.level - 1], item);
                    }}
                  >
                    <img
                      className="w-[102px] cursor-pointer"
                      style={clothPositions[item.level - 1]}
                      src={`/images/cave/clothing/cloth-${item.level}${
                        item.pc_item ? "-" + item.level : ""
                      }.png`}
                    />
                    {item.pc_item && (
                      <div className=" absolute top-[10px] right-[50px]">
                        <CheckBox
                          checked={item.checked}
                          onCheckChange={(isChecked) => {
                            setEqu({
                              cloth: isChecked ? item.level : 0
                            });
                          }}
                          item={item}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/*#endregion*/}
        {/*#region Keychains*/}
        <div
          style={{
            left: isChristmas
              ? "calc(50% - (772px - 45px - 174.5px)"
              : "calc(50% - 170px - 290px)"
          }}
          className={clsx(
            "w-[349px] h-[230px] translate-x-[-50%] absolute bg-[url('/images/cave/box.png')] bg-contain bg-no-repeat bg-bottom",
            isChristmas ? "bottom-[432px]" : "top-[500px]"
          )}
        >
          {cars.map((item) => {
            return (
              <div
                className="absolute cave-tip"
                style={carPositions[item.level - 1]}
                onClick={(e) => {
                  tipClick(e, carTips[item.level - 1], item);
                }}
              >
                <img
                  className="h-[78px] cursor-pointer"
                  style={item.pc_item ? carsSize[item.level - 1] : {}}
                  src={`/images/cave/key/key-${item.level}${
                    item.pc_item ? "-" + item.level : ""
                  }.png`}
                />
                {item.pc_item && (
                  <div className=" absolute top-[-30px] left-[30%] translate-x-[-50%]">
                    <CheckBox
                      checked={item.checked}
                      onCheckChange={(isChecked) => {
                        setEqu({
                          car: isChecked ? item.level : 0
                        });
                      }}
                      item={item}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/*#endregion*/}
        {/*#region Window on Right*/}
        <div
          style={{ left: "calc(57% + 120px + 290px)" }}
          className=" absolute w-[186px] h-[224px] top-[150px] translate-x-[-50%] bg-[url('/images/cave/window.png')] bg-contain bg-no-repeat bg-bottom"
        ></div>
        {/*#endregion*/}
        {/*#region necklace Left-top*/}
        <div
          style={{ left: "calc(57% + 120px + 214px)" }}
          onClick={(e) => {
            tipClick(e, neckTips[0], necklaces[0]);
          }}
          className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[350px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom"
        >
          <img
            src={`/images/cave/neck/neck-1${
              necklaces.length && necklaces[0].pc_item ? "-1" : ""
            }.png`}
            className="w-[71px] absolute left-[11px] top-[35px] cursor-pointer"
          />
          {!!necklaces.length && necklaces[0].pc_item && (
            <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
              <NeckLaceChecked
                item={necklaces.length && necklaces[0]}
                setEqu={setEqu}
              />
            </div>
          )}
        </div>
        {/*#endregion*/}
        {/*#region necklace Right-top*/}
        <div
          style={{ left: "calc(57% + 120px + 348px)" }}
          onClick={(e) => {
            tipClick(e, neckTips[1], necklaces[1]);
          }}
          className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[370px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom"
        >
          <img
            src={`/images/cave/neck/neck-2${
              necklaces.length && necklaces[1].pc_item ? "-2" : ""
            }.png`}
            className="w-[71px] absolute left-[14px] top-[32px] cursor-pointer"
          />
          {!!necklaces.length && necklaces[1].pc_item && (
            <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
              <NeckLaceChecked
                item={necklaces.length && necklaces[1]}
                setEqu={setEqu}
              />
            </div>
          )}
        </div>
        {/*#endregion*/}
        {/*#region necklace Left-bottom*/}
        <div
          style={{ left: "calc(57% + 120px + 214px)" }}
          onClick={(e) => {
            tipClick(e, neckTips[2], necklaces[2]);
          }}
          className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[530px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom"
        >
          <img
            src={`/images/cave/neck/neck-3${
              necklaces.length && necklaces[2].pc_item ? "-3" : ""
            }.png`}
            className="w-[71px] absolute left-[11px] top-[35px] cursor-pointer"
          />
          {!!necklaces.length && necklaces[2].pc_item && (
            <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
              <NeckLaceChecked
                item={necklaces.length && necklaces[2]}
                setEqu={setEqu}
              />
            </div>
          )}
        </div>
        {/*#endregion*/}
        {/*#region necklace Right-bottom*/}
        <div
          style={{ left: "calc(57% + 120px + 348px)" }}
          onClick={(e) => {
            tipClick(e, neckTips[3], necklaces[3]);
          }}
          className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[545px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom"
        >
          <img
            src={`/images/cave/neck/neck-4${
              necklaces.length && necklaces[3].pc_item ? "-4" : ""
            }.png`}
            className="w-[71px] absolute left-[10px] top-[32px] cursor-pointer"
          />
          {!!necklaces.length && necklaces[3].pc_item && (
            <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
              <NeckLaceChecked
                item={necklaces.length && necklaces[3]}
                setEqu={setEqu}
              />
            </div>
          )}
        </div>
        {/*#endregion*/}
        {/*#region Mirror on Right*/}
        <div className=" pointer-events-none absolute w-[358px] h-[593px] bottom-[0px] right-[2%] bg-[url('/images/cave/mirror.png')] bg-contain bg-no-repeat bg-bottom"></div>
        {/*#endregion*/}
        {/*#region Stone on Right*/}
        <div className=" pointer-events-none absolute w-[757px] h-[386px] bottom-[0px] right-0 bg-[url('/images/cave/stone.png')] bg-contain bg-no-repeat bg-bottom"></div>
        {/*#endregion*/}
        <Bear
          cars={cars}
          hats={hats}
          clothes={clothes}
          necklaces={necklaces}
          items={items}
        />
        <Welcome
          show={store.welcomeShow}
          onClose={() => {
            store.set({ welcomeShow: false });
          }}
        />
        {tipShow && (
          <Tips
            msg={tipMsg}
            location={tipLocation}
            disabled={tipDisabled}
            transferItem={transferItem}
          />
        )}

        <NftModal
          visible={checkPhotoIndex > -1}
          nfts={nfts}
          store={storePhotoList}
          checkedIndex={checkPhotoIndex}
          onClose={() => {
            setCheckPhotoIndex(-1);
          }}
        />

        <ImportEquipments
          equimentsMapping={{
            cars,
            hats,
            clothes,
            necklaces
          }}
        />
      </div>

      <div
        onClick={() => {
          setTransferItemsVisible(true);
          setTransferSelectedItems(transferItems);
        }}
        className="pb-[5px] absolute right-[20px] bottom-[80px] w-[200px] rounded-[10px] border border-[#709D27] bg-[#7DB425] backdrop-blur-[5px]"
      >
        <div className="w-full flex justify-center items-center gap-[20px] active:translate-y-[5px] relative cursor-pointer h-[60px] rounded-[10px] border border-[#709D27] bg-[#C7FF6E] backdrop-blur-[5px]">
          <div className="pl-[12px] w-0 flex-1 text-[#F7F9EA] font-CherryBomb text-[18px] text-stroke-1-4b371f leading-[100%]">
            Transfer Boost Items
          </div>
          <div className="mr-[12px] w-[40px] shrink-0">
            <img src="/images/cave/icon-bear.png" alt="icon-bear" />
          </div>
        </div>
      </div>
      <TransferItemsModal onAfterTransfer={getItems} />
    </div>
  );
}

function NeckLaceChecked({ item, setEqu }: any) {
  if (!item) {
    return;
  }
  return (
    <CheckBox
      checked={item.checked}
      onCheckChange={(isChecked) => {
        setEqu({
          necklace: isChecked ? item.level : 0
        });
      }}
      item={item}
    />
  );
}
