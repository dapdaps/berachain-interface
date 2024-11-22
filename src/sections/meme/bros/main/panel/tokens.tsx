import Image from "next/image";
import { useCallback } from "react";
import { useRouter } from "next-nprogress-bar";
import Button from "@/components/button";
import RankMark from "../../rank-mark";
import Popover, { PopoverPlacement } from "@/components/popover";
import RewardsPanel from "./rewards-panel";
import RoundLabel from "../../components/round-label";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import { balanceShortFormated, balanceFormated } from "@/utils/balance";
import Loading from "@/components/loading";

const Token = ({
  token,
  i,
  onClick,
  userInfo,
  balance,
  balancesLoading
}: any) => {
  return (
    <div
      className={clsx(
        "mt-[18px] rounded-[18px] bg-[#FFE5B8] border border-black shadow-shadow1 p-[16px]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[15px]">
          <div className="relative">
            <Image
              src={token.icon}
              width={42}
              height={42}
              className="rounded-full border-[3px] border-black"
              alt={token.symbol}
            />

            {token.rank && (
              <RankMark rank={token.rank} className="left-[4px] top-[8px]" />
            )}
          </div>
          <div>
            <div className="text-[20px] font-CherryBomb">{token.symbol}</div>
            <div
              className="text-[14px] underline font-medium"
              onClick={() => {
                onClick(8, token);
              }}
            >
              Get
            </div>
          </div>
        </div>
        <div className="rounded-[16px] flex items-center gap-[3px] p-[8px]">
          <span>APR</span>
          <span className="text-[14px] font-bold">45.24%</span>
        </div>
      </div>
      <div className="mt-[20px] flex text-[14px] md:flex-col">
        <div className="grow flex flex-wrap">
          <div className="w-1/3 md:w-1/2">
            <div className="text-[#3D405A] font-medium">Total Dapped</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>{balanceShortFormated(token.stakedAmountUSD, 2)}</span>
              <Image
                src={token.icon}
                width={16}
                height={16}
                className="rounded-full"
                alt={token.symbol}
              />
            </div>
          </div>
          <div className="w-1/3 md:w-1/2">
            <div className="text-[#3D405A] font-medium">Total Rewards</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <Popover
                content={<RewardsPanel />}
                placement={PopoverPlacement.TopLeft}
              >
                <div className="flex items-center gap-[3px] cursor-pointer">
                  <Image
                    src={token.icon}
                    width={16}
                    height={16}
                    className="rounded-full"
                    alt={token.symbol}
                  />
                  <Image
                    src={token.icon}
                    width={16}
                    height={16}
                    className="rounded-full ml-[-8px]"
                    alt={token.symbol}
                  />
                </div>
              </Popover>

              <button
                className="font-medium underline ml-[12px]"
                onClick={() => {
                  onClick(5);
                }}
              >
                Incentives
              </button>
            </div>
          </div>
          <div className="w-1/3 md:w-1/2 md:mt-[6px]">
            <div className="text-[#3D405A] font-medium">Dappers</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">You Dapped</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>
                {userInfo?.stakedAmountUSD
                  ? balanceShortFormated(userInfo?.stakedAmountUSD, 2)
                  : "-"}
              </span>
              <Image
                src={token.icon}
                width={16}
                height={16}
                className="rounded-full"
                alt={token.symbol}
              />
            </div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">Your Rewards</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <Image
                src={token.icon}
                width={16}
                height={16}
                className="rounded-full"
                alt={token.symbol}
              />
              <Image
                src={token.icon}
                width={16}
                height={16}
                className="rounded-full ml-[-8px]"
                alt={token.symbol}
              />
              <button
                className="font-medium underline ml-[12px]"
                onClick={() => {
                  onClick(3);
                }}
              >
                Claim
              </button>
            </div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">In Wallet</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              {balancesLoading ? (
                <Loading />
              ) : balance ? (
                balanceFormated(balance, 2)
              ) : (
                "-"
              )}
              <Image
                src={token.icon}
                width={16}
                height={16}
                className="rounded-full"
                alt={token.symbol}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[15px] md:flex-row md:mt-[12px]">
          <Button
            className="h-[40px] w-[172px]"
            type="primary"
            onClick={() => {
              onClick(1, token);
            }}
          >
            Dap me up!
          </Button>
          <Button
            className="h-[40px] w-[172px] !bg-transparent"
            onClick={() => {
              onClick(2, token);
            }}
          >
            Unstake
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Tokens({
  onOpenModal,
  tokens,
  userData,
  balances,
  balancesLoading
}: any) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleVote = useCallback(() => {
    if (isMobile) {
      router.push("/meme/bros/vote");
    } else {
      onOpenModal(6);
    }
  }, [isMobile]);

  return (
    <>
      <div className="w-[1232px] mx-[auto] md:px-[14px] md:w-full">
        <div className="flex justify-between items-center md:absolute md:top-[-25px] md:justify-start md:gap-[8px]">
          <RoundLabel title="Round 1" subTitle="NoV.20-dec.3, 2024" />
          <div className="flex items-center gap-[16px] md:hidden">
            <button
              className="w-[137px] h-[48px] border border-black bg-[#FFDC50] rounded-[10px] font-semibold"
              onClick={() => {
                router.push("/meme/bros/history");
              }}
            >
              History
            </button>
            <button
              className="w-[137px] h-[48px] border border-black bg-[#FFDC50] rounded-[10px] font-semibold leading-[16px]"
              onClick={handleVote}
            >
              Vote for the next round
            </button>
          </div>
          <div className="rounded-[10px] w-[64px] h-[72px] border border-black bg-[#FFFDEB] p-[3px] hidden md:block">
            <Button
              type="primary"
              className="w-[58px] h-[32px] !text-[12px] !px-0"
            >
              Hotest
            </Button>
            <Button className="border-0 w-[58px] h-[32px] !text-[12px] !px-0">
              Fastest
            </Button>
          </div>
        </div>
        {tokens?.map((token: any, i: number) => (
          <Token
            key={token.address}
            token={token}
            i={i}
            onClick={(type: any) => {
              onOpenModal(type, token);
            }}
            userInfo={userData?.[token.address]}
            balance={balances?.[token.address]}
            balancesLoading={balancesLoading}
          />
        ))}
      </div>
    </>
  );
}
