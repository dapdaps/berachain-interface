import type { Chain, Token } from "@/types";
import Route from "./Route";

export default function Routes({ routes, fromChain, toToken, selectedRoute, setSelectedRoute }: { routes: any[], fromChain: Chain, toToken: Token, selectedRoute: any, setSelectedRoute: (route: any) => void }) {
    return <div className="border border-[#373A53] rounded-[12px] mt-[17px] px-[10px] route-wrapper">
        {
            routes.map((route: any, index) => (
                <Route
                    checked={selectedRoute === route}
                    key={route.bridgeName}
                    name={route.bridgeName}
                    toToken={toToken}
                    fee={route.fee}
                    receiveAmount={route.receiveAmount}
                    fromChain={fromChain} 
                    onChange={() => {
                        setSelectedRoute(route)
                    }}
                />
            ))
        }
    </div>
}