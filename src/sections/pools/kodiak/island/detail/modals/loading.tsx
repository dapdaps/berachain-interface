import Loading from "@/components/loading";

export default function ModalLoading() {
  return (
    <div className="h-[200px] flex flex-col justify-center items-center">
      <Loading size={40} />
      <div className="text-[18px] text-[#3D405A] font-semibold mt-[18px]">
        Waiting for confirmation
      </div>
      <div className="text-[14px] text-[#3D405A] font-medium mt-[10px]">
        Supplying 1 HONEY and 0.0602042 BERA
      </div>
    </div>
  );
}
