import React, { useEffect } from "react";
import { useChatContext } from "../../context/chat-context";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useRouter } from "next/navigation";

interface LendCardProps {
  parsedContent: any;
  content?: string;
}

const LendCard: React.FC<LendCardProps> = ({ parsedContent, content }) => {
  const router = useRouter();

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
    router.push("/lending");
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

export default LendCard;
