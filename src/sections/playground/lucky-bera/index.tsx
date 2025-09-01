"use client";

import BuySpinsModal from "./components/buy-spins/modal";
import Tiger from "./components/tiger";
import { useLuckyBera } from "./hooks";

const LuckyBera = () => {
  const {
    spinMultiplier,
    toggleSpinMultiplier,
    spinUserData,
    lastSpinResult,
    handleSpinResult,
    buySpinsModalOpen,
    setBuySpinsModalOpen,
  } = useLuckyBera();

  return (
    <>
      <Tiger
        spinMultiplier={spinMultiplier}
        toggleSpinMultiplier={toggleSpinMultiplier}
        spinUserData={spinUserData}
        lastSpinResult={lastSpinResult}
        handleSpinResult={handleSpinResult}
        toggleOutHoneyVisible={() => { }}
        openBuySpinsModal={() => setBuySpinsModalOpen(true)}
      />
      <BuySpinsModal
        open={buySpinsModalOpen}
        onClose={() => setBuySpinsModalOpen(false)}
      />
    </>
  );
};

export default LuckyBera;
