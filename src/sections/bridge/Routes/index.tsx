import type { Chain, Token } from "@/types";
import Route from "./Route";
import { useMemo } from "react";

export default function Routes({ routes, fromChain, toToken, selectedRoute, setSelectedRoute, fromToken }: { routes: any[], fromChain: Chain, toToken: Token, selectedRoute: any, setSelectedRoute: (route: any) => void, fromToken?: Token }) {
    const routesByType = useMemo(() => {
        const grouped: { [key: string]: any[] } = {};
        routes.forEach((route: any) => {
            const type = route.bridgeType || 'default';
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type].push(route);
        });
        return grouped;
    }, [routes]);

    return <div className="border border-[#373A53] rounded-[12px] mt-[17px] px-[10px] route-wrapper">
        {
            routes.map((route: any, index) => {
                const bridgeType = route.bridgeType || 'default';
                
                return (
                    <Route
                        checked={selectedRoute === route}
                        key={route.bridgeType + index}
                        name={route.bridgeName}
                        toToken={toToken}
                        fee={route.fee}
                        receiveAmount={route.receiveAmount}
                        fromChain={fromChain}
                        fromToken={fromToken}
                        icon={route.icon}
                        duration={route.duration}
                        feeType={route.feeType}
                        route={route.route}
                        priceImpact={route.priceImpact}
                        priceImpactType={route.priceImpactType}
                        minimumReceived={route.minimumReceived}
                        onChange={() => {
                            setSelectedRoute(route)
                        }}
                    />
                );
            })
        }
    </div>
}