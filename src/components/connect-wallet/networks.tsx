import Drawer from '@/components/drawer';
import { icons } from '@/configs/chains';
import Image from 'next/image';

const MobileNetworks = (props: Props) => {
  const { visible, onClose, chains, chainId, handleChainSelect } = props;

  return (
    <Drawer visible={visible} onClose={onClose} size="50vh">
      <div className="py-[50px]">
        {chains.map((_chain: any) => (
          <div
            key={_chain.name}
            className='w-full h-[45px] flex justify-start gap-[9px] items-center px-[20px] cursor-pointer hover:bg-[#F2F2F2] transition-all ease-in-out duration-300'
            style={{
              background: chainId === _chain.id ? '#F2F2F2' : ''
            }}
            onClick={(e) => handleChainSelect(_chain.id, _chain)}
          >
            {icons[_chain.id] ? (
              <Image
                src={icons[_chain.id]}
                alt=''
                width={20}
                height={20}
              />
            ) : (
              <div className='w-[20px] h-[20px] shrink-0 rounded-[4px] bg-[#eceff0]'></div>
            )}
            <div className='text-black text-[16px] font-medium'>
              {_chain.name}
            </div>
            {chainId === _chain.id && (
              <div className='ml-auto'>
                <svg
                  width='13'
                  height='10'
                  viewBox='0 0 13 10'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M1 3.72727L5 8L12 1'
                    stroke='black'
                    strokeWidth='2'
                  />
                </svg>
              </div>
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
