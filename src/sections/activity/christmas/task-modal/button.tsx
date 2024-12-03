import BasicButton from "@/components/button";

export default function Button({ children }: any) {
  return (
    <BasicButton
      type="primary"
      isOnlyLoading
      className="flex justify-center items-center gap-[6px] w-[168px] h-[46px] shadow-shadow2 text-[16px] font-semibold"
    >
      {children}
    </BasicButton>
  );
}
