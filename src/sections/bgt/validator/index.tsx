import useIsMobile from '@/hooks/use-isMobile';
import BgtValidatorMobile from '@/sections/bgt/validator/mobile';
import BgtValidatorLaptop from '@/sections/bgt/validator/laptop';
import useValidator from '@/hooks/use-validator';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBGT } from '@/hooks/use-bgt';
import useValidatorVaults from '@/hooks/use-validator-vaults';
import { VALIDATORS } from '@/sections/bgt/config';
import { OperationTypeType, ValidatorType } from '@/sections/bgt/types';
import { Column } from '@/components/flex-table';
import Delegate from '@/sections/bgt/components/delegate';
import { getProtocolIcon } from '@/utils/utils';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';

const BgtValidator = (props: any) => {
  const { id } = props;

  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const {
    data: bgtData,
  } = useBGT();

  // const {
  //   loading: vaultsLoading,
  //   vaults,
  //   getVaults
  // } = useValidatorVaults();
  const {
    loading,
    pageData,
    getPageData
  } = useValidator();

  const defaultId = searchParams.get("id");
  const [currentTab, setCurrentTab] = useState("gauges");
  const [validatorId, setValidatorId] = useState(defaultId);
  const [visible, setVisible] = useState(false);

  const [operationType, setOperationType] = useState<OperationTypeType>("delegate");
  const Tabs: any = [
    { value: "gauges", label: "Gauges" },
    { value: "incentives", label: "Incentives" },
  ];
  const Columns: Column[] = useMemo(() => {
    return [
      {
        title: "Reward Vaults",
        dataIndex: "vaults",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          const receivingVault = record?.receivingVault

          return (
            <div className="flex items-center gap-[16px]">
              <div className="relative">
                <div className="w-[30px] h-[30px]">
                  {
                    receivingVault?.metadata?.logoURI && (
                      <img src={receivingVault?.metadata?.logoURI} alt={receivingVault?.metadata?.name} />
                    )
                  }
                </div>
                <div className="absolute right-[-7px] bottom-[-1px] w-[16px] h-[16px]">
                  <img src={getProtocolIcon(receivingVault?.metadata?.protocolName)} alt={receivingVault?.metadata?.protocolName} />
                </div>
              </div>
              <div className="flex flex-col gap-[5px]">
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{receivingVault?.metadata?.name}</div>
                <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">{receivingVault?.metadata?.protocolName}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: "BGT Per Proposal",
        dataIndex: "incentive",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(Big(pageData?.dynamicData?.rewardRate ?? 0).times(Big(record?.percentageNumerator ?? 0).div(10000)).toFixed(), '', 2)} BGT</div>;
        },
      },
      {
        title: "Total Incentive Value",
        dataIndex: "proposal",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(record?.receivingVault?.dynamicData?.activeIncentivesValueUsd ?? 0, "$", 2, false, false)}</div>;
        },
      },
      {
        title: "Incentives",
        dataIndex: "incentives",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">No Incentives</div>;
        },
      },
    ]
  }, [currentTab, pageData]);

  const handleClose = () => {
    setVisible(false)
  };
  const handleClick = (type: any) => {
    setVisible(true)
    setOperationType(type)
  };

  useEffect(() => {
    if (validatorId) {
      getPageData(validatorId);
    }
  }, [validatorId]);

  useEffect(() => {

    console.log('========id', id)
    if (id) {
      setValidatorId(id);
    } else {
      setValidatorId(defaultId);
    }
  }, [defaultId, id]);

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
        />
      )}
      <Delegate
        visible={visible}
        validator={pageData as any}
        operationType={operationType}
        onClose={handleClose}
        onValidatorSelect={(value: any) => {
          setValidatorId(value);
        }}
      />
    </>
  );
};

export default BgtValidator;
