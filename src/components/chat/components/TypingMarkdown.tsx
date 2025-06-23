import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTypewriter, Options } from "../hooks/useTypewriter";
import { clsx } from "clsx";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface TypingMarkdownProps {
  content: string;
  className?: string;
  options?: Options;
  onResize?: (element: HTMLDivElement) => void;
  onScrollToBottom?: () => void;
}

const TypingMarkdown: React.FC<TypingMarkdownProps> = ({
  content,
  className,
  options,
  onResize,
  onScrollToBottom
}) => {
  const { typedContent, isTyping } = useTypewriter(content, options);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("ResizeObserver" in window) || !onResize || !containerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        onResize(containerRef.current);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);

  useEffect(() => {
    onScrollToBottom?.();
  }, [typedContent]);

  return (
    <div
      ref={containerRef}
      className={clsx(className)}
      data-typing={isTyping ? "true" : "false"}
    >
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          )
        }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {typedContent}
      </ReactMarkdown>
    </div>
  );
};

export default TypingMarkdown;
