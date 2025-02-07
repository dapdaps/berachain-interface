import { useEffect, useMemo, useState } from 'react';

import chains, { icons } from '@/configs/chains'
import Card from '@/components/card';
import TokenAmout from './TokenAmount';
import Routes from './Routes';
import SubmitBtn from './SubmitBtn';
import Confirm from './Confrim';
import { Chain } from 'viem';
import { Token } from '@/types';
import PageBack from '@/components/back';
import useIsMobile from '@/hooks/use-isMobile';
import MenuButton from '@/components/mobile/menuButton';
import { useParams } from 'next/navigation';
import History from './History';
import useQuote from './Hooks/Stargate/useQoute';
import useBridge from './Hooks/Stargate/useBridge';
import Big from 'big.js';
import { useAccount, useSwitchChain } from "wagmi";
import useApprove from '@/hooks/use-approve';
import { formatLongText } from '@/utils/utils';
import allTokens from '@/configs/allTokens'
import { useDebounce } from 'ahooks';
import useTokenBalance from '@/hooks/use-token-balance';
import { tokenPairs } from './Hooks/Stargate/config';
import useAddAction from '@/hooks/use-add-action';
import { useBridgeHistory } from '@/stores/useBridgeHistory';

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
          src={`/images/dapps/${dappName}.svg`}
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

export default function Bridge() {
  const [confirmShow, setConfirmShow] = useState(false);
  const [fromChain, setFromChain] = useState<Chain>(chains[1])
  const [fromToken, setFromToken] = useState<Token>(allTokens[1][0])
  const [toChain, setToChain] = useState<Chain>(chains[80094])
  const [toToken, setToToken] = useState<Token>(allTokens[80094][2])
  const [amount, setAmount] = useState<string>('')
  const isMobile = useIsMobile()
  const { switchChain } = useSwitchChain();
  const { addAction } = useAddAction("bridge");
  const { address, chainId } = useAccount() 
  const { list, set }: any = useBridgeHistory()
  const { tokenBalance, isError, isLoading, update } = useTokenBalance(
    fromToken ? (fromToken.isNative ? 'native' : fromToken.address) : '', fromToken?.decimals ?? 0, fromChain?.id ?? 0
  )

  const inputValue = useDebounce(amount, { wait: 500 });

  const { fee, receiveAmount, contractAddress, loading: quoteLoading } = useQuote({ fromChainId: fromChain.id, toChainId: toChain.id, token: fromToken, amount: inputValue })
  const { approve, allowance, approving: approveLoading } = useApprove({ token: fromToken, amount: inputValue, spender: contractAddress as string })

  const { execute, loading: bridgeLoading } = useBridge()

  const isValid = useMemo(() => {
    return tokenBalance && Number(tokenBalance) >= Number(inputValue) && Number(inputValue) > 0
  }, [inputValue, tokenBalance])

  useEffect(() => {
    const tokenPair = tokenPairs[fromChain.id][fromToken.symbol.toUpperCase()]
    if (tokenPair) {
      setToToken(allTokens[toChain.id].find((token: Token) => token.symbol.toUpperCase() === tokenPair) as Token)
    }
  }, [fromChain, fromToken])  

  const handleBridge = async () => {
    console.log(fee)

    if (!fromToken.isNative) {
      if (!allowance || Number(allowance) < Number(inputValue)) {
        await approve()
      }
    }

    const txHash = await execute({
      fromChainId: fromChain.id,
      toChainId: toChain.id,
      token: fromToken,
      amount: inputValue,
      fee: fee as {
        nativeFee: string,
        lzTokenFee: string
      },
      contractAddress: contractAddress as string
    })

    console.log(txHash)
    
    if (txHash) {
      const action = {
        type: 'Bridge',
        fromChainId: fromChain.id,
        toChainId: toChain.id,
        token: fromToken,
        amount: inputValue,
        template: 'Stargate',
        add: false,
        status: 1,
        transactionHash: txHash,
        extra_data: {}
      }

      addAction(action)
      setConfirmShow(true)
      set({ list: [...list, action] })
    }
  }

  return (
    <>
      <PageBack className="absolute left-[36px] md:left-[15px] top-[31px] md:top-[14px] z-[12]" />
      <div className='lg:w-[520px] md:w-[92.307vw] m-auto relative z-10'>
        <DappHeader />
        <Card>
          <TokenAmout
            chain={fromChain}
            token={fromToken}
            amount={amount}
            onAmountChange={(v: string) => {
              setAmount(v)
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
            amount={receiveAmount ?? ''}
            chain={toChain} token={toToken} disabledInput={true} onTokenChange={(token: Token) => {
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
            fee && receiveAmount && (
              <Routes fromChain={fromChain} route={[{
                receiveAmount: receiveAmount ?? '',
                fee: fee?.nativeFee ?? ''
              }]} />
            )
          }

          <SubmitBtn
            fromChainId={fromChain.id}
            isLoading={quoteLoading || bridgeLoading || approveLoading}
            disabled={!isValid}
            onClick={() => {
              handleBridge()
            }} comingSoon={ComingSoon} />
        </Card>

        <Confirm
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken}
          toToken={toToken}
          amount={amount}
          receiveAmount={receiveAmount ?? ''}
          show={confirmShow}
          onClose={() => {
            setConfirmShow(false);
          }}
        />
      </div>
      <History />
    </>
  );
}
