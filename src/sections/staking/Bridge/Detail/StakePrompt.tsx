export const StakePrompt = (props: any) => {
  const { className } = props;

  return (
    <div className={`mb-[20px] border border-[#373A53] rounded-[12px] p-[12px_12px_8px] ${className}`}>
      <div className="flex gap-[5px] items-center">
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.13398 0.5C8.51888 -0.166667 9.48112 -0.166667 9.86602 0.5L17.6603 14C18.0452 14.6667 17.564 15.5 16.7942 15.5H1.20577C0.435971 15.5 -0.0451542 14.6667 0.339746 14L8.13398 0.5Z"
            fill="#FFDC50"
          />
          <path
            d="M7.996 11.084L7.624 5.6H9.856L9.484 11.084H7.996ZM8.74 14.096C8.404 14.096 8.128 13.988 7.912 13.772C7.696 13.556 7.588 13.3 7.588 13.004C7.588 12.7 7.696 12.448 7.912 12.248C8.128 12.04 8.404 11.936 8.74 11.936C9.084 11.936 9.36 12.04 9.568 12.248C9.784 12.448 9.892 12.7 9.892 13.004C9.892 13.3 9.784 13.556 9.568 13.772C9.36 13.988 9.084 14.096 8.74 14.096Z"
            fill="#101115"
          />
        </svg>
        <div className="text-[14px] font-bold">
          Please read before you stake
        </div>
      </div>
      <div className="text-[14px] font-normal mt-[5px]">
        There is a 1-3 Epoch wait period to withdraw your Honey from the Vault.
      </div>
    </div>
  );
};
