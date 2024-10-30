export default function Card({
  children
}: {
  children: React.ReactNode | null;
}) {
  return (
    <div className='border border-[#000000] rounded-[30px] px-[20px] py-[25px] bg-[#FFFDEB] shadow-[10px_10px_0px_0px_#00000040] md:shadow-none md:px-[10px] md:py-[16px]'>
      {children}
    </div>
  );
}
