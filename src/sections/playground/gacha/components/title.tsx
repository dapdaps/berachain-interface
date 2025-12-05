'use client';

import { useState } from "react";
import Rules from "./rules";

export default function Title() {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <div>
        <div className="w-[350px] mx-auto relative">
          <img src="/images/gacha/gacha-title.png" alt="title" className="w-[350px]" />
          <img 
            src="/images/gacha/rule.png" 
            alt="rules" 
            className="absolute right-[-70px] top-[10px] w-[65px] cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setShowRules(true)}
          />
        </div>
      </div>
      
      <Rules visible={showRules} onClose={() => setShowRules(false)} />
    </>
  );
}