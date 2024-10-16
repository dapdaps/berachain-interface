'use client';

import { useState } from "react";
import DolomiteModal from "./Dolomite";
import BendModal from "./Bend";

const LendingView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBendModalOpen, setIsBendModalOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <button onClick={() => setIsBendModalOpen(true)}>Open Bend Modal</button>

        <DolomiteModal />
        <BendModal />
      </div>
    );
}

export default LendingView;