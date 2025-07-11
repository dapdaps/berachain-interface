import { useState, useEffect } from 'react';
import { useChatContext } from '../context/chat-context';

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export interface Options {
  interval?: number;
  step?: number | number[];
  initialIndex?: number;
}

export function useTypewriter(content: string, options: Options = {}) {
  const { interval = 80, step = 1, initialIndex = 5 } = options;
  const length = content.length;
  const { isFromHistory } = useChatContext();

  const [index, setIndex] = useState(isFromHistory ? length : initialIndex);

  useEffect(() => {
    if (isFromHistory) {
      return;
    }
    
    if (index < length) {
      const timer = setTimeout(() => {
        const currentStep = Array.isArray(step) ? getRandomInt(step[0], step[1]) : step;
        setIndex((prev) => prev + currentStep);
      }, interval);

      return () => {
        clearTimeout(timer);
      };
    }
    return;
  }, [index, interval, length, step, isFromHistory]);

  return {
    typedContent: content.slice(0, index),
    isTyping: !isFromHistory && index < length,
  };
}