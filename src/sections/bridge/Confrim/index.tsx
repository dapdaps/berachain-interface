import Card from '@/components/card';
import Modal from '@/components/modal/index';
import { Token } from '@/types';
import { Chain } from 'viem';

interface Props {
  show: boolean;
  onClose: () => void;
  fromChain: Chain;
  toChain: Chain;
  fromToken: Token;
  toToken: Token;
  amount: string;
  receiveAmount: string;
}

export default function Confirm({ show, onClose, fromChain, toChain, fromToken, toToken, amount, receiveAmount  }: Props) {
  return (
    <Modal open={show} onClose={onClose}>
      <Card>
        <div className='lg:w-[520px] md:w-full'>
          <div className='text-center text-[26px] mt-[30px] md:font-CherryBomb'>
            Bridged Successful!
          </div>
          <div className='flex items-center justify-between mt-[35px] text-[20px]'>
            <div className='flex-1 text-right pr-[40px]'>
              <div>{amount} {fromToken.symbol} </div>
              <div>on { fromChain.name }</div>
            </div>
            <svg
              width='27'
              height='16'
              viewBox='0 0 27 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15.2436 14.9693C15.2436 15.7893 16.1764 16.2608 16.8367 15.7744L26.3174 8.79067C26.86 8.39101 26.86 7.58004 26.3174 7.18038L16.8367 0.196655C16.1764 -0.289721 15.2436 0.181718 15.2436 1.0018V3.34944C15.2436 3.90173 14.7959 4.34944 14.2436 4.34944H1C0.447715 4.34944 0 4.79716 0 5.34944V10.0622C0 10.6145 0.447716 11.0622 1 11.0622H14.2436C14.7959 11.0622 15.2436 11.5099 15.2436 12.0622V14.9693Z'
                fill='black'
              />
            </svg>

            <div className='flex-1 pl-[40px]'>
              <div>{receiveAmount} { toToken.symbol } </div>
              <div>on {toChain.name}</div>
            </div>
          </div>

          <div className='flex justify-center mt-[30px]'>
            <svg
              width='107'
              height='84'
              viewBox='0 0 107 84'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M43.0908 77.3971C41.6502 76.917 40.4898 74.396 40.0897 73.1956H47.2924L48.4928 76.7969C48.4928 77.9974 44.5313 77.8773 43.0908 77.3971Z'
                fill='#4B565C'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M58.0963 79.198C50.4134 79.198 49.6933 76.7971 46.692 75.5967C43.0907 75.5967 44.2911 81.5989 53.8947 82.7994C63.4984 83.9999 67.6999 79.198 58.0963 79.198Z'
                fill='#4B565C'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M59.8973 81.5988C56.536 82.079 58.4967 78.9978 59.8973 77.3972H69.5007C67.7001 78.5977 63.2585 81.1186 59.8973 81.5988Z'
                fill='#4B565C'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M32.887 55.7984C36.7284 47.1551 34.4876 40.1925 32.887 37.7916C40.5699 32.9897 54.095 34.9905 59.8971 36.5911C64.6989 46.795 70.101 68.163 53.2947 72.0045C32.2867 76.8063 28.0852 66.6024 32.887 55.7984Z'
                fill='#4B565C'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M40.0146 45.5852C39.4144 49.9869 39.535 52.3457 37.6137 59.3904C35.813 65.9929 41.0147 67.3934 43.6157 67.7936'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M50.2937 70.6803C53.1748 63.4776 53.895 47.6716 53.895 40.669C19.3219 40.669 15.4806 30.2651 17.8815 25.0631C23.0835 15.0593 42.1307 -3.50769 76.7037 2.25448C119.92 9.4572 105.515 68.2794 92.9098 73.6814C80.305 79.0835 46.6923 79.6837 50.2937 70.6803Z'
                fill='#FFD152'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M69.5006 35.2669C68.3002 31.6655 67.0997 34.0664 38.8891 32.2657C25.9241 30.8251 19.0816 26.4635 17.2809 24.4628C9.27792 24.2627 -4.68736 25.5432 3.47572 32.2657C13.6796 40.6689 39.4893 41.2691 50.8936 40.6689C62.2979 40.0687 70.7011 38.8682 69.5006 35.2669Z'
                fill='white'
                stroke='black'
                strokeWidth='1.5'
              />
              <path
                d='M38.2139 14.9736C40.0146 12.3726 45.4166 8.37111 55.6205 7.17065'
                stroke='black'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
              <path
                d='M58.6216 7.17065C59.6506 7.17065 61.194 7.17065 62.223 7.17065'
                stroke='black'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </div>
          <div className='text-[18px] text-center mt-[10px] md:font-CherryBomb opacity-0'>
            You got a helmet！
          </div>

          <div className='flex gap-[16px] mt-[20px] md:flex-col md:h-[106px]'>
            <div className='flex text-[18px] h-[60px] items-center justify-center border border-[#373A53] flex-1 rounded-[12px] bg-white cursor-pointer'>
              View History
            </div>
            <div onClick={onClose} className='flex text-[18px] h-[60px] items-center justify-center border border-[#373A53] flex-1 rounded-[12px] bg-white cursor-pointer'>
              Back to Bera Town
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
