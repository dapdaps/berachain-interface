import Drawer from '@/components/drawer';
import { icons } from '@/configs/chains';
import Image from 'next/image';

/**
 * font-family: Montserrat;
font-size: 18px;
font-weight: 700;
line-height: 16.2px;
text-align: left;

=> text-[18px] font-[700] leading-[16.2px] text-left
 * 
 */

const MobileNetworks = (props: Props) => {
  const { visible, onClose, chains, chainId, handleChainSelect } = props;

  return (
    <Drawer visible={visible} onClose={onClose} size="68.923vw">
      <div className='bg-[#FFFDEB] mt-5 px-4'>
        <div className='px-4 text-[18px] font-[700] leading-[16.2px] text-left mb-3'>Networks</div>
        {chains.map((_chain: any) => (
          <div
            key={_chain.name}
            className='w-full h-[68px] flex justify-start gap-[12px] items-center p-[14px] bg-[#000] bg-opacity-[0.06] cursor-pointer hover:bg-[#F2F2F2] transition-all ease-in-out duration-300 mb-3 rounded-[10px]'
            onClick={(e) => handleChainSelect(_chain.id, _chain)}
          >
            {icons[_chain.id] ? (
              <Image
                src={icons[_chain.id]}
                alt=''
                width={40}
                height={40}
                className='rounded-[12px]'
              />
            ) : (
              <div className='w-[40px] h-[40px] shrink-0 rounded-[12px] bg-[#eceff0]'></div>
            )}
            <div className='text-black text-[18px] font-semibold leading-[16.2px]'>
              {_chain.name}
            </div>
            {chainId === _chain.id && (
              <div className='w-3 h-3 rounded-full bg-[#A0D733]'></div>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default MobileNetworks;

interface Props {
  visible: boolean;
  chains: any;
  chainId: any;

  onClose(): void;
  handleChainSelect(id: any, chain: any): void;
}
