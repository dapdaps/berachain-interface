"use client";

import BelongForm from "./components/form";

const BelongView = () => {

  return (
    <div className="w-full text-white">
      <div className="w-full text-center">BE--LONG</div>
      <div className="w-full uppercase text-center">
        <div>position yourself for</div>
        <div>the future rally of</div>
        <div>berachain</div>
        <div className="normal-case">
          Zap, deposit and LP into the best BERA stable<br /> pool in the whole ecosystem!
        </div>
      </div>
      <BelongForm />
    </div>
  );
};

export default BelongView;
