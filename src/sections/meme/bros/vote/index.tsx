import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import ListToken from "../modals/list-token";
import { useState } from "react";

export default function Meme(props: any) {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState(0);
  const [modalData, setModalData] = useState<any>();

  const onOpenModal = (type: any, data: any) => {
    setModalData(data);
    setModalType(type);
  };
  return (
    <>
      {isMobile ? <Mobile {...props} /> : <Laptop {...props} />}
      <ListToken
        open={modalType === 1}
        onClose={() => {
          setModalType(0);
        }}
      />
    </>
  );
}
