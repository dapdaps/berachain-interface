const BgtEmpty = (props: any) => {
  const { handleExplore, text, style, className } = props;

  return (
    <div className={`flex flex-col items-center ${className}`} style={style}>
      <svg xmlns="http://www.w3.org/2000/svg" width="65" height="47" viewBox="0 0 65 47" fill="none">
        <ellipse cx="29.5" cy="41.5" rx="29.5" ry="5.5" fill="black" fill-opacity="0.5" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.0722 11.8919C9.31048 11.4734 8 9.88976 8 8V5C8 2.79086 9.79086 1 12 1H36C38.2091 1 40 2.79086 40 5V8C40 9.88976 38.6895 11.4734 36.9277 11.8919C42.2285 13.8855 46 19.0023 46 25V31C46 36.5228 41.5228 41 36 41H12C6.47715 41 2 36.5228 2 31V25C2 19.0023 5.7715 13.8855 11.0722 11.8919Z"
          fill="#FFFDEB"
        />
        <path
          d="M11.0722 11.8919L11.2483 12.3599L12.7804 11.7836L11.1878 11.4054L11.0722 11.8919ZM36.9277 11.8919L36.8122 11.4054L35.2196 11.7836L36.7517 12.3599L36.9277 11.8919ZM7.5 8C7.5 10.1266 8.97471 11.9076 10.9567 12.3783L11.1878 11.4054C9.64625 11.0393 8.5 9.65289 8.5 8H7.5ZM7.5 5V8H8.5V5H7.5ZM12 0.5C9.51472 0.5 7.5 2.51472 7.5 5H8.5C8.5 3.067 10.067 1.5 12 1.5V0.5ZM36 0.5H12V1.5H36V0.5ZM40.5 5C40.5 2.51472 38.4853 0.5 36 0.5V1.5C37.933 1.5 39.5 3.067 39.5 5H40.5ZM40.5 8V5H39.5V8H40.5ZM37.0433 12.3783C39.0253 11.9076 40.5 10.1266 40.5 8H39.5C39.5 9.65289 38.3538 11.0393 36.8122 11.4054L37.0433 12.3783ZM36.7517 12.3599C41.864 14.2826 45.5 19.2173 45.5 25H46.5C46.5 18.7873 42.593 13.4884 37.1038 11.4239L36.7517 12.3599ZM45.5 25V31H46.5V25H45.5ZM45.5 31C45.5 36.2467 41.2467 40.5 36 40.5V41.5C41.799 41.5 46.5 36.799 46.5 31H45.5ZM36 40.5H12V41.5H36V40.5ZM12 40.5C6.7533 40.5 2.5 36.2467 2.5 31H1.5C1.5 36.799 6.20101 41.5 12 41.5V40.5ZM2.5 31V25H1.5V31H2.5ZM2.5 25C2.5 19.2173 6.13604 14.2826 11.2483 12.3599L10.8962 11.4239C5.40696 13.4884 1.5 18.7873 1.5 25H2.5Z"
          fill="black"
        />
        <path d="M15 12H33" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2" />
        <path
          d="M12 39C13.1667 38 17.3 36 24.5 36C31.7 36 36.8333 38.3333 37.5 39"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="2 2"
        />
        <path
          d="M58.0126 40.9325C57.6762 41.2422 57.0866 41.3806 56.1624 41.2024C55.2502 41.0265 54.115 40.5585 52.8263 39.814C50.2543 38.3281 47.172 35.8003 44.2042 32.5762C41.2364 29.3521 38.9718 26.0715 37.7036 23.3855C37.0681 22.0398 36.6954 20.8697 36.5956 19.9461C36.4944 19.0103 36.681 18.4342 37.0174 18.1245L39.2247 16.0927L60.2198 38.9007L58.0126 40.9325Z"
          fill="#D9D9D9"
          stroke="black"
        />
        <path
          d="M60.5877 38.5621C60.2513 38.8718 59.6617 39.0102 58.7375 38.8321C57.8253 38.6562 56.6901 38.1882 55.4014 37.4437C52.8294 35.9578 49.7471 33.4299 46.7793 30.2059C43.8115 26.9818 41.5469 23.7012 40.2787 21.0152C39.6432 19.6694 39.2705 18.4994 39.1707 17.5758C39.0695 16.64 39.2561 16.0639 39.5925 15.7542C39.929 15.4445 40.5186 15.3061 41.4427 15.4843C42.355 15.6601 43.4902 16.1282 44.7789 16.8727C47.3508 18.3585 50.4331 20.8864 53.401 24.1105C56.3688 27.3346 58.6333 30.6152 59.9016 33.3011C60.5371 34.6469 60.9097 35.8169 61.0096 36.7406C61.1108 37.6763 60.9241 38.2525 60.5877 38.5621Z"
          fill="#FFFDEB"
          stroke="black"
        />
      </svg>
      <div className="mt-[8px] mb-[20px] text-[#3D405A] font-Montserrat text-[14px] font-medium">{text || "No active vaults yet"}</div>
      {
        handleExplore && (
          <div
            className="cursor-pointer flex items-center justify-center w-[242px] h-[48px] rounded-[10px] border border-black bg-[#FFDC50]"
            onClick={handleExplore}
          >
            <span className="text-[#3D405A] font-Montserrat text-[16px] font-semibold">Explore Vaults</span>
          </div>
        )
      }
    </div>
  );
};

export default BgtEmpty;
