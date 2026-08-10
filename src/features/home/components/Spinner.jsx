import React from "react";
import { ScaleLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <ScaleLoader color={"#7C3AED"} />
    </div>
  );
};

export default Spinner;
