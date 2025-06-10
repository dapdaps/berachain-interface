import React, { useEffect } from "react";
import LazyImage from "@/components/layz-image";
import Skeleton from "react-loading-skeleton";
import { numberFormatter } from "@/utils/number-formatter";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";
import useUser from "@/hooks/use-user";
import useUserPoints from "@/hooks/use-user-points";
import Big from "big.js";

export default function UserCard({
  loading,
  totalBalance,
  type = "portfolio",
  setOpenUserPoints
}: any) {
  const modal = useConnectModal();
  const { address } = useAccount();
  const { accessToken, getUserInfo, userInfo } = useUser();
  const { loading: pointsLoading, userPoints = { points: 0 } } =
    useUserPoints();

  useEffect(() => {
    if (!accessToken) return;
    getUserInfo();
  }, [accessToken]);
  return (
    <div className="bg-[#FFDC50] py-[18px] pl-[25px] pr-[13px] rounded-[10px] flex items-center gap-[18px] mb-[32px] md:mb-0 md:rounded-t-[20px] md:rounded-b-none md:gap-[6px]">
      {type === "wallet" ? (
        !address || !userInfo.avatar ? (
          <div className="w-[85px] h-[85px] md:w-[46px] md:h-[46px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
        ) : (
          <div className="w-[85px] h-[85px] shrink-0 md:w-[46px] md:h-[46px]">
            <LazyImage
              src={userInfo.avatar}
              className="rounded-full shrink-0 "
            />
          </div>
        )
      ) : (
        <></>
      )}
      {!address ? (
        <button
          className="underline"
          type="button"
          onClick={() => {
            modal.openConnectModal?.();
          }}
        >
          Connect Wallet
        </button>
      ) : type === "wallet" ? (
        <>
          <div className="grow">
            <div className="font-CherryBomb text-black text-[32px] md:text-[20px] font-[400] mb-[6px] leading-none">
              @{userInfo.username || "beraman"}
            </div>
            <div
              className="text-[14px] text-[#3D405A] font-Montserrat"
              title={address}
            >
              {address ? address.slice(0, 6) + "..." + address.slice(-4) : ""}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="font-CherryBomb text-black text-[32px] md:text-[20px] font-[400] mb-[6px] leading-none">
              {loading ? (
                <Skeleton width={140} height={32} />
              ) : (
                numberFormatter(totalBalance, 2, true, { prefix: "$" })
              )}
            </div>
            <div className="text-[14px] text-[#3D405A] font-Montserrat text-center">
              Total assets
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex justify-between">
          <div>
            <h5 className="font-CherryBomb text-black text-center text-[32px] font-[400] leading-[95%]">
              {loading ? (
                <Skeleton width={140} height={30} />
              ) : (
                numberFormatter(totalBalance, 2, true, { prefix: "$" })
              )}
            </h5>
            <div className="text-[#3D405A] text-[14px] font-[500] text-center mt-[8px]">
              Total assetsss value
            </div>
          </div>
          <div
            className="flex flex-col items-center mr-[30px]"
            onClick={() => setOpenUserPoints(true)}
          >
            <div className="flex items-center gap-2">
              <img
                src="/db3/dapp/infrared.png"
                className="w-6 h-6 rounded-full mt-1"
                alt=""
              />
              <h5 className="font-CherryBomb underline text-black text-center text-[32px] font-[400] leading-[95%] cursor-pointer">
                {pointsLoading ? (
                  <Skeleton width={140} height={30} />
                ) : (
                  Big(userPoints?.points ?? 0).toFixed(0)
                )}
              </h5>
            </div>
            <div className="text-[#3D405A] text-[14px] font-[500] text-center mt-[8px]">
              Infrared Points
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
