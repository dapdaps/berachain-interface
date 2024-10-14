import { motion } from "framer-motion";

const DApp = ({
  name = '',
  icon = '',
  type = '',
  className = '',
  disabled,
  onClick = () => {}
}: Props) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  }

  return (
    <motion.div
      className={`relative z-[3] ${className}`}
      onClick={handleClick}
      initial="default"
      whileHover={disabled ? 'default' : 'hover'}
    >
      {
        disabled && (
          <div className="absolute cursor-not-allowed z-[2] left-0 top-0 w-full h-full rounded-[30px] bg-[rgba(0,_0,_0,_0.5)]" />
        )
      }
      <motion.div
        className='absolute z-[0] top-0 left-0 w-[120px] h-[120px] rounded-[30px] bg-white'
        variants={{
          hover: {
            scale: 1.1,
          },
          default: {
            scale: 1,
          },
        }}
      />
        <div className={`p-[6px] z-[1] overflow-hidden flex-col gap-[6px] flex justify-center items-center w-[120px] h-[120px] rounded-[30px] border-black border-[2px] relative bg-[#B2E946] before:content-[""] before:absolute before:bottom-0 before:w-full before:h-[91.7%] before:bg-[#9ACA3B] before:rounded-[30px] before:z-[-1]`}>
        <img
          src={icon}
          alt={name}
          width={43}
          height={43}
          className='flex-shrink-0'
        />
        <div className='whitespace-nowrap overflow-ellipsis flex-shrink-0 font-[400] font-CherryBomb text-[20px] leading-[0.9]'>{name}</div>
        <div className='whitespace-nowrap overflow-ellipsis flex-shrink-0 text-[12px] font-[600] leading-[0.9] text-[#527213]'>{type}</div>
      </div>
    </motion.div>
  )
}

export default DApp;

interface Props {
  name: string;
  icon: string;
  type: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}