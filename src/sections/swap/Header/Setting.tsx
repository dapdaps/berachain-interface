import { useState } from 'react';
import SlippageSetting from '../SlippageSetting';
import Modal from '@/components/modal';
import useIsMobile from '@/hooks/use-isMobile';
import SlippageSettingContent from '../SlippageSetting/content';

const Mobile = ({ show, setShow }: any) => {
  return (
    <Modal
      open={show}
      onClose={() => {
        setShow(false);
      }}
    >
      <div className='bg-[#FFFDEB] rounded-t-[20px] pb-[20px] border border-black'>
        <SlippageSettingContent show={show} />
        <button
          onClick={() => {
            setShow(false);
          }}
          className='h-[60px] md:h-[46px] w-4/5 md:mx-[auto] duration-500 hover:opacity-70 active:opacity-90 flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] md:text-[16px] font-[600] mt-[16px] cursor-pointer'
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default function Setting() {
  const isMobile = useIsMobile();
  const [showSetting, setShowSetting] = useState(false);

  return (
    <div className='relative'>
      <button
        className='duration-500	cursor-pointer hover:opacity-70 active:opacity-90 p-[5px]'
        onClick={() => {
          setShowSetting(true);
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 22 20'
          fill='none'
          className='w-[22px] h-[20px] md:w-[16px] md:h-[14px]'
        >
          <path
            d='M21.5872 8.51531C21.5016 8.04782 21.0463 7.5773 20.5772 7.47174L20.2258 7.39181C19.3992 7.146 18.6611 6.60159 18.1966 5.80533C17.7275 5.00455 17.6206 4.09519 17.8238 3.26123L17.9262 2.93549C18.0683 2.48157 17.8834 1.85723 17.5152 1.54959C17.5152 1.54959 17.1851 1.27361 16.25 0.741266C15.3149 0.208921 14.91 0.0641474 14.91 0.0641474C14.4562 -0.097215 13.8175 0.056607 13.489 0.404969L13.2414 0.665863C12.6119 1.25099 11.7654 1.60991 10.8318 1.60991C9.89516 1.60991 9.04408 1.24797 8.41455 0.658323L8.17771 0.406477C7.85073 0.0581151 7.21051 -0.0957071 6.7567 0.0656553C6.7567 0.0656553 6.35026 0.210429 5.41361 0.742774C4.48002 1.27512 4.14998 1.54959 4.14998 1.54959C3.78326 1.85723 3.59838 2.48006 3.74048 2.93549L3.84285 3.26576C4.04455 4.09821 3.93606 5.00606 3.4685 5.80533C3.00094 6.6046 2.25834 7.15052 1.42713 7.39483L1.08639 7.47174C0.617301 7.5773 0.161965 8.04782 0.0763987 8.51531C0.0763987 8.51531 0 8.93456 0 10.0008C0 11.067 0.0763987 11.4847 0.0763987 11.4847C0.161965 11.9522 0.617301 12.4227 1.08639 12.5283L1.41949 12.6037C2.25376 12.8465 2.99788 13.3939 3.4685 14.1962C3.93759 14.997 4.04455 15.9063 3.84133 16.7403L3.74048 17.0645C3.59838 17.5184 3.78326 18.1428 4.1515 18.4504C4.1515 18.4504 4.48155 18.7264 5.41667 19.2587C6.35179 19.7911 6.7567 19.9359 6.7567 19.9359C7.21051 20.0972 7.8492 19.9434 8.17771 19.595L8.41149 19.3462C9.04255 18.7565 9.89363 18.3931 10.8318 18.3931C11.77 18.3931 12.6226 18.7565 13.2536 19.3477C13.2536 19.3477 13.2536 19.3477 13.2552 19.3477L13.4874 19.595C13.8159 19.9434 14.4546 20.0972 14.9084 19.9359C14.9084 19.9359 15.3149 19.7911 16.2515 19.2587C17.1866 18.7264 17.5152 18.4504 17.5152 18.4504C17.8834 18.1428 18.0683 17.5199 17.9262 17.0645L17.8223 16.7297C17.6236 15.8988 17.7306 14.9939 18.1982 14.1962C18.6673 13.3939 19.4129 12.848 20.2472 12.6037V12.6022L20.5803 12.5268C21.0494 12.4212 21.5047 11.9507 21.5903 11.4832C21.5903 11.4832 21.6667 11.0639 21.6667 9.99774C21.6636 8.93456 21.5872 8.51531 21.5872 8.51531ZM10.8318 14.264C8.44664 14.264 6.51222 12.3548 6.51222 10.0008C6.51222 7.64667 8.44664 5.73898 10.8318 5.73898C13.217 5.73898 15.1514 7.64818 15.1514 10.0023C15.1514 12.3563 13.217 14.264 10.8318 14.264Z'
            fill='black'
          />
        </svg>
      </button>
      {isMobile ? (
        <Mobile show={showSetting} setShow={setShowSetting} />
      ) : (
        <SlippageSetting show={showSetting} setShow={setShowSetting} />
      )}
    </div>
  );
}
