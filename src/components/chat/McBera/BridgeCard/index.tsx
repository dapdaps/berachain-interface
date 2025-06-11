import React, { useEffect } from "react";
import useBridgeStore from "../../stores/useBridgeStore";
import { useChatContext } from "../../context/chat-context";
import { useTypewriter } from "../../hooks/useTypewriter";

interface BridgeCardProps {
  parsedContent: any;
  content?: string;
}

const BridgeCard: React.FC<BridgeCardProps> = ({ parsedContent, content }) => {
  const bridgeStore = useBridgeStore();

  const { isFromHistory } = useChatContext();

  const { typedContent, isTyping } = useTypewriter(content || "", {
    interval: 40,
    step: [1, 3]
  });

  const boldRegex = /\*\*([^*]+)\*\*/;
  const match = content ? content.match(boldRegex) : null;
  const symbolName = match ? match[1] : null;
  const contentParts = content ? content.split(boldRegex) : [];

  useEffect(() => {
    if (isFromHistory || !content || !isTyping) {
      const ele = document.getElementById("chat-bottom");
      if (ele)
        setTimeout(() => {
          ele.scrollIntoView({
            behavior: "smooth"
          });
        }, 500);
    }
  }, [isTyping, isFromHistory, content]);

  const handleAction = async () => {
    bridgeStore.set({
      modalOpen: true
    });
  };

  const renderContent = () => {
    if (!content) {
      return null;
    }

    if (match) {
      if (isFromHistory || !isTyping) {
        return (
          <div className="markdown-content">
            {contentParts[0]}
            <span
              className="font-bold cursor-pointer text-[#471C1C] underline"
              onClick={handleAction}
            >
              {symbolName}
            </span>
            {contentParts[2]}
          </div>
        );
      }

      return <div className="markdown-content">{typedContent}</div>;
    }

    return <div className="markdown-content">{content}</div>;
  };

  return <>{renderContent()}</>;
};

export default BridgeCard;
