import { useCallback, useMemo } from "react";
import { useRouter } from "next-nprogress-bar";
import RoundLabel from "../../components/round-label";
import useIsMobile from "@/hooks/use-isMobile";
import useData from "../../hooks/use-data";
import { format } from "date-fns";
import Token from "./token";

export default function Tokens({
  onOpenModal,
  tokens,
  userData,
  balances,
  balancesLoading
}: any) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { currentRound, historyRounds, nextRound } = useData();

  const handleVote = useCallback(() => {
    if (isMobile) {
      router.push("/meme/bros/vote");
    } else {
      onOpenModal(6);
    }
  }, [isMobile]);

  const [title, subTitle] = useMemo(() => {
    const _st = `${format(
      currentRound.start_time * 1000,
      "MMM.dd, yyyy"
    )} - ${format(currentRound.end_time * 1000, "MMM.dd, yyyy")}`;
    return [`Round ${currentRound.round}`, _st];
  }, [currentRound]);

  return (
    <>
      <div className="w-[1232px] mx-[auto] md:px-[14px] md:w-full">
        <div className="flex justify-between items-center md:absolute md:top-[-25px] md:justify-start md:gap-[8px] md:w-[calc(100%-28px)]">
          <RoundLabel
            title={title}
            subTitle={subTitle}
            className="w-[350px] md:w-full"
          />
          <div className="flex items-center gap-[16px] md:hidden">
            {!!historyRounds.length && (
              <button
                className="w-[137px] h-[48px] border border-black bg-[#FFDC50] rounded-[10px] font-semibold"
                onClick={() => {
                  router.push("/meme/bros/history");
                }}
              >
                History
              </button>
            )}
            {nextRound?.vote_status === "ongoing" && (
              <button
                className="w-[137px] h-[48px] border border-black bg-[#FFDC50] rounded-[10px] font-semibold leading-[16px]"
                onClick={handleVote}
              >
                Vote for the next round
              </button>
            )}
          </div>
          {/* <div className="rounded-[10px] w-[64px] h-[72px] border border-black bg-[#FFFDEB] p-[3px] hidden md:block">
            <Button
              type="primary"
              className="w-[58px] h-[32px] !text-[12px] !px-0"
            >
              Hotest
            </Button>
            <Button className="border-0 w-[58px] h-[32px] !text-[12px] !px-0">
              Fastest
            </Button>
          </div> */}
        </div>
        {tokens?.map((token: any, i: number) => (
          <Token
            key={token.token.address}
            token={token}
            i={i}
            onClick={(type: any) => {
              onOpenModal(type, token);
            }}
            userInfo={userData?.[token.token.address]}
            balance={balances?.[token.token.address]}
            balancesLoading={balancesLoading}
          />
        ))}
      </div>
    </>
  );
}
