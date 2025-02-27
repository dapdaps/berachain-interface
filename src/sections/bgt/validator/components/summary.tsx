import { useBgtStore } from '@/stores/bgt';
import Big from 'big.js';

const Summary = (props: any) => {
  const { vaults, pageData } = props;
  const store = useBgtStore()
  const validators = store?.validators ?? []
  const positionIndex = store?.validators?.findIndex(validator => validator?.pubkey === pageData?.pubkey)
  return (
    <div className="flex flex-col gap-[28px] md:gap-[21px] mt-[24px] md:mt-[33px] mb-[48px]">
      {/* <div className="flex items-center md:items-start">
        <div className="flex-1 flex flex-col gap-[10px]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Active Gauges Vaults</div>
          <div className="flex items-center gap-[6px]">
            <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">1</span>
            {
              vaults?.[0]?.metadata?.logoURI && (
                <div className="w-[30px] h-[30px]">
                  <img src={vaults?.[0]?.metadata?.logoURI} alt={vaults?.[0]?.metadata?.name} />
                </div>
              )
            }
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[10px]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Active Incentives</div>
          <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">-</span>
        </div>
      </div> */}
      <div className="flex items-center md:items-start md:flex-wrap md:gap-y-[21px]">
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Validator Ranking</div>
          <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{positionIndex + 1} of {validators?.length}</div>
        </div>
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Block Proposing Rate</div>
          <div className="flex items-center gap-[6px]">
            <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big(pageData?.blockProposingRate ?? 0).toFixed(2)}%</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Boost APY</div>
          <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">-</div>
        </div>
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Est. Return per BGT</div>
          <div className="flex items-center gap-[6px]">
            <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">0</span>
            <div className="w-[20px] h-[20px]">
              <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
