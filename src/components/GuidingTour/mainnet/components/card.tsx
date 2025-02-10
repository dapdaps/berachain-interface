import clsx from 'clsx';

const Card = (props: { children: any; className?: string; }) => {
  const { children, className } = props;

  return (
    <div className={clsx('bg-[#FFFDEB] border border-[#333648] shadow-[0_0_4px_0_rgba(0,_0,_0,_0.25)] rounded-[20px]', className)}>
      {children}
    </div>
  );
};

export default Card;
