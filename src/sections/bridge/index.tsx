import { useEffect, useMemo, useState } from 'react';

import chains from './lib/util/chainConfig'
import Card from '@/components/card';
import TokenAmout from './TokenAmount';
import Routes from './Routes';
import SubmitBtn from './SubmitBtn';
import Confirm from './Confrim';

import PageBack from '@/components/back';
import useIsMobile from '@/hooks/use-isMobile';
import MenuButton from '@/components/mobile/menuButton';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import History from './History';
// import useQuote from './Hooks/Stargate/useQoute';
// import useBridge from './Hooks/Stargate/useBridge';
import Big from 'big.js';
import { useAccount, useSwitchChain } from "wagmi";
import { formatLongText } from '@/utils/utils';
import allTokens from './lib/allTokens'
import { tokenPairs } from './lib/bridges/stargate/config';
import useAddAction from '@/hooks/use-add-action';
import { useBridgeHistory } from '@/stores/useBridgeHistory';
import useBridge from './Hooks/useBridge';

import type { Token, Chain } from '@/types';
import type { engineType } from './lib/type';
import useBridgeType from './Hooks/useBridgeType';
import clsx from 'clsx';
import { useActivityStore } from '@/stores/useActivityStore';
const DappHeader: React.FC = () => {
  const { dapp: dappName } = useParams();
  const isMobile = useIsMobile();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (dappName) {
    return (
      <div className="flex gap-2 my-[30px] w-full justify-center items-center">
        <img
          src={`/images/dapps/${(dappName as string).toLowerCase()}.png`}
          alt={dappName as string}
          className="w-9 h-9"
        />
        <span className="font-CherryBomb text-xl text-black">
          {capitalize(dappName as string)}
        </span>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="relative left-[25%] mt-7 top-5">
          <MenuButton className="w-[51.282vw]">Bridge</MenuButton>
        </div>
      ) : (
        <div className="text-[60px] text-center py-[30px] font-CherryBomb">
          Bridge
        </div>
      )}
    </>
  );
};

const ComingSoon = false;
const chainList = Object.values(chains).filter((chain) => [1, 80094, 42161, 8453, 56, 43114, 59144, 5000, 10, 137, 534352].includes(chain.chainId));


