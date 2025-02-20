import clsx from 'clsx';

function Ground(props: any) {
  const { isRainyDay } = props;

  return (
    <div className={clsx('absolute bottom-0 left-0 w-full h-[233px] border-t border-black', isRainyDay ? 'bg-[#90AF4E]' : 'bg-[#B6DF5D]')} />
  );
}

export default Ground;
