import PageBack from "@/components/back";
import PageTitle from "@/components/title";
import IconLeftLeaf from "@public/images/tree/left-leaf.svg";
import IconRightLeaf from "@public/images/tree/right-leaf.svg";
import TrunkSmall from "@public/images/tree/trunk-small.svg";
import TrunkLarge from "@public/images/tree/trunk-large.svg";
import Bees from "@public/images/tree/bees.svg";
import DApp from "@/sections/dapps/components/DApp";
import Floor from "@/sections/dapps/components/Floor";
import dAppsConfig from "@/configs/dapp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";

const _dApps: any = {};
for (const dapp in dAppsConfig) {
  _dApps[dapp] = {
    ...dAppsConfig[dapp],
    name: dapp,
    label: dapp.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())
  };
}

const FIRST_LIST = [
  {
    className: "w-[174px] h-[112px]",
    dAppClassName: "absolute left-1/2 -translate-x-1/2 top-[-76px] gap-[10px]",
    sticks: [
      "absolute left-[20px] bottom-[48px]",
      "absolute right-[12px] top-1/2 -translate-y-1/2",
      "absolute left-[34px] bottom-[36px]"
    ],
    dApps: [
      {
        ..._dApps["infrared"],
        attachedIcon: "",
      }
    ]
  },
  {
    className: "w-[230px] h-[132px]",
    dAppClassName: "absolute w-[388px] top-[-77px] justify-between -left-1/3",
    sticks: [
      "absolute left-[46px] bottom-[44px]",
      "absolute left-[34px] bottom-[32px]"
    ],
    dApps: [
      {
        ..._dApps["dolomite"],
        attachedIcon: (
          <TrunkSmall className="absolute left-[44%] bottom-[-24%]" />
        )
      },
      {
        ..._dApps["bend"],
        attachedIcon: (
          <TrunkSmall className="scale-x-[-1] absolute right-[44%] bottom-[-24%]" />
        ),
        disabled: true
      }
    ]
  },
  {
    className: "w-[362px] h-[147px]",
    dAppClassName:
      "absolute left-1/2 -translate-x-1/2 top-[-90px] gap-y-[27px] lg:gap-x-[86px] md:gap-x-[62px] flex-wrap w-[560px] justify-center",
    sticks: [
      "absolute left-[163px] bottom-[34px]",
      "absolute left-1/2 bottom-[22px]"
    ],
    dApps: [
      {
        ..._dApps["kodiak"],
        attachedIcon: (
          <TrunkLarge className="absolute left-[44%] bottom-[-28%]" />
        )
      },
      {
        ..._dApps["bex"],
        label: "BeraSwap",
        attachedIcon: (
          <div className="absolute left-[44%] bottom-[-16%] w-[17px] h-[32px] rounded-[12px] border-[2px] border-black bg-[#906925]" />
        ),
        disabled: true
      },
      {
        ..._dApps["ooga-booga"],
        attachedIcon: (
          <TrunkLarge className="scale-x-[-1] absolute right-[44%] bottom-[-28%]" />
        )
      },
      // {
      //   ..._dApps["aquabera"],
      // },
      {
        name: "Stargate",
        label: "Stargate",
        icon: "/images/dapps/stargate.svg",
        type: "bridge",
        attachedIcon: "",
        className: "",
        disabled: false
      }
    ]
  }
];
const SECOND_LIST = [
  {
    className: "w-[174px] h-[112px]",
    dAppClassName: "absolute left-1/2 -translate-x-1/2 top-[-76px] gap-[10px]",
    sticks: [
      "absolute left-[20px] bottom-[48px]",
      "absolute right-[12px] top-1/2 -translate-y-1/2",
      "absolute left-[34px] bottom-[36px]"
    ],
    dApps: [
      {
        ..._dApps["berps"],
        attachedIcon: "",
        disabled: true
      }
    ]
  },
  {
    className: "w-[230px] h-[132px]",
    dAppClassName: "absolute w-[388px] top-[-77px] justify-between -left-1/3",
    sticks: [
      "absolute left-[46px] bottom-[44px]",
      "absolute left-[34px] bottom-[32px]"
    ],
    dApps: [
      {
        ..._dApps["beraborrow"],
        attachedIcon: (
          <TrunkSmall className="absolute left-[44%] bottom-[-28%]" />
        ),
        disabled: true
      },
      {
        ..._dApps["aquabera"],
        attachedIcon: (
          <TrunkSmall className="scale-x-[-1] absolute right-[44%] bottom-[-24%]" />
        ),
        disabled: true
        // disabled: true
      }
    ]
  },
  {
    className: "w-[362px] h-[147px]",
    dAppClassName:
      "absolute left-1/2 -translate-x-1/2 top-[-90px] gap-y-[27px] lg:gap-x-[86px] md:gap-x-[62px] flex-wrap w-[560px] justify-center",
    sticks: [
      "absolute left-[163px] bottom-[34px]",
      "absolute left-1/2 bottom-[22px]"
    ],
    dApps: [
      {
        ..._dApps["bedrock"],
        attachedIcon: (
          <TrunkLarge className="absolute left-[44%] bottom-[-28%]" />
        )
      },

      {
        icon: "/images/dapps/kingdomly.svg",
        name: "Kingdomly",
        label: "Kingdomly",
        type: "NFT",
        className: "",
        attachedIcon: (
          <div className="absolute left-[44%] bottom-[-16%] w-[17px] h-[32px] rounded-[12px] border-[2px] border-black bg-[#906925]" />
        )
      },
      {
        icon: "/images/dapps/ramen.svg",
        name: "Ramen",
        label: "Ramen",
        type: "Launchpad",
        className: "",
        disabled: true,
        attachedIcon: (
          <TrunkLarge className="scale-x-[-1] absolute right-[44%] bottom-[-28%]" />
        )
      },
      {
        icon: "/images/dapps/royco.svg",
        name: "Royco",
        label: "Royco",
        type: "Vaults",
        disabled: true,
        className: ""
      }
    ]
  }
];

