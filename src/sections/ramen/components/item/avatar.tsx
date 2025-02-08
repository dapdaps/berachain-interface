import clsx from 'clsx';

const Avatar = (props: any) => {
  const { className, project, imgClassName } = props;

  return (
    <div className={clsx('flex items-center gap-[15px]', className)}>
      <img
        src={project?.token_icon_url}
        alt=""
        className={clsx('w-[78px] h-[78px] rounded-full shrink-0', imgClassName)}
      />
      <div className="flex flex-col gap-[10px] whitespace-nowrap flex-1 w-0">
        <div className="text-black text-[16px] font-[600] leading-[90%] overflow-hidden text-ellipsis">
          {project?.token_name}
        </div>
        <div className="text-[#646464] text-[14px] font-[600] leading-[90%] overflow-hidden text-ellipsis">
          {project?.token_symbol}
        </div>
      </div>
    </div>
  );
};

export default Avatar;
