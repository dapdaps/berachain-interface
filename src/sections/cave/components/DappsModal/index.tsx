import Modal from "@/components/modal"
import Link from "next/link"
import { memo } from "react"

export default memo(function DappsModal({
  open,
  onClose,
  title,
  dapps,
}: {
  open: boolean
  onClose: VoidFunction
  title: string
  dapps: any[]
}) {
  console.log("====dapps", dapps)
  return (
    <Modal
      open={open}
      closeIconClassName="right-[-10px] top-[-10px]"
      onClose={onClose}
    >
      <div className=" border-[#000] md:rounded-[20px_20px_0_0] rounded-[20px] bg-[#FFFDEB] p-[20px]">
        <div className="text-[20px] font-bold">Select dApp for {title}</div>
        <div className="flex mt-[10px] justify-center">
          {
            dapps?.map(item => {
              return (
                <Link
                  href={item.link}
                  key={item.name}
                >
                  <div
                    className="rounded-[10px] w-[134px] h-[134px] cursor-pointer flex items-center justify-center flex-col hover:bg-[#0000000F]"
                    key={item.name}
                  >
                    <img src={item.icon} className="w-[42px] h-[42px]" />
                    <div className="text-[16px] font-[600] mt-[5px]">{item.name}</div>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </div>
    </Modal>
  )
})
