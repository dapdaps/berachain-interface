import Drawer from '@/components/drawer';
import Image from 'next/image';
import { icons } from '@/configs/chains';

const MobileUser = (props: Props) => {
  const { visible, onClose, handleDisconnect, walletInfo, handleCopy, address, tokenLogoShown, balanceShown, tokenSymbolShown, chainId } = props;

  return (
    <Drawer visible={visible} onClose={onClose} size="50vh">
      <div className="py-[50px]">
        <div className='pl-[22px] pr-[26px] text-[#6F6F6F] text-[16px] font-normal text-nowrap leading-[1] overflow-hidden overflow-ellipsis'>
          Connected with {walletInfo?.name}
        </div>
        <div className='pl-[22px] pr-[26px] flex justify-between items-center mt-[13px]'>
          <div className='text-black text-[16px] font-semibold leading-[1]'>
            {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
          </div>
          <div className='click cursor-pointer' onClick={handleCopy}>
            <svg
              width='13'
              height='12'
              viewBox='0 0 13 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M3.69238 4.88464C3.69238 4.05622 4.36396 3.38464 5.19238 3.38464H10.577C11.4054 3.38464 12.077 4.05622 12.077 4.88464V10.5C12.077 11.3285 11.4054 12 10.577 12H5.19238C4.36396 12 3.69238 11.3285 3.69238 10.5V4.88464ZM5.19238 4.38464C4.91624 4.38464 4.69238 4.6085 4.69238 4.88464V10.5C4.69238 10.7762 4.91624 11 5.19238 11H10.577C10.8531 11 11.077 10.7762 11.077 10.5V4.88464C11.077 4.6085 10.8531 4.38464 10.577 4.38464H5.19238Z'
                fill='#6F6F6F'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M0 1.5C0 0.671572 0.671573 0 1.5 0H6.88462C7.71304 0 8.38461 0.671573 8.38461 1.5V2.61538H7.38462V1.5C7.38462 1.22386 7.16076 1 6.88462 1H1.5C1.22386 1 1 1.22386 1 1.5V7.11539C1 7.39153 1.22386 7.61539 1.5 7.61539H2.34615V8.61539H1.5C0.671573 8.61539 0 7.94381 0 7.11539V1.5Z'
                fill='#6F6F6F'
              />
            </svg>
          </div>
        </div>
        <div className="pl-[22px] pr-[26px]">
          <div className="pl-[9px] pr-[16px] w-fit h-[36px] border border-black rounded-full flex items-center gap-[8px] mt-[14px]">
            <div
              className="relative w-[20px] h-[20px] rounded-full shrink-0 bg-[#F0F0F0]"
              style={{
                backgroundImage: `url("${tokenLogoShown}")`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {chainId ? (
                <Image
                  src={icons[chainId]}
                  alt=""
                  width={10}
                  height={10}
                  className="absolute right-[-3px] bottom-[-3px]"
                />
              ) : (
                <div className="absolute w-[10px] h-[10px] rounded-[2px] border border-black right-[-3px] bottom-[-3px]" />
              )}
            </div>
            <div className="text-black text-[16px] font-normal flex-shrink-0 overflow-hidden text-nowrap">
              {balanceShown} {tokenSymbolShown}
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer pl-[22px] pr-[26px] flex justify-between items-center click mt-[10px] pt-[10px] pb-[10px] transition-all duration-300 hover:bg-[#f7f7f7]"
          onClick={handleDisconnect}
        >
          <div className="text-[#a6703d] text-[16px] font-medium leading-[1]">
            Disconnect
          </div>
          <div className="">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d='M6.13019 0C6.16853 -1.75877e-09 6.20649 0.00739019 6.24191 0.0217487C6.27732 0.0361072 6.3095 0.0571528 6.33661 0.0836838C6.36372 0.110215 6.38522 0.141712 6.39989 0.176376C6.41456 0.211041 6.42211 0.248194 6.42211 0.285714V0.857143C6.42211 0.894663 6.41456 0.931817 6.39989 0.966481C6.38522 1.00115 6.36372 1.03264 6.33661 1.05917C6.3095 1.0857 6.27732 1.10675 6.24191 1.12111C6.20649 1.13547 6.16853 1.14286 6.13019 1.14286H1.16766V10.8571H6.13019C6.16853 10.8571 6.20649 10.8645 6.24191 10.8789C6.27732 10.8933 6.3095 10.9143 6.33661 10.9408C6.36372 10.9674 6.38522 10.9989 6.39989 11.0335C6.41456 11.0682 6.42211 11.1053 6.42211 11.1429V11.7143C6.42211 11.7518 6.41456 11.789 6.39989 11.8236C6.38522 11.8583 6.36372 11.8898 6.33661 11.9163C6.3095 11.9428 6.27732 11.9639 6.24191 11.9783C6.20649 11.9926 6.16853 12 6.13019 12H1.16766C0.868082 12 0.579967 11.8873 0.362904 11.6852C0.145842 11.4831 0.0164383 11.2071 0.00145957 10.9143L0 10.8571V1.14286C-2.33049e-07 0.849645 0.115141 0.567649 0.321609 0.355197C0.528076 0.142744 0.810073 0.0160892 1.10927 0.00142857L1.16766 0H6.13019ZM8.79274 2.94086L11.2991 5.394C11.4563 5.54784 11.5478 5.75439 11.5551 5.97181C11.5624 6.18923 11.485 6.40123 11.3385 6.56486L11.2991 6.606L8.79274 9.05914C8.738 9.11271 8.66376 9.1428 8.58636 9.1428C8.50895 9.1428 8.43472 9.11271 8.37998 9.05914L7.96721 8.65514C7.91248 8.60156 7.88174 8.5289 7.88174 8.45314C7.88174 8.37738 7.91248 8.30472 7.96721 8.25114L9.68279 6.57143H3.79488C3.75655 6.57143 3.71859 6.56404 3.68317 6.54968C3.64775 6.53532 3.61557 6.51428 3.58847 6.48774C3.56136 6.46121 3.53986 6.42972 3.52519 6.39505C3.51052 6.36039 3.50297 6.32323 3.50297 6.28571V5.71429C3.50297 5.67676 3.51052 5.63961 3.52519 5.60495C3.53986 5.57028 3.56136 5.53879 3.58847 5.51226C3.61557 5.48572 3.64775 5.46468 3.68317 5.45032C3.71859 5.43596 3.75655 5.42857 3.79488 5.42857H9.68279L7.96721 3.74886C7.91248 3.69528 7.88174 3.62262 7.88174 3.54686C7.88174 3.4711 7.91248 3.39844 7.96721 3.34486L8.37998 2.94086C8.43472 2.88729 8.50895 2.8572 8.58636 2.8572C8.66376 2.8572 8.738 2.88729 8.79274 2.94086Z'
                fill='#FF3D83'
              />
            </svg>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileUser;

interface Props {
  visible: boolean;
  walletInfo: any;
  addressShown: any;
  address: any;
  tokenLogoShown: any;
  balanceShown: any;
  tokenSymbolShown: any;
  chainId: any;

  onClose(): void;
  handleDisconnect(): void;
  handleCopy(): void;
}