import BasicButton from "@/components/button";

export default function Button({ children }: any) {
  return (
    <BasicButton
      type="primary"
      className="flex justify-between items-center w-[168px] h-[36px] shadow-shadow2 text-[16px] font-semibold"
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M1 6H11M11 6L6 1M11 6L6 11"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BasicButton>
  );
}
