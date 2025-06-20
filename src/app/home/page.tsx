"use client";

import Home from "@/sections/home-earth";
import { useEffect, useRef } from "react";

const McBeraPage = () => {
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    const observer = new MutationObserver(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "auto",
      });
      observer.disconnect();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Home containerRef={containerRef} />
  );
};

export default McBeraPage;
