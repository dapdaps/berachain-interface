'use client';
import PageBack from '@/components/back';
import BearBackground from '@/components/bear-background';
import DappIcon from '@/components/dapp-icon';
import { memo } from "react";
import BedrockContent from './Content/bedrock';
// import useIsMobile from "@/hooks/use-isMobile";
export default memo(function bedrock({ dapp }: any) {

  return (
    <BearBackground type='dapp'>
      <div className='p-[25px_35px] md:p-[20px_0]'>
        <PageBack className="md:absolute md:left-[12px] md:top-[17px]" />
        <div className="mt-[40px]">
          <div className="relative w-[970px] md:w-full mx-auto">
            <DappIcon
              src={dapp?.icon}
              alt={dapp?.name}
              name={dapp?.name}
              type={dapp?.type || 'Staking'}
              className="z-10 top-[-70px] md:left-[50%] md:translate-x-[-50%] md:top-[-40px]"
            />
            <BedrockContent dapp={dapp} />
          </div>
        </div>
      </div>
    </BearBackground>
  )
})
