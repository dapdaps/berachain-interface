"use client";

import React from "react";
import cn from 'clsx';
import { useAccount, useConnectorClient, useSimulateContract } from "wagmi";
import { LoadingSpinner } from "../loading-spinner";
import {
  CheckIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { SlideUpWrapper } from "@/components/animation";
import { AnimatePresence } from "framer-motion";
import { WarningBox } from "../warning-box";

export const AlertLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <WarningBox
      className={className}
      text="Exit market script is empty and this could lead to AP's assets being lost. Please make sure that this is the intended behavior that you want."
    />
  );
});

// export const SimulationBox = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & {
//     enabled: boolean;
//     simulateContractOptions: any;
//     successMessage: string;
//     errorMessage: string;
//     infoMessage: string;
//   }
// >(
//   (
//     {
//       className,
//       enabled,
//       successMessage,
//       errorMessage,
//       infoMessage,
//       simulateContractOptions,
//       ...props
//     },
//     ref
//   ) => {
//     const { data: clientConnector } = useConnectorClient();
//     const { address } = useAccount();

//     const { isLoading: isLoadingSimulation, status: statusSimulation } =
//       useSimulateContract({
//         enabled: enabled,
//         ...simulateContractOptions,
//         account: address,
//         connector: clientConnector,
//       });

//     return (
//       <div
//         ref={ref}
//         className={cn(
//           "flex w-full flex-row place-content-center items-center rounded-xl border border-divider bg-z2 p-5",
//           className
//         )}
//         {...props}
//       >
//         <AnimatePresence mode="popLayout">
//           {isLoadingSimulation && (
//             <SlideUpWrapper key="market-deployment:loading">
//               <LoadingSpinner className="h-5 w-5 shrink-0" />
//             </SlideUpWrapper>
//           )}

//           {!isLoadingSimulation && (
//             <SlideUpWrapper key="market-deployment:message">
//               <AlertLabel
//                 type={
//                   address
//                     ? statusSimulation === "success"
//                       ? "success"
//                       : "error"
//                     : "info"
//                 }
//                 message={
//                   address
//                     ? statusSimulation === "success"
//                       ? successMessage
//                       : errorMessage
//                     : infoMessage
//                 }
//               />
//             </SlideUpWrapper>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   }
// );
