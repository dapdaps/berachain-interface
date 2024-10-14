import { useState } from 'react';

import chains, { icons } from '@/configs/chains'
import allTokens from '@/configs/allTokens'
import Card from '@/components/card';
import TokenAmout from './TokenAmount';
import Routes from './Routes';
import SubmitBtn from './SubmitBtn';
import Confirm from './Confrim';
import { Chain } from 'viem';
import { Token } from '@/types';
import PageBack from '@/components/back';


export default function Bridge() {
  const [confirmShow, setConfirmShow] = useState(false);
  const [fromChain, setFromChain] = useState<Chain>(chains[1])
  const [fromToken, setFromToken] = useState<Token>(allTokens[chains[1].id][0])
  const [toChain, setToChain] = useState<Chain>(chains[1101])
  const [toToken, setToToken] = useState<Token>(allTokens[chains[1101].id][0])

  return (
    <>
      <PageBack className="absolute left-[36px] top-[31px]" />
      <div className='w-[520px] m-auto relative z-10'>
        <div className='text-[60px] text-center py-[30px] font-CherryBomb'>Bridge</div>
        <Card>
          <TokenAmout
            chain={fromChain} token={fromToken} onTokenChange={(token: Token) => {
            setFromToken(token)
          }}
          />
          <div className='h-[8px] flex justify-center items-center'>
            <svg
              className=' cursor-pointer'
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
            chain={toChain} token={toToken} disabledInput={true} onTokenChange={(token: Token) => {
            setToToken(token)
          }}
          />
          <div className='flex items-center justify-between pt-[17px] pl-[20px] text-[14px] text-[#3D405A]'>
            <div>Receive address</div>
            <div className='flex items-center gap-2'>
              <div>0xc25...9210d</div>
              <div className='cursor-pointer bg-white w-[26px] h-[26px] border rounded-[8px] flex items-center justify-center'>
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
              </div>
            </div>
          </div>

          <Routes />

          <SubmitBtn />
        </Card>

        <Confirm
          show={confirmShow}
          onClose={() => {
            setConfirmShow(false);
          }}
        />
      </div>
    </>
  );
}
