import IconReload from '@public/images/home/christmas/icon-reload.svg';

const SocialTask = (props: any) => {
  const { children, complete, onClick, className, checking, disabled, reloadButtonClassName, reloadIconClassName } = props;

  return (
    <button
      type="button"
      className={`!cursor-default h-[33px] bg-[#DCBC95] rounded-[17px] pr-[6px] pl-[11px] flex items-center gap-[8px] text-black text-[14px] font-[600] border border-black shadow-[-20px_26px_60px_0px_rgba(0,_0,_0,_0.20)_inset] ${className}`}
    >
      {children}
      {
        complete ? (
          <button
            type="button"
            className="border-0 bg-transparent"
          >
            <img src="/images/activity/christmas/icon-complete.svg" alt="" />
          </button>
        ) : (
          <button
            type="button"
            className={`translate-y-[2.8px] disabled:opacity-30 disabled:!cursor-not-allowed translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain ${reloadButtonClassName}`}
            disabled={disabled}
            onClick={onClick}
          >
            <IconReload className={`${checking ? 'animate-rotate' : ''} origin-[12px_12px] ${reloadIconClassName}`} />
          </button>
        )
      }
    </button>
  );
};

export default SocialTask;
