import type { Chain, Token } from "@/types";
import Route from "./Route";
import { useEffect, useMemo, useState } from "react";

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

    const [expandedRouteIndex, setExpandedRouteIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedRoute && routes.length > 0) {
            const selectedIndex = routes.findIndex((route: any) => route === selectedRoute);
            if (selectedIndex !== -1) {
                setExpandedRouteIndex(selectedIndex);
            }
        }
    }, [routes, selectedRoute]);

    return <div className="border border-[#373A53] rounded-[12px] mt-[17px] px-[10px] route-wrapper">
        {
            routes.map((route: any, index) => {
                const bridgeType = route.bridgeType || 'default';
                const isExpanded = expandedRouteIndex === index;
                
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
                        isExpanded={isExpanded}
                        onExpandToggle={() => {
                            setExpandedRouteIndex(isExpanded ? null : index);
                        }}
                        onChange={() => {
                            setSelectedRoute(route)
                        }}
                    />
                );
            })
        }
    </div>
}