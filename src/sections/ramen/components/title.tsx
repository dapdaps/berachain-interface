import clsx from 'clsx';

const Title = (props: any) => {
  const { children, className } = props;

  return (
    <div className={clsx('text-black text-[20px] font-[700] leading-[90%] font-Montserrat', className)}>
      {children}
    </div>
  );
};

export default Title;
