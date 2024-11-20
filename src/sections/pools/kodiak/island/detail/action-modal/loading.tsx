import Loading from "@/components/loading";

export default function ModalLoading({ title, subTitle }: any) {
  return (
    <div className="h-[200px] flex flex-col justify-center items-center">
      <Loading size={40} />
      {title && (
        <div className="text-[18px] text-[#3D405A] font-semibold mt-[18px]">
          {title}
        </div>
      )}
      {subTitle && (
        <div className="text-[14px] text-[#3D405A] font-medium mt-[10px]">
          {subTitle}
        </div>
      )}
    </div>
  );
}
