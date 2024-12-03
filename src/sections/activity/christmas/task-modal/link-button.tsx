export default function LinkButton({ children, href }: any) {
  return (
    <a
      href={href}
      className="flex justify-center items-center h-[32px] px-[12px] text-[14px] font-medium border border-black/30 bg-black/5 rounded-[10px]"
    >
      {children}
    </a>
  );
}
