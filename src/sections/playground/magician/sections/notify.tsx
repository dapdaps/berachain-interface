import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useRequest } from "ahooks";
import Big from "big.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Notify = (props: any) => {
  const { open } = props;

  if (!document || !open) {
    return null;
  }

  return ReactDOM.createPortal((
    <NotifyContent  {...props} />
  ), document.body);
};

export default Notify;

const NotifyContent = (props: any) => {
  const { } = props;

  const { accountWithAk } = useCustomAccount();

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { data: userLatest, loading: userLatestLoading, runAsync: getUserLatest } = useRequest(async () => {
    if (!accountWithAk) {
      return;
    }
    try {
      const res = await get("/api/go/game/rps/user/latest");
      if (res.code !== 200) {
        return;
      }
      return res.data;
    } catch (error) {
      console.log("get user latest failed: %o", error);
    }
    return;
  }, {
    refreshDeps: [accountWithAk],
  });

  console.log("userLatest: %o", userLatest);

  return (
    <motion.div
      className="w-[342px] h-[350px] pt-[78px] fixed z-[14] right-0 bottom-[13px] bg-[url('/images/playground/magician/bg-notify.png')] bg-right bg-no-repeat bg-contain"
      style={windowWidth < 1560 ? {
        x: 250,
      } : {
        x: 0
      }}
      whileHover={{
        x: 0
      }}
    >
      {/* bg-[linear-gradient(180deg,#FFDF77_0%,#F6AD0F_100%)] [background-clip:text] [-webkit-text-fill-color:transparent] */}
      <div className="font-CherryBomb text-[#FFDF77] text-center text-[30px] font-[400] leading-[100%] [-webkit-text-stroke-width:3px] [-webkit-text-stroke-color:#4B371F] [text-shadow:-1px_3px_0_#4B371F]">
        {Big(userLatest?.length || 0).gt(3) ? "3+" : userLatest?.length} Joining
      </div>
    </motion.div>
  );
};
