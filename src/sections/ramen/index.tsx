"use client";

import React from "react";
import Content from "@/sections/ramen/content";
import useIsMobile from '@/hooks/use-isMobile';
import MobileContent from '@/sections/ramen/mobile';

export default function RamenList(props: any) {
  const { tab } = props;

  const isMobile = useIsMobile();

  return (
    isMobile ? (
      <MobileContent tab={tab} />
    ) : (
      <Content />
    )
  );
}
