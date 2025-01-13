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

const BgtValidator = (props: any) => {
  const { id } = props;

  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const {
    data: bgtData,
  } = useBGT();

  const {
    loading: vaultsLoading,
    vaults,
    getVaults
  } = useValidatorVaults();
  const {
    loading: validatorLoading,
    pageData,
    getPageData
  } = useValidator();

  const defaultAddress = searchParams.get("address");
  const [currentTab, setCurrentTab] = useState("gauges");
  const [address, setAddress] = useState(defaultAddress);
  const [visible, setVisible] = useState(false);
  const validator = useMemo(() => VALIDATORS.find((validator: ValidatorType) => validator?.address === address), [address]);

  const [operationType, setOperationType] = useState<OperationTypeType>("delegate");
  const Tabs: any = [
    { value: "gauges", label: "Gauges" },
    { value: "incentives", label: "Incentives" },
  ];
  const Columns: Column[] = useMemo(() => {
    return [
      {
        title: "Gauge Vaults",
        dataIndex: "vaults",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return (
            <div className="flex items-center gap-[16px]">
              <div className="relative">
                <div className="w-[30px] h-[30px]">
                  {
                    record?.metadata?.logoURI && (
                      <img src={record?.metadata?.logoURI} alt={record?.metadata?.name} />
                    )
                  }
                </div>
                <div className="absolute right-[-7px] bottom-[-1px] w-[16px] h-[16px]">
                  <img src={record?.metadata?.productMetadata?.logoURI} alt={record?.metadata?.productMetadata?.name} />
                </div>
              </div>
              <div className="flex flex-col gap-[5px]">
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{record?.metadata?.name}</div>
                <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">{record?.metadata?.product}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: currentTab === "gauges" ? "Total Incentive Value" : "Incentive Breakdown",
        dataIndex: "incentive",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{record?.amountStaked}</div>;
        },
      },
      {
        title: currentTab === "gauges" ? "BGT per Proposal" : "Incentive Rate",
        dataIndex: "proposal",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{record?.amountStaked} BGT</div>;
        },
      },
      {
        title: currentTab === "gauges" ? "Incentives" : "Amount Left",
        dataIndex: "incentives",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">-</div>;
        },
      },
    ]
  }, [currentTab]);

  const handleClose = () => {
    setVisible(false)
  };
  const handleClick = (type: any) => {
    setVisible(true)
    setOperationType(type)
  };

  useEffect(() => {
    if (address) {
      getPageData(address);
      getVaults(address);
    }
  }, [address]);

  useEffect(() => {
    if (id) {
      setAddress(id);
    } else {
      setAddress(defaultAddress);
    }
  }, [defaultAddress, id]);

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
          vaultsLoading={vaultsLoading}
          Columns={Columns}
          vaults={vaults}
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
          vaultsLoading={vaultsLoading}
          Columns={Columns}
          vaults={vaults}
        />
      )}
      <Delegate
        visible={visible}
        validator={validator as any}
        operationType={operationType}
        onClose={handleClose}
        onAddressSelect={(value: any) => {
          setAddress(value);
        }}
      />
    </>
  );
};

export default BgtValidator;
