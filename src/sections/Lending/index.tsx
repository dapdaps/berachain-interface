'use client';

import { useState } from "react";
import LendingModal from "./LendingModal";

const LendingView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <LendingModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
}

export default LendingView;