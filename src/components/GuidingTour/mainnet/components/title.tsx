import clsx from 'clsx';

const Title = (props: { children: any; className?: string; }) => {
  const { children, className } = props;

  return (
    <div className={clsx('text-[24px] font-Montserrat font-[900] md:font-[700] leading-[120%] text-black md:text-[18px]', className)}>
      {children}
    </div>
  );
};

export default Title;