export default function Bridge() {
  const { dapp: dappName } = useParams();
  const searchParams = useSearchParams();
  const [confirmShow, setConfirmShow] = useState(false);
  const [historyShow, setHistoryShow] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const isMobile = useIsMobile()
  const { switchChain } = useSwitchChain();
  const { addAction } = useAddAction("bridge");
  const { address, chainId } = useAccount()
  const [limitBera, setLimitBera] = useState(0)
  const router = useRouter()
  const { bridgeType } = useBridgeType()

  const { isDefaultTheme } = useActivityStore()

  const {
    fromChain,
    setFromChain,
    toChain,
    setToChain,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    sendAmount,
    onSendAmountChange,
    setSelectedRoute,
    updateBanlance,
    reciveAmount,
    identification,
    routeSortType,
    sendDisabled,
    disableText,
    sendLoading,
    quoteLoading,
    selectedRoute,
    routes,
    executeRoute,
  } = useBridge({
    originFromChain: chains[1],
    originToChain: chains[80094],
    derection: 1,
    account: address,
    defaultBridgeText: 'Bridge',
    tool: bridgeType
  })

  const _allTokens = useMemo(() => {
    if (!fromToken || bridgeType !== 'stargate') {
      return allTokens
    }

    const newAllTokens: any = {}
    Object.keys(allTokens).map((key: any) => {
      newAllTokens[key] = allTokens[key].filter((token: Token) => {
        let symbol = token.symbol.toUpperCase()
        if ([5000, 43114, 56].includes(Number(token.chainId)) && fromToken.symbol.toUpperCase() === 'WETH' && token.symbol.toUpperCase() === 'WETH') {
          symbol = 'ETH'
        }
        return tokenPairs[fromChain.chainId][fromToken.symbol.toUpperCase()] === symbol
      })
    });

    return newAllTokens;
  }, [fromToken, fromChain, bridgeType])

  useEffect(() => {
    if (bridgeType !== 'stargate') {
      return;
    }

    if (!fromToken) {
      setToToken(undefined)
      return
    }
    const tokenPair = tokenPairs[fromChain.chainId][fromToken?.symbol.toUpperCase()]
    if (tokenPair) {
      const token = allTokens[toChain.chainId].find((token: Token) => token.symbol.toUpperCase() === tokenPair) as Token
      if (tokenPairs[toChain.chainId][tokenPair]) {
        setToToken(token)
      } else {
        setToToken(undefined)
      }
    } else {
      setToToken(undefined)
    }
  }, [fromChain, fromToken, bridgeType])

  useEffect(() => {
    const fromToken = searchParams.get('fromToken')
    const toToken = searchParams.get('toToken')
    const fromTokens = allTokens[1]
    const toTokens = allTokens[80094]

    if (fromToken && toToken) {
      setFromToken(fromTokens.find((token: Token) => token.symbol.toUpperCase() === fromToken.toUpperCase()))
      setToToken(toTokens.find((token: Token) => token.symbol.toUpperCase() === toToken.toUpperCase()))
    } else {
      const fromToken = fromTokens.find((token: Token) => token.symbol.toUpperCase() === 'ETH')
      const toToken = toTokens.find((token: Token) => token.symbol.toUpperCase() === 'WETH')
      setFromToken(fromToken)
      setToToken(toToken)
    }
  }, [searchParams])

  return (
    <>
      <div className='h-full overflow-auto'>
        {!isMobile ? <PageBack className="ml-[30px] absolute top-[20px] left-[30px] z-10" /> : null}
        {isMobile ? null : <div className='absolute left-[36px] md:left-[15px] top-[31px] md:top-[14px] z-[12]' />}
        <div className='lg:w-[520px] md:w-[92.307vw] m-auto relative z-10 '>
          <DappHeader />
          <Card>
            <TokenAmout
              isDest={false}
              allTokens={allTokens}
              limitBera={limitBera === 1}
              chain={fromChain}
              token={fromToken ?? null}
              amount={sendAmount}
              onAmountChange={(v: string) => {
                onSendAmountChange(v)
              }}
              chainList={chainList}
              onChainChange={(chain: Chain) => {
                setFromChain(chain)
              }}
              onTokenChange={(token: Token) => {
                setFromToken(token)
              }}
              comingSoon={ComingSoon}
            />
            <div className='h-[8px] md:h-4 flex justify-center items-center' onClick={() => {
              const [_fromChain, _toChain] = [toChain, fromChain]
              const [_fromToken, _toToken] = [toToken, fromToken]
              setFromChain(_fromChain)
              setToChain(_toChain)
              setFromToken(_fromToken)
              setToToken(_toToken)
              setLimitBera(limitBera === 0 ? 1 : 0)
            }}>
              <svg
                className='cursor-pointer'
                width='42'
                height='42'
                viewBox='0 0 42 42'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect
                  x='2'
                  y='2'
                  width='38'
                  height='38'
                  rx='10'
                  fill='#BC9549'
                  stroke='#FFFDEB'
                  stroke-width='4'
                />
                <path
                  d='M21.4999 16V26.5M21.4999 26.5L16 21M21.4999 26.5L27 21'
                  stroke='black'
                  stroke-width='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <TokenAmout
              allTokens={_allTokens}
              isDest={true}
              limitBera={limitBera === 0}
              amount={reciveAmount ?? ''}
              chainList={chainList}
              chain={toChain}
              token={toToken ?? null}
              disabledInput={true}
              onChainChange={(chain: Chain) => {
                setToChain(chain)
              }}
              onTokenChange={(token: Token) => {
                setToToken(token)
              }}
              comingSoon={ComingSoon}
            />
            <div className='flex items-center justify-between pt-[17px] lg:pl-[20px] text-[14px] text-[#3D405A]'>
              <div>Receive address</div>
              <div className='flex items-center gap-2'>
                <div>{formatLongText(address, 6, 6)}</div>
                {/* <div className='cursor-pointer bg-white w-[26px] h-[26px] border rounded-[8px] flex items-center justify-center'>
                <svg
                  width='11'
                  height='12'
                  viewBox='0 0 11 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M10.1551 10.8038C10.3057 10.8038 10.4502 10.8668 10.5567 10.979C10.6632 11.0912 10.7231 11.2433 10.7231 11.4019C10.7231 11.5605 10.6632 11.7127 10.5567 11.8248C10.4502 11.937 10.3057 12 10.1551 12H0.567984C0.417345 12 0.272876 11.937 0.166359 11.8248C0.059841 11.7127 6.9936e-09 11.5605 6.9936e-09 11.4019V8.47481C-1.19545e-05 8.39455 0.0153198 8.3151 0.0450819 8.2412C0.0748439 8.16731 0.118427 8.10048 0.173235 8.04469L7.61997 0.46701C7.90401 0.167985 8.28921 0 8.69086 0C9.09251 0 9.47771 0.167985 9.76175 0.46701L10.5569 1.30432C10.6976 1.45261 10.8091 1.62862 10.8851 1.8223C10.9611 2.01598 11.0002 2.22354 11 2.43311C10.9998 2.64269 10.9604 2.85017 10.8841 3.04371C10.8077 3.23725 10.6959 3.41306 10.555 3.56108L4.42317 9.96952C4.37021 10.0249 4.30742 10.0687 4.23839 10.0985C4.16935 10.1282 4.09541 10.1434 4.02081 10.1431C3.9462 10.1428 3.87238 10.127 3.80356 10.0967C3.73474 10.0664 3.67227 10.022 3.61971 9.96628C3.56716 9.91051 3.52555 9.84439 3.49726 9.7717C3.46898 9.699 3.45456 9.62115 3.45485 9.54259C3.45513 9.46403 3.47011 9.38629 3.49893 9.31383C3.52774 9.24136 3.56983 9.17558 3.62279 9.12024L9.75323 2.7138C9.78843 2.67677 9.81636 2.6328 9.83542 2.58439C9.85447 2.53599 9.86428 2.4841 9.86428 2.4317C9.86428 2.37931 9.85447 2.32742 9.83542 2.27902C9.81636 2.23061 9.78843 2.18664 9.75323 2.14961L8.95852 1.3128C8.92261 1.27546 8.88001 1.246 8.8332 1.22614C8.78638 1.20628 8.73629 1.19641 8.68583 1.19711C8.63536 1.19781 8.58553 1.20905 8.53923 1.23019C8.49292 1.25134 8.45107 1.28196 8.4161 1.32027L1.13597 8.7285V10.8043H10.1551V10.8038Z'
                    fill='black'
                  />
                </svg>
              </div> */}
              </div>
            </div>

            {
              routes && routes.length > 0 && toToken && (
                <Routes fromChain={fromChain} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} toToken={toToken as Token} routes={routes} />
              )
            }

            <SubmitBtn
              fromChainId={fromChain.chainId}
              isLoading={quoteLoading || sendLoading}
              disabled={sendDisabled || !selectedRoute}
              onClick={async () => {
                const isSuccess = await executeRoute()
                if (isSuccess) {
                  setConfirmShow(true)
                }
              }} comingSoon={ComingSoon} />
          </Card>

          <Confirm
            fromChain={fromChain}
            toChain={toChain}
            fromToken={fromToken as Token}
            toToken={toToken as Token}
            amount={sendAmount}
            receiveAmount={reciveAmount ?? ''}
            show={confirmShow}
            onClose={() => {
              setConfirmShow(false);
            }}
            showHistory={() => {
              setHistoryShow(true)
              setActiveTab('pending')
            }}
          />
        </div>
        <div
          className={clsx(
            'absolute z-50  left-[50%] translate-x-[400px] w-[164px] h-[191px]',
            isDefaultTheme() ? 'bottom-[213px]' : 'bottom-[14vw]'
          )}
        >
          <img src="/images/background/bridge-type-bg.svg" className='w-[164px]' />
          <div className='absolute top-[22px] right-[12px]'>
            {bridgeType === 'stargate' ? checkIcon : unCheckIcon}
          </div>
          <div className='absolute top-[90px] right-[32px]'>
            {bridgeType === 'jumper' ? checkIcon : unCheckIcon}
          </div>

          <div className='absolute w-[164px] h-[65px] cursor-pointer  left-0 top-0' onClick={() => {
            router.push('/bridge/stargate')
          }}></div>

          <div className='absolute w-[164px] h-[65px] cursor-pointer  left-0 top-[75px]' onClick={() => {
            router.push('/bridge/lifi')
          }}></div>

        </div>
        <History activeTab={activeTab} setActiveTab={setActiveTab} isOpen={historyShow} setIsOpen={setHistoryShow} />
      </div>
    </>
  );
}

const checkIcon = <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10.705" cy="10.5166" r="9.5" transform="rotate(-3 10.705 10.5166)" fill="#FFDC50" stroke="#373A53" />
  <path d="M7.73411 10.1674L10.1951 12.5418L14.5937 7.30442" stroke="black" stroke-width="2" stroke-linecap="round" />
</svg>

const unCheckIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10" cy="10" r="9.5" fill="white" stroke="#373A53" />
</svg>