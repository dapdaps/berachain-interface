import Laptop from "./laptop";
import Mobile from "./mobile";
import RulesModal from "../modals/rules";
import useIsMobile from "@/hooks/use-isMobile";
import { useState } from "react";

export default function Meme(props: any) {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState(0);
  const params = {
    onOpenModal: setModalType
  };
  return (
    <>
      {isMobile ? (
        <Mobile {...props} {...params} />
      ) : (
        <Laptop {...props} {...params} />
      )}
      <RulesModal
        open={modalType === 7}
        onClose={() => {
          setModalType(0);
        }}
      />
    </>
  );
}
