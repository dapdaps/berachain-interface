import React, { useEffect, useState } from "react";
import useBgtBoostStore from "../../stores/useBgtBoostStore";
import { useChatContext } from "../../context/chat-context";
import { useTypewriter } from "../../hooks/useTypewriter";
import TopValidator from "@/sections/bgt/components/top-validator";

interface BgtBoostCardProps {
  parsedContent: any;
  content?: string;
}

const BgtBoostCard: React.FC<BgtBoostCardProps> = ({
  parsedContent,
  content
}) => {
  const bgtBoostStore = useBgtBoostStore();

  const { isFromHistory } = useChatContext();

  const [contentFinished, setContentFinished] = useState(false);

  const { isTyping } = useTypewriter(content || "", {
    interval: 40,
    step: [1, 3]
  });

  useEffect(() => {
    if (isFromHistory || !content || !isTyping) {
      setContentFinished(true);
      const ele = document.getElementById("chat-bottom");
      if (ele)
        setTimeout(() => {
          ele.scrollIntoView({
            behavior: "smooth"
          });
        }, 500);
    } else {
      setContentFinished(false);
    }
  }, [isTyping, isFromHistory, content]);

  const renderContent = () => {
    if (!content) {
      return null;
    }

    return <div className="markdown-content">{content}</div>;
  };

  return (
    <>
      {renderContent()}
      {contentFinished && (
        <>
          <div className="mt-[14px] flex flex-col items-start gap-2">
            {parsedContent?.map((validator: any, index: number) => (
              <TopValidator
                key={validator?.id}
                validator={validator}
                handleValidator={() => {
                  bgtBoostStore.set({ modalOpen: true, data: validator });
                }}
              />
            ))}
          </div>
          <div className="mt-[20px]">
            View more validators:{" "}
            <a
              className="font-bold cursor-pointer text-[#471C1C] underline"
              href="/hall"
            >
              Validators
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default BgtBoostCard;
