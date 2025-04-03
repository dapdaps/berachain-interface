import clsx from 'clsx';

function Ground(props: any) {
  const { isRainyDay, isDefaultTheme } = props;
  
  const getBgColor = () => {
    if (isDefaultTheme?.()) {
      return isRainyDay ? 'bg-[#90AF4E]' : 'bg-[#B6DF5D]'
    }
    return 'bg-[#FFF5A9]'
  }

  return (
    <div className={clsx(
      'absolute bottom-0 left-0 w-full h-[233px] border-t border-black',
      getBgColor()
    )} />
  );
}

export default Ground;
