import clsx from "clsx";
import InputNumber from "@/components/input-number";
import LazyImage from "@/components/layz-image";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";
import Loading from "@/components/loading";
import Big from "big.js";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo, useRef, useState } from "react";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Card from "@/components/card";
import { bera } from "@/configs/tokens/bera";

const ActionInput = (props: any) => {
  const {
    className,
    inputError,
    value,
    onChange,
    record,
    actionType,
    balanceLoading,
    balance,
    setCurrentProtocol,
    queuedAmount
  } = props;

  const tokenSelectPopRef = useRef<any>();

  const [currentToken, setCurrentToken] = useState(record.token);

  const handleBalance = () => {
    onChange(balance);
  };

  const [isDolomiteBera, isBera] = useMemo(() => {
    const isDolomiteBera =
      record?.pool_project === "Dolomite" &&
      record?.tokens?.length === 1 &&
      ["BERA", "WBERA"].includes(record?.tokens[0]?.symbol?.toUpperCase());
    const isBera = record?.tokens[0]?.symbol?.toUpperCase() === "BERA";
    return [isDolomiteBera, isBera];
  }, [record]);

  return (
    <div
      className={clsx(
        "mt-[20px] h-[90px] rounded-[12px] border flex flex-col items-stretch gap-[15px] pl-[13px] pr-[14px] pt-[20px] pb-[13px]",
        inputError
          ? "border-[#CE4314] bg-[#FFEFEF]"
          : "border-[#373A53] bg-[#FFF]",
        className
      )}
    >
      <div className="flex justify-between items-center gap-[10px] w-full">
        <InputNumber
          value={value}
          onNumberChange={onChange}
          placeholder="0"
          className={clsx(
            "flex-1 h-[26px] text-[20px] font-Montserrat !bg-[unset]",
            inputError ? "text-[#FF3F3F]" : "text-black"
          )}
        />
        <div className={clsx("flex items-center justify-end shrink-0")}>
          <Popover
            ref={tokenSelectPopRef}
            placement={PopoverPlacement.BottomRight}
            trigger={PopoverTrigger.Click}
            contentClassName="!z-[101]"
            content={
              isDolomiteBera && (
                <Card className="!rounded-[10px] !w-[150px] !p-[5px_5px] flex flex-col gap-[5px]">
                  {[bera.bera, bera.wbera].map((_token: any, idx: number) => (
                    <button
                      type="button"
                      key={idx}
                      className={clsx(
                        "flex items-center justify-between cursor-pointer hover:bg-[rgba(0,0,0,0.06)] transition duration-300 p-[5px_10px] rounded-[8px]",
                        currentToken.address === _token?.address &&
                          "!bg-[rgba(0,0,0,0.12)]"
                      )}
                      onClick={() => {
                        if (balanceLoading) return;
                        tokenSelectPopRef.current?.onClose();
                        setCurrentToken(_token);
                        setCurrentProtocol?.({
                          ...record,
                          pool_address:
                            _token.address === "native"
                              ? "0x0000000000000000000000000000000000000000"
                              : _token.address,
                          token: _token,
                          tokens: [
                            {
                              ..._token,
                              address:
                                _token.address === "native"
                                  ? "0x0000000000000000000000000000000000000000"
                                  : _token.address
                            }
                          ]
                        });
                      }}
                    >
                      <LazyImage
                        src={_token.icon}
                        width={26}
                        height={26}
                        containerClassName={clsx(
                          "shrink-0 rounded-full overflow-hidden"
                        )}
                        fallbackSrc="/assets/tokens/default_icon.png"
                      />
                      <div className="">{_token.symbol}</div>
                    </button>
                  ))}
                </Card>
              )
            }
            triggerContainerClassName="shrink-0"
          >
            <div
              className={clsx(
                "flex items-center gap-[5px] shrink-0",
                isDolomiteBera &&
                  (balanceLoading
                    ? "cursor-not-allowed opacity-30"
                    : "cursor-pointer")
              )}
            >
              <div className="flex items-center">
                {record.tokens.map((token: any, idx: number) => (
                  <LazyImage
                    src={token.icon}
                    width={26}
                    height={26}
                    key={idx}
                    containerClassName={clsx(
                      "shrink-0 rounded-full overflow-hidden",
                      isDolomiteBera && "cursor-pointer",
                      idx !== 0 && "ml-[-10px]"
                    )}
                    fallbackSrc="/assets/tokens/default_icon.png"
                  />
                ))}
              </div>
              {isDolomiteBera &&
                (balanceLoading ? (
                  <Loading size={10} />
                ) : (
                  <img
                    src="/images/vaults/v2/arrow-down.svg"
                    alt=""
                    className="w-[10px] object-center object-contain shrink-0"
                  />
                ))}
            </div>
          </Popover>
        </div>
      </div>
      <div className="flex justify-between items-center gap-[10px] w-full text-[#3D405A] font-Montserrat text-[14px] font-normal leading-normal">
        <div className=""></div>
        <div className="flex items-center gap-[2px]">
          <div>balance:</div>
          {actionType.value === ACTION_TYPE.DEPOSIT && balanceLoading ? (
            <Loading size={14} />
          ) : (
            <button
              type="button"
              disabled={
                Big(balance || 0).lte(0) ||
                (actionType.value === ACTION_TYPE.DEPOSIT && balanceLoading)
              }
              className="underline underline-offset-2 cursor-pointer disabled:opacity-30 disabled:!cursor-not-allowed"
              onClick={handleBalance}
            >
              {numberFormatter(balance, 6, true)}
            </button>
          )}
          {queuedAmount && actionType.value !== ACTION_TYPE.DEPOSIT && (
            <span className="text-[12px]">
              {" "}
              (In queue: {numberFormatter(queuedAmount, 6, true)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionInput;