const ALL_LIST = [
  {
    className: "w-[174px] h-[112px]",
    dAppClassName: "absolute left-1/2 -translate-x-1/2 top-[-76px] gap-[10px]",
    sticks: [
      "absolute left-[20px] bottom-[48px]",
      "absolute right-[12px] top-1/2 -translate-y-1/2",
      "absolute left-[34px] bottom-[36px]"
    ],
    dApps: [
      {
        ..._dApps["infrared"],
        attachedIcon: "",
        disabled: true
      }
    ]
  },
  {
    className: "w-[230px] h-[132px]",
    dAppClassName: "absolute w-[388px] top-[-77px] justify-between -left-1/3",
    sticks: [
      "absolute left-[46px] bottom-[44px]",
      "absolute left-[34px] bottom-[32px]"
    ],
    dApps: [
      {
        ..._dApps["dolomite"],
        attachedIcon: (
          <TrunkSmall className="absolute left-[44%] bottom-[-24%]" />
        )
      },
      {
        ..._dApps["bend"],
        attachedIcon: (
          <TrunkSmall className="scale-x-[-1] absolute right-[44%] bottom-[-24%]" />
        ),
        disabled: true
      }
    ]
  },
  {
    className: "w-[362px] h-[147px]",
    dAppClassName:
      "absolute left-1/2 -translate-x-1/2 top-[-90px] gap-y-[27px] lg:gap-x-[86px] md:gap-x-[62px] flex-wrap w-[560px] justify-center",
    sticks: [
      "absolute left-[163px] bottom-[34px]",
      "absolute left-1/2 bottom-[22px]"
    ],
    dApps: [
      {
        ..._dApps["kodiak"],
        attachedIcon: (
          <TrunkLarge className="absolute left-[44%] bottom-[-28%]" />
        )
      },
      {
        ..._dApps["bex"],
        label: "BeraSwap",
        attachedIcon: (
          <div className="absolute left-[44%] bottom-[-16%] w-[17px] h-[32px] rounded-[12px] border-[2px] border-black bg-[#906925]" />
        ),
        disabled: true
      },
      {
        ..._dApps["ooga-booga"],
        attachedIcon: (
          <TrunkLarge className="scale-x-[-1] absolute right-[44%] bottom-[-28%]" />
        )
      }
    ]
  },
  {
    className: "w-[362px] h-[147px]",
    dAppClassName:
      "absolute left-1/2 -translate-x-1/2 top-[-90px] gap-y-[27px] lg:gap-x-[86px] md:gap-x-[62px] flex-wrap w-[560px] justify-center",
    sticks: [
      "absolute left-[163px] bottom-[34px]",
      "absolute left-1/2 bottom-[22px]"
    ],
    dApps: [
      {
        name: "Stargate",
        label: "Stargate",
        icon: "/images/dapps/stargate.svg",
        type: "bridge",
        className: "",
        disabled: true,
        attachedIcon: (
          <TrunkLarge className="absolute left-[44%] bottom-[-28%]" />
        )
      },
      {
        ..._dApps["berps"],
        attachedIcon: (
          <div className="absolute left-[44%] bottom-[-16%] w-[17px] h-[32px] rounded-[12px] border-[2px] border-black bg-[#906925]" />
        ),
        disabled: true
      },
      {
        ..._dApps["beraborrow"],
        attachedIcon: (
          <TrunkLarge className="scale-x-[-1] absolute right-[44%] bottom-[-28%]" />
        ),
        disabled: true
      }
    ]
  },
  {
    className: "w-[362px] h-[147px]",
    dAppClassName:
      "absolute left-1/2 -translate-x-1/2 top-[-90px] gap-y-[27px] lg:gap-x-[86px] md:gap-x-[62px] flex-wrap w-[560px] justify-center",
    sticks: [
      "absolute left-[163px] bottom-[34px]",
      "absolute left-1/2 bottom-[22px]"
    ],
    dApps: [
      {
        ..._dApps["aquabera"],
        attachedIcon: (
          <TrunkLarge className="absolute left-[44%] bottom-[-28%]" />
        ),
        disabled: true
      },
      {
        ..._dApps["bedrock"],
        attachedIcon: (
          <div className="absolute left-[44%] bottom-[-16%] w-[17px] h-[32px] rounded-[12px] border-[2px] border-black bg-[#906925]" />
        )
      },
      {
        icon: "/images/dapps/kingdomly.svg",
        name: "Kingdomly",
        label: "Kingdomly",
        type: "NFT",
        className: "",
        attachedIcon: (
          <TrunkLarge className="scale-x-[-1] absolute right-[44%] bottom-[-28%]" />
        )
      }
    ]
  },
  {
    className: "w-[230px] h-[132px]",
    dAppClassName: "absolute w-[388px] top-[-77px] justify-between -left-1/3",
    sticks: [
      "absolute left-[46px] bottom-[44px]",
      "absolute left-[34px] bottom-[32px]"
    ],
    dApps: [
      {
        icon: "/images/dapps/ramen.svg",
        name: "Ramen",
        label: "Ramen",
        type: "Launchpad",
        className: "",
        disabled: true,
        attachedIcon: (
          <TrunkSmall className="absolute left-[44%] bottom-[-24%]" />
        )
      },
      {
        icon: "/images/dapps/royco.svg",
        name: "Royco",
        label: "Royco",
        type: "Vaults",
        disabled: true,
        className: "",
        attachedIcon: (
          <TrunkSmall className="scale-x-[-1] absolute right-[44%] bottom-[-24%]" />
        )
      }
    ]
  }
];

