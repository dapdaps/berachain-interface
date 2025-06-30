import React, { useEffect, useRef, useState } from 'react';
import TypingMarkdown from './TypingMarkdown';
import { useChatContext } from '../context/chat-context';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import useToast from '@/hooks/use-toast';
import clsx from 'clsx';
import { useRequest } from 'ahooks';
import { post } from '@/utils/http';

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
  const componentRef = useRef<HTMLDivElement>(null);
  const [likeStatus, setLikeStatus] = useState<any>();

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

  const getComponentText = () => {
    if (componentRef.current) {
      return componentRef.current.innerText;
    }
    return '';
  };

  const onCopy = async (text: string) => {
    const textToCopy = text + (getComponentText() || "");
    await navigator.clipboard.writeText(textToCopy);
    toast.success({
      title: "Copied to clipboard"
    });
  };

  const { runAsync: onRecommend, loading: isRecommendLoading } = useRequest(async (isRecommend: boolean) => {
    if (!!message?.backendId && !likeStatus) {
      const res = await post("/api/go/chat/message/like", {
        like: isRecommend,
        message_id: message.backendId,
      });
      if (res.code !== 200) {
        toast.fail({
          title: res.message || "Failed to like message",
        });
        return;
      }
    }
    setLikeStatus(isRecommend ? 1 : 2);
  }, { manual: true });

  if (!shouldShowTyping) {
    return (
      <div className="interactive-markdown">
        <div ref={componentRef}>
          {component}
        </div>
        <Buttons
          message={{
            ...message,
            like_status: typeof likeStatus === "undefined" ? message?.like_status : likeStatus,
          }}
          className=""
          onCopy={() => {
            onCopy(content);
          }}
          onRecommend={() => onRecommend(true)}
          onDislike={() => onRecommend(false)}
          loading={isRecommendLoading}
        />
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
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
            {content}
          </ReactMarkdown>
      )}
      <div ref={componentRef}>
        {component}
      </div>
      <Buttons
        message={{
          ...message,
          like_status: typeof likeStatus === "undefined" ? message?.like_status : likeStatus,
        }}
        className=""
        onCopy={() => {
          onCopy(content);
        }}
        onRecommend={() => onRecommend(true)}
        onDislike={() => onRecommend(false)}
        loading={isRecommendLoading}
      />
    </div>
  );
};

export default InteractiveMarkdown;

const Buttons = (props: any) => {
  const { message, className, onCopy, onRecommend, onDislike, loading } = props;

  return (
    <div className={clsx("flex items-center gap-[12px] mt-[10px] px-[4px]", className)}>
      <button
        type="button"
        className="w-[14px] h-[14px] shrink-0 bg-[url('/images/home-earth/mc-bera/icon-copy.svg')] bg-no-repeat bg-center bg-contain"
        onClick={() => onCopy()}
      />
      <button
        type="button"
        className={clsx(
          "w-[14px] h-[14px] shrink-0 bg-no-repeat bg-center bg-contain disabled:opacity-50 disabled:!cursor-not-allowed",
          message?.like_status === 1 ? "bg-[url('/images/home-earth/mc-bera/icon-good-selected.svg')]" : "bg-[url('/images/home-earth/mc-bera/icon-good.svg')]",
        )}
        onClick={onRecommend}
        disabled={loading || [1, 2].includes(message?.like_status)}
      />
      <button
        type="button"
        className={clsx(
          "w-[14px] h-[14px] shrink-0 translate-y-[1px] rotate-180 bg-no-repeat bg-center bg-contain disabled:opacity-50 disabled:!cursor-not-allowed",
          message?.like_status === 2 ? "bg-[url('/images/home-earth/mc-bera/icon-good-selected.svg')]" : "bg-[url('/images/home-earth/mc-bera/icon-good.svg')]",
        )}
        onClick={onDislike}
        disabled={loading || [1, 2].includes(message?.like_status)}
      />
    </div>
  );
};