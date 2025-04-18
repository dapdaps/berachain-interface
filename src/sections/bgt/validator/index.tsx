import { Column } from '@/components/flex-table';
import { bera } from '@/configs/tokens/bera';
import { useBGT } from '@/hooks/use-bgt';
import useIsMobile from '@/hooks/use-isMobile';
import useValidator from '@/hooks/use-validator';
import Delegate from '@/sections/bgt/components/delegate';
import useValidators from '@/sections/bgt/components/delegate/hooks/use-validators';
import { OperationTypeType } from '@/sections/bgt/types';
import BgtValidatorLaptop from '@/sections/bgt/validator/laptop';
import BgtValidatorMobile from '@/sections/bgt/validator/mobile';
import { formatValueDecimal } from '@/utils/balance';
import { formatLongText, getProtocolIcon } from '@/utils/utils';
import Big from 'big.js';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useIncentive } from '@/sections/bgt/validator/hooks/use-incentive';
import { useCurrentValidator } from '@/sections/bgt/validator/hooks/use-current-validator';

const BgtValidator = (props: any) => {
  const { id } = props;

  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { data: bgtData } = useBGT();

  const { getValidators } = useValidators();
  const { loading, pageData, getPageData } = useValidator();
  const { estReturnPerBGT, list: incentiveList } = useIncentive({
    // @ts-ignore
    vaults: pageData?.rewardAllocationWeights ?? []
  });
  const { currentValidator, currentValidatorLoading } = useCurrentValidator();

  const defaultId = searchParams.get("id");
  const [currentTab, setCurrentTab] = useState("gauges");
  const [validatorId, setValidatorId] = useState(defaultId);
  const [visible, setVisible] = useState(false);

  const [operationType, setOperationType] =
    useState<OperationTypeType>("delegate");
  const Tabs: any = [
    { value: "gauges", label: "Gauges" },
    { value: "incentives", label: "Incentives" }
  ];
  const Columns: Column[] = useMemo(() => {
    return [
      {
        title: "Reward Vaults",
        dataIndex: "vaults",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          const receivingVault = record?.receivingVault;

          return (
            <div className="flex items-center gap-[16px]">
              <div className="relative">
                <div className="w-[30px] h-[30px]">
                  <img
                    src={receivingVault?.metadata?.logoURI ?? "/images/bgt-logo.svg"}
                    alt={receivingVault?.metadata?.name}
                  />
                </div>
                <div className="absolute right-[-7px] bottom-[-1px] w-[16px] h-[16px]">
                  <img
                    src={getProtocolIcon(
                      receivingVault?.metadata?.protocolName
                    )}
                    alt={receivingVault?.metadata?.protocolName}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[5px]">
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
                  {receivingVault?.metadata?.name ? receivingVault?.metadata?.name : formatLongText(receivingVault?.id, 4, 4)}
                </div>
                <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">
                  {receivingVault?.metadata?.protocolName ?? "OTHER"}
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: "BGT Per Proposal",
        dataIndex: "incentive",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return (
            <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
              {formatValueDecimal(
                Big(pageData?.dynamicData?.rewardRate ?? 0)
                  .times(Big(record?.percentageNumerator ?? 0).div(10000))
                  ?.toFixed(),
                "",
                2
              )}{" "}
              BGT
            </div>
          );
        }
      },
      {
        title: "Total Incentive Value",
        dataIndex: "proposal",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return (
            <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
              {formatValueDecimal(
                record?.receivingVault?.dynamicData?.activeIncentivesValueUsd ??
                0,
                "$",
                2,
                false,
                false
              )}
            </div>
          );
        }
      },
      {
        title: "Incentives",
        dataIndex: "incentives",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          const incentives = record?.receivingVault?.activeIncentives?.reduce((acc, curr) => {
            if (!acc.find((incentive) => incentive?.token?.symbol === curr?.token?.symbol)) acc.push(curr);
            return acc
          }, [])
          return incentives?.length > 0 ? (
            <div className="flex items-center">
              {
                incentives?.map((incentive, index) => (
                  <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full ml-[-5px] overflow-hidden bg-[#1f1c19] text-[#eae8e6] text-[8px] font-medium">
                    {
                      bera[incentive?.token?.symbol?.toLocaleLowerCase()]?.icon ? (
                        <img src={bera[incentive?.token?.symbol?.toLocaleLowerCase()]?.icon} alt={incentive?.token?.symbol} />
                      ) : (
                        <span>{incentive?.token?.symbol}</span>
                      )
                    }
                  </div>
                ))
              }
            </div>
          ) : <div>No Incentives</div>;
        },
      },
    ]
  }, [currentTab, pageData]);

  const handleClose = () => {
    setVisible(false);
  };
  const handleClick = (type: any) => {
    setVisible(true);
    setOperationType(type);
  };

  useEffect(() => {
    if (validatorId) {
      getPageData(validatorId);
    }
  }, [validatorId]);

  useEffect(() => {
    if (id) {
      setValidatorId(id);
    } else {
      setValidatorId(defaultId);
    }
  }, [defaultId, id]);

  useEffect(() => {
    getValidators();
  }, []);

  return (
    <>
      {isMobile ? (
        <BgtValidatorMobile
          {...props}
          bgtData={bgtData}
          pageData={pageData}
          handleClick={handleClick}
          currentTab={currentTab}
          Tabs={Tabs}
          setCurrentTab={setCurrentTab}
          loading={loading}
          Columns={Columns}
          vaults={pageData?.rewardAllocationWeights ?? []}
          estReturnPerBGT={estReturnPerBGT}
          incentiveList={incentiveList}
          currentValidator={currentValidator}
          currentValidatorLoading={currentValidatorLoading}
        />
      ) : (
        <BgtValidatorLaptop
          {...props}
          bgtData={bgtData}
          pageData={pageData}
          handleClick={handleClick}
          currentTab={currentTab}
          Tabs={Tabs}
          setCurrentTab={setCurrentTab}
          loading={loading}
          Columns={Columns}
          vaults={pageData?.rewardAllocationWeights ?? []}
          estReturnPerBGT={estReturnPerBGT}
          incentiveList={incentiveList}
          currentValidator={currentValidator}
          currentValidatorLoading={currentValidatorLoading}
        />
      )}
      <Delegate
        visible={visible}
        validator={pageData as any}
        operationType={operationType}
        onClose={handleClose}
        onValidatorSelect={(value: any) => {
          setValidatorId(value?.id);
        }}
      />
    </>
  );
};

export default BgtValidator;
