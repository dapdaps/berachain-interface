import Card from '@/components/card';
import Modal from '@/components/modal/index';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function TokenSelector({ show, onClose }: Props) {
  return (
    <Modal open={show} onClose={onClose}>
      <Card>
        <div className='w-[520px]'>
          <div className='flex items-center gap-[10px] cursor-pointer text-[20px]'>
            <svg
              width='9'
              height='16'
              viewBox='0 0 9 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M7 2L2.2 8L7 14'
                stroke='black'
                stroke-width='3'
                strokeLinecap='round'
              />
            </svg>
            <div>Select Token</div>
          </div>

          <div className='mt-[20px] flex items-center border rounded-[12px] overflow-hidden border-[#373A53] px-[15px] gap-[10px]'>
            <svg
              width='21'
              height='15'
              viewBox='0 0 21 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='7.01829'
                cy='7.01829'
                r='6.01829'
                stroke='#3D4159'
                stroke-width='2'
              />
              <rect
                x='14.9138'
                y='9.64978'
                width='6.141'
                height='2.63186'
                rx='1.31593'
                transform='rotate(30 14.9138 9.64978)'
                fill='#3D4159'
              />
            </svg>

            <input
              className='flex-1 h-[52px] bg-inherit outline-none'
              placeholder='search token or paste address'
            />
          </div>

          <div className='h-[400px] overflow-auto mt-[5px]'>
            <div className='flex items-center justify-between h-[52px] px-[10px] rounded-[10px] cursor-pointer hover:bg-[#0000000F]'>
              <div className='flex items-center gap-2'>
                <img
                  className='w-[26px] h-[26px]'
                  src='https://s3.amazonaws.com/dapdap.main/avatar/0x86cdcd7fa9f3b24d68cbdd9170c3662036bdc2ef1727332750443'
                />
                <div>
                  <div className='text-[16px] font-[600] '>BERA</div>
                  <div className='text-[10px] font-[400]'>Berachain token</div>
                </div>
              </div>

              <div className='font-[600] text-[16px]'>123.33</div>
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