const toFirstUpperCase = (word: string) => {
  return word.replace(/\b\w/g, (char) => char.toUpperCase());
};

const DAppsView = () => {
  const [visibleHeight, setVisibleHeight] = useState(844);
  const isMobile = useIsMobile();

  const router = useRouter();

  const onNavigateTo = (_dApp: any) => {
    let dAppPath = `/${_dApp.type === "swap" ? "dex" : _dApp.type}/${
      _dApp.name
    }`;
    if (_dApp.name === "berps") {
      dAppPath += `?id=BHONEY&tab=0`;
    }
    if (_dApp.name === "Kingdomly") {
      dAppPath = `/${_dApp.name.toLowerCase()}`;
    }
    router.push(dAppPath);
  };

  useEffect(() => {
    const updateViewportHeight = () => {
      setVisibleHeight(window.visualViewport?.height || window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  return (
    <div className="w-full h-full md:mb-[70px] relative md:h-[100dvh] overflow-x-hidden overflow-y-auto scrollbar-hide">
      <div className="h-full md:h-[280vw] relative">
        <PageBack className="absolute left-[12px] top-[17px]" />
        <PageTitle className="pt-[30px] mb-[75px]">dApps</PageTitle>
        {isMobile ? (
          <div className="absolute bottom-[46px] left-1/2  -translate-x-1/2 scale-[0.76] z-[1]">
            <div className="w-[67px] h-[862px] bg-[#906925] border-black border-[2px] relative">
              <IconLeftLeaf className="absolute left-[-25px] bottom-[-10px]" />
              <IconRightLeaf className="absolute right-[-10px] bottom-[-10px]" />
              <Bees className="absolute left-[4px] bottom-[48px] z-[1]" />
              <div className="absolute -top-[98px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-[14px]">
                {ALL_LIST.map((item, index) => (
                  <Floor
                    key={"floor" + index}
                    className={item.className}
                    sticks={item.sticks}
                  >
                    {item.dApps.length > 0 && (
                      <div className={`flex ${item.dAppClassName}`}>
                        {item.dApps.map((dApp, idx) => (
                          <div
                            key={`treeNode_${idx}`}
                            className={
                              "relative basis-[120px] " + (dApp.className ?? "")
                            }
                          >
                            <DApp
                              name={dApp.label}
                              icon={dApp.icon}
                              type={toFirstUpperCase(dApp.type)}
                              onClick={() => onNavigateTo(dApp)}
                              disabled={dApp.disabled}
                            />
                            {dApp.attachedIcon ?? null}
                          </div>
                        ))}
                      </div>
                    )}
                  </Floor>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute lg:bottom-[230px] md:bottom-[618px]  left-1/2  -translate-x-1/2 lg:-translate-x-[300%] md:scale-[0.76] md:z-[1]">
              <div className="w-[95px] h-[415px] bg-[#906925] border-black border-[2px] relative">
                <IconLeftLeaf className="absolute left-[-25px] bottom-[-10px]" />
                <IconRightLeaf className="absolute right-[-10px] bottom-[-10px]" />
                <div className="absolute top-[-68px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-[14px]">
                  {FIRST_LIST.map((item, index) => (
                    <Floor
                      key={"floor" + index}
                      className={item.className}
                      sticks={item.sticks}
                    >
                      {item.dApps.length > 0 && (
                        <div className={`flex ${item.dAppClassName}`}>
                          {item.dApps.map((dApp, idx) => (
                            <div
                              key={`treeNode_${idx}`}
                              className={
                                "relative basis-[120px] " +
                                (dApp.className ?? "")
                              }
                            >
                              <DApp
                                name={dApp.label}
                                icon={dApp.icon}
                                type={toFirstUpperCase(dApp.type)}
                                onClick={() => onNavigateTo(dApp)}
                                disabled={dApp.disabled}
                              />
                              {dApp.attachedIcon ?? null}
                            </div>
                          ))}
                        </div>
                      )}
                    </Floor>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute lg:bottom-[230px] md:bottom-[200px]  left-1/2  -translate-x-1/2 lg:translate-x-[300%] md:scale-[0.76] md:z-[1]">
              <div className="w-[95px] h-[415px] bg-[#906925] border-black border-[2px] relative">
                <IconLeftLeaf className="absolute left-[-25px] bottom-[-10px]" />
                <IconRightLeaf className="absolute right-[-10px] bottom-[-10px]" />
                <div className="absolute top-[-68px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-[14px]">
                  {SECOND_LIST.map((item, index) => (
                    <Floor
                      key={"floor" + index}
                      className={item.className}
                      sticks={item.sticks}
                    >
                      {item.dApps.length > 0 && (
                        <div className={`flex ${item.dAppClassName}`}>
                          {item.dApps.map((dApp, idx) => (
                            <div
                              key={`treeNode_${idx}`}
                              className={
                                "relative basis-[120px] " +
                                (dApp.className ?? "")
                              }
                            >
                              <DApp
                                name={dApp.label}
                                icon={dApp.icon}
                                type={toFirstUpperCase(dApp.type)}
                                onClick={() => onNavigateTo(dApp)}
                                disabled={dApp.disabled}
                              />
                              {dApp.attachedIcon ?? null}
                            </div>
                          ))}
                        </div>
                      )}
                    </Floor>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 hidden md:block"
          style={{
            backgroundImage: "url('/images/mobile/dapp-bg.png')",
            backgroundSize: "100%",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: visibleHeight < 750 ? "40.897vw" : "75.897vw",
            zIndex: 0
          }}
        ></div>
      </div>
    </div>
  );
};

export default DAppsView;
