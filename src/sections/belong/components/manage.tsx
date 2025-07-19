import clsx from "clsx";
import { Form as BeraborrowForm } from "@/sections/Lending/Beraborrow/form";
import useIsMobile from "@/hooks/use-isMobile";
import { ActionText } from "@/sections/Lending/hooks/use-beraborrow";
import { useBelongContext } from "../context";

const Manage = (props: any) => {
  const { className } = props;

  const isMobile = useIsMobile();
  const {
    currentMarketData,
    dataLoading,
    setDataLoading,
    config,
  } = useBelongContext();

  if (!currentMarketData) return null;

  return (
    <div className={clsx("w-full", className)}>
      <BeraborrowForm
        isBelong
        loading={dataLoading}
        type={ActionText.Repay}
        market={currentMarketData}
        borrowToken={config.borrowToken}
        basic={config.basic}
        networks={config.networks}
        network={config}
        isMobile={isMobile}
        onSuccess={() => {
          setDataLoading(true);
        }}
        {...config}
      />
    </div>
  );
};

export default Manage;
