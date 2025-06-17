import React, { useEffect } from 'react';
import TypingMarkdown from './TypingMarkdown';
import { useChatContext } from '../context/chat-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useToast from '@/hooks/use-toast';
import clsx from 'clsx';

const DEFAULT_TYPING_OPTIONS = {
  interval: 30,
  step: [1, 3],
  initialIndex: 0,
};

interface InteractiveMarkdownProps {
  message: any;
  content: string;
  component?: React.ReactNode;
  onResize?: () => void;
  skipTyping?: boolean;
  typingOptions?: typeof DEFAULT_TYPING_OPTIONS;
}

const InteractiveMarkdown: React.FC<InteractiveMarkdownProps> = ({
  message,
  content,
  component,
  onResize,
  skipTyping = false,
  typingOptions = DEFAULT_TYPING_OPTIONS
}) => {
  useEffect(() => {
    if (onResize) {
      onResize();
    }
  }, [content, onResize]);

  const { isFromHistory } = useChatContext();
  const toast = useToast();
  
  const shouldShowTyping = !skipTyping;
  const isHistoryMessage = isFromHistory || message.isFromHistory;
  const useTypingAnimation = shouldShowTyping && !isHistoryMessage;

  const onCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success({
      title: "Copied to clipboard"
    });
  };

  const onRecommend = () => {};

  const onDislike = () => {};

  if (!shouldShowTyping) {
    return (
      <div className="interactive-markdown">
        {component}
      </div>
    );
  }

  return (
    <div className="interactive-markdown">
      {useTypingAnimation ? (
        <TypingMarkdown 
          options={typingOptions}
          content={content}
          onScrollToBottom={onResize}
        />
      ) : (
        <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
         remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      )}
      {component}
      <div className="flex items-center gap-[12px] mt-[10px] px-[4px]">
        <button
          type="button"
          className="w-[14px] h-[14px] shrink-0 bg-[url('/images/home-earth/mc-bera/icon-copy.svg')] bg-no-repeat bg-center bg-contain"
          onClick={() => onCopy(content)}
        />
        <button
          type="button"
          className={clsx(
            "w-[14px] h-[14px] shrink-0 bg-[url('/images/home-earth/mc-bera/icon-good.svg')] bg-no-repeat bg-center bg-contain",
            "bg-[url('/images/home-earth/mc-bera/icon-good-selected.svg')]",
          )}
          onClick={onRecommend}
        />
        <button
          type="button"
          className={clsx(
            "w-[14px] h-[14px] shrink-0 bg-[url('/images/home-earth/mc-bera/icon-good.svg')] translate-y-[1px] rotate-180 bg-no-repeat bg-center bg-contain",
            "bg-[url('/images/home-earth/mc-bera/icon-good-selected.svg')]",
          )}
          onClick={onDislike}
        />
      </div>
    </div>
  );
};

export default InteractiveMarkdown;