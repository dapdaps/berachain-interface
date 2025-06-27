import Header from "./header";
import Mydeposit from "../my-deposit";
import Earn from "../earn";
import Actions from "../actions";
import Loading from "@/components/loading";

export default function Laptop({
  onBack = () => { },
  data,
  info,
  loading,
  onSuccess,
  dapp
}: any) {

  return (
    <div className="h-[calc(100vh-380px)] overflow-y-auto">
      <Header data={data} onBack={onBack} />
      {loading ? (
        <div className="flex justify-center mt-[100px]">
          <Loading size={40} />
        </div>
      ) : (
        <div className="flex justify-between items-start mt-[16px]">
          <div>
            <Mydeposit
              info={info}
              token0={data.token0}
              token1={data.token1}
              symbol={data.symbol}
            />
            {data.farm && (
              <Earn
                earned={info?.earned}
                rewardToken={info?.rewardToken}
                onSuccess={onSuccess}
                farm={data.farm}
              />
            )}
          </div>
          <Actions data={data} info={info} onSuccess={onSuccess} dapp={dapp} />
        </div>
      )}
    </div>
  );
}
