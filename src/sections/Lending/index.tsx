'use client';

import { useState } from "react";
import DolomiteModal from "./DolomiteModal";
import BendModal from "./BendModal";

const LendingView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBendModalOpen, setIsBendModalOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <button onClick={() => setIsBendModalOpen(true)}>Open Bend Modal</button>

        <DolomiteModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <BendModal open={isBendModalOpen} onClose={() => setIsBendModalOpen(false)} />
      </div>
    );
}

export default LendingView;