import clsx from 'clsx';

const Feedback = (props: any) => {
  const { className } = props;

  return (
    <a
      href="https://form.typeform.com/to/FlHPG1AD"
      target="_blank"
      rel="noreferrer nofollow"
      className={clsx('flex items-center justify-center gap-[6px] text-white text-center font-montserrat text-[14px] font-semibold leading-[14px] p-[5px_10px]', className)}
    >
      <img
        src="/images/vaults/v2/feedback.svg"
        alt=""
        className="w-[14px] h-[14px] object-center object-contain shrink-0"
      />
      <div className="">
        Feedback
      </div>
    </a>
  );
};

export default Feedback;
