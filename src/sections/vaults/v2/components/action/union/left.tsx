import clsx from 'clsx';
import ActionUnionPotions from '@/sections/vaults/v2/components/action/union/position';
import LazyImage from '@/components/layz-image';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';

const ActionUnionLeft = (props: any) => {
  const { className } = props;

  const { setCurrentProtocol, currentRecord, currentProtocol } = useVaultsV2Context();

  return (
    <div className={clsx("w-full bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[21px_22px_20px_13px]", className)}>
      <ActionUnionPotions />
      <div className="w-full pt-[19px]">
        <div className="text-[18px] font-Montserrat font-bold leading-[90%] text-black pl-[17px] pr-[2px]">
          Rewards
        </div>
        <div className="flex flex-col items-stretch gap-[4px] mt-[21px]">
          {
            currentRecord?.list?.map((protocol: any, index: number) => {
              const protocolSelected = protocol.backendId === currentProtocol?.backendId;

              return (
                <div
                  key={index}
                  className={clsx(
                    "flex items-center gap-[10px] justify-between py-[8px] pl-[17px] pr-[10px] rounded-[6px] transition duration-300 hover:bg-[rgba(0,0,0,0.06)]",
                    protocolSelected && "bg-[rgba(0,0,0,0.06)]"
                  )}
                  onClick={() => setCurrentProtocol(protocol)}
                >
                  <div className="flex items-center gap-[16px]">
                    <div className="flex items-center">
                      {
                        protocol?.reward_tokens?.map((token: any, idx: number) => (
                          <div key={idx} className="relative">
                            <LazyImage
                              src={token.icon}
                              containerClassName={clsx("!w-[34px] !h-[34px] rounded-[50%] overflow-hidden shrink-0", idx > 0 && "ml-[-10px]")}
                              fallbackSrc="/assets/tokens/default_icon.png"
                            />
                            <LazyImage
                              key={index}
                              src={protocol.creatorProtocolIcon}
                              containerClassName={clsx("!w-[17px] !h-[17px] overflow-hidden shrink-0 !absolute bottom-[0px] right-[-5px]")}
                              fallbackSrc="/assets/tokens/default_icon.png"
                            />
                          </div>
                        ))
                      }
                    </div>
                    <div className="text-black font-Montserrat text-[16px] font-[600] leading-[100%] flex flex-col gap-[4px]">
                      <div className="">
                        {protocol?.reward_tokens?.map((token: any, index: number) => token.symbol).join('-')}
                      </div>
                      <div className="text-black font-Montserrat text-[12px] font-[500] leading-[100%]">
                        {protocol?.creator_project}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={false}
                    className="flex justify-center items-center p-[4px] w-[24px] h-[24px] flex-shrink-0 rounded-full bg-white border border-black/30 disabled:!cursor-not-allowed disabled:opacity-30"
                  >
                    {
                      protocolSelected && (
                        <div className="w-full h-full rounded-full bg-[#FFDC50] border border-black/30"></div>
                      )
                    }
                  </button>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default ActionUnionLeft;
