export default function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode | null;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className={`border border-[#000000] rounded-[30px] md:rounded-b-none px-[20px] py-[25px] bg-[#FFFDEB] lg:shadow-[10px_10px_0px_0px_#00000040] md:shadow-none md:px-[10px] md:py-[16px] ${className}`}>
      {children}
    </div>
  );
}