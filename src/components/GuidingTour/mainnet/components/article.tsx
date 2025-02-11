import clsx from 'clsx';

const Article = (props: { children: any; className?: string; }) => {
  const { children, className } = props;

  return (
    <div className={clsx('text-[16px] font-Montserrat font-[500] text-black leading-[150%] md:text-[14px]', className)}>
      {children}
    </div>
  );
};

export default Article;
