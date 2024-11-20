import useIsMobile from "@/hooks/use-isMobile";
import { useState } from "react";
import ListToken from "../list-token";

const VoteListMeme = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
        }}
        type="button"
        className="h-[36px] md:w-full leading-[34px] px-[27px] rounded-[10px] border border-black bg-[#FFDC50] text-center text-black text-[14px] font-[600]"
      >
        {isMobile ? "+" : ""} List Meme
      </button>
      <ListToken
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};

export default VoteListMeme;
