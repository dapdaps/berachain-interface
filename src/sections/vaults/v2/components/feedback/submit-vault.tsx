import clsx from 'clsx';

const SubmitVault = (props: any) => {
  const { className } = props;

  return (
    <a
      href="https://forms.gle/pPymxmxSgv7Th3NY8"
      target="_blank"
      rel="noreferrer nofollow"
      className={clsx("flex items-center justify-center gap-[10px] text-black text-center font-Montserrat text-[14px] font-semibold leading-[14px] w-[165px] h-[40px] shrink-0 rounded-[10px] border border-black bg-[#FFDC50]", className)}
    >
      <img src="/images/vaults/v2/submit.svg" alt="" className="w-[13px] h-[15px] object-center object-contain shrink-0" />
      <div className="">
        Submit Vault
      </div>
    </a>
  );
};

export default SubmitVault;
