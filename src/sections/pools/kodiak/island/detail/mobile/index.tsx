import ReactDOM from "react-dom";
import Header from "./header";
import Loading from "@/components/loading";
import Actions from "../actions";
import Mydeposit from "../my-deposit";
import Earn from "../earn";
import MigrateAutoCompound from "../migrate-auto-compound";

export default function Mobile({
  onBack = () => {},
  data,
  info,
  loading,
  onSuccess,
  dapp
}: any) {
  return ReactDOM.createPortal(
    <div className="w-full h-full z-[55] fixed top-0 left-0 bg-[#96D6FF] overflow-y-auto">
      <div className="p-[15px]">
        <Header data={data} onBack={onBack} />
        {loading ? (
          <div className="flex justify-center mt-[100px]">
            <Loading size={40} />
          </div>
        ) : (
          <>
            <Actions data={data} info={info} onSuccess={onSuccess} dapp={dapp} />
            <Mydeposit
              info={info}
              token0={data.token0}
              token1={data.token1}
              symbol={data.symbol}
            />
            <MigrateAutoCompound data={data} info={info} onSuccess={onSuccess} dapp={dapp} />
            <Earn
              earned={info?.earned}
              rewardToken={info?.rewardToken}
              onSuccess={onSuccess}
              farm={data.farm}
            />
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
