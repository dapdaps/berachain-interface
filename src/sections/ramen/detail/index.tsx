import clsx from 'clsx';

const Detail = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('', className)}>
      Detail
    </div>
  );
};

export default Detail;
