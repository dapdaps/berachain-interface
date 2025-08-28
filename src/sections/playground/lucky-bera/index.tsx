"use client";

import Tiger from "./components/tiger";
import { useLuckyBera } from "./hooks";

const LuckyBera = () => {
  const {
    spinMultiplier,
    toggleSpinMultiplier,
    spinUserData,
    lastSpinResult,
    handleSpinResult,
  } = useLuckyBera();

  return (
    <Tiger
      spinMultiplier={spinMultiplier}
      toggleSpinMultiplier={toggleSpinMultiplier}
      spinUserData={spinUserData}
      lastSpinResult={lastSpinResult}
      handleSpinResult={handleSpinResult}
      toggleOutHoneyVisible={() => { }}
    />
  );
};

export default LuckyBera;
