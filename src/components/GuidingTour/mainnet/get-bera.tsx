import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';
import Title from '@/components/GuidingTour/mainnet/components/title';
import Article from '@/components/GuidingTour/mainnet/components/article';
import useIsMobile from '@/hooks/use-isMobile';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useContext } from 'react';
import { GuidingTourContext } from './context';

const GetBera = (props: any) => {
  const { onClose } = props;
  const isMobile = useIsMobile();
  const { handlePrize, prizing } = useContext(GuidingTourContext);

  const { getBeraVisible, setGetBeraVisible, setChoosePillVisible, setDoneVisible } = useGuidingTour();

  const handleBack = () => {
    setGetBeraVisible(false);
    setChoosePillVisible(true);
  };

  const handleNext = () => {
    setGetBeraVisible(false);
    setDoneVisible(true);
  };

  return (
    <Modal
      open={getBeraVisible}
      onClose={handleBack}
      isMaskClose={false}
    >
      <Card className="w-[1024px] md:w-full p-[39px_20px_46px_57px] md:p-[30px_20px_30px_20px]">
        <Title className="text-center">
          Get $BERA for gas fees
        </Title>
        <div className="flex justify-between items-stretch mt-[75px] md:mt-[20px] md:flex-col md:h-[60dvh] md:overflow-y-auto md:items-center md:gap-[20px]">
          <div className="flex-1 pr-[32px]">
            <Title className="!font-CherryBomb md:!text-[20px]">
              Method 1
            </Title>
            <Article className="mt-[22px] md:mt-[10px]">
              <span className="text-[20px] font-CherryBomb">Step 1: </span>Buy $BERA from the following CEXs
            </Article>
            <div className="flex items-center gap-[5px] mt-[19px] md:mt-[10px]">
              {
                [
                  {
                    icon: '/images/guiding-tour/cex-1.svg',
                    link: 'https://www.gate.io/trade/BERA_USDT'
                  },
                  {
                    icon: '/images/guiding-tour/cex-2.svg', 
                    link: 'https://www.coinbase.com/price/bera'
                  },
                  {
                    icon: '/images/guiding-tour/cex-3.svg',
                    link: 'https://www.kucoin.com/trade/BERA-USDT'
                  },
                  {
                    icon: '/images/guiding-tour/cex-4.svg',
                    link: 'https://www.kraken.com/prices/near-protocol'
                  },
                  {
                    icon: '/images/guiding-tour/cex-5.svg',
                    link: 'https://www.bybit.com/en/trade/spot/NEAR/USDT'
                  },
                  {
                    icon: '/images/guiding-tour/cex-6.svg',
                    link: 'https://crypto.com/price/near-protocol'
                  }
                ].map((it, idx) => (
                  <a 
                    key={idx} 
                    href={it.link} 
                    target="_blank" 
                    rel="nofollow"
                  >
                    <img src={it.icon} alt="" className="w-[40px] h-[40px] shrink-0" />
                  </a>
                ))
              }
            </div>
            <Article className="mt-[51px] md:mt-[10px]">
              <span className="text-[20px] font-CherryBomb">Step 2: </span>Withdraw to your own wallet
            </Article>
          </div>
          <div className="shrink-0 w-[7px] h-[289px] md:w-full md:h-[9px] bg-[url('/images/guiding-tour/line-1.svg')] md:bg-[url('/images/guiding-tour/line-3.svg')] bg-no-repeat bg-center bg-contain"></div>
          <div className="flex-1 pl-[51px] md:pl-0 pr-[18px]">
            <Title className="!font-CherryBomb md:!text-[20px]">
              Method 2
            </Title>
            <Article className="mt-[19px] md:mt-[10px]">
              Bridge & convert assets directly to $BERA from other blockchains
            </Article>
            <img src="/images/guiding-tour/bridge.svg" alt="" className="w-[154px] h-[143px] mx-auto mt-[40px]" />
          </div>
          <div className="shrink-0 w-[10px] h-[279px] md:w-full md:h-[10px] bg-[url('/images/guiding-tour/line-2.svg')] md:bg-[url('/images/guiding-tour/line-4.svg')] bg-no-repeat bg-center bg-contain"></div>
          <div className="flex-1 pl-[46px] md:pl-0">
            <Title className="!font-CherryBomb md:!text-[20px]">
              Method 3
            </Title>
            <Article className="mt-[19px] md:mt-[10px]">
              Ask your bera frens to send you some $BERA for gas fees
            </Article>
            <Article className="mt-[19px]">
              Don't have any bera frens?
            </Article>
            <Article className="mt-[19px]">
              Join McBera Discord / Telegram and bera frens there will help you out!
            </Article>
            <div className="flex items-center gap-[24px] md:gap-[10px] mt-[20px]">
              <a href="https://t.me/DapDapDiscussion" target="_blank">
                <img src="/images/guiding-tour/telegram.svg" alt="" className="w-[56px] h-[56px] md:w-[40px] md:h-[40px]" />
              </a>
              <a href="https://discord.com/invite/dapdap" target="_blank">
                <img src="/images/guiding-tour/discord.svg" alt="" className="w-[56px] h-[56px] md:w-[40px] md:h-[40px]" />
              </a>
            </div>
          </div>
        </div>
        {
          isMobile && (
            <Foot
              handleNext={() => handlePrize(handleNext)}
              loading={prizing}
            />
          )
        }
      </Card>
      {
        !isMobile && (
          <Foot
            handleNext={() => handlePrize(handleNext)}
            loading={prizing}
          />
        )
      }
    </Modal>
  );
};

export default GetBera;

const Foot = (props: any) => {
  const { handleNext, loading } = props;

  const { address } = useAccount();
  const modal = useConnectModal();

  return (
    <div className="flex justify-center items-center mt-[24px]">
      <Button
        type={ButtonType.Primary}
        className="w-[354px]"
        onClick={() => {
          if (!address) {
            modal.openConnectModal?.();
            return;
          }
          handleNext();
        }}
        loading={loading}
        disabled={loading}
      >
        {address ? 'I\'m all set!' : 'Connect Wallet'}
      </Button>
    </div>
  );
};
