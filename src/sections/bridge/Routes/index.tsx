import { Chain } from "viem/chains";
import Route from "./Route";

export default function Routes({ route, fromChain }: { route: { receiveAmount: string, fee: string }[], fromChain: Chain}) {
    return <div className="border border-[#373A53] rounded-[12px] mt-[17px] px-[10px] route-wrapper">
        <Route name="Stargate" fee={route[0].fee} receiveAmount={route[0].receiveAmount} fromChain={fromChain}  />
        {/* <Route name="Owlto"/> */}
    </div>
}