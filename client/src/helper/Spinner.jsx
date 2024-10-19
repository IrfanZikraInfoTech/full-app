import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="loader"></div>
    </div>
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
// </div>
  );
};

export default Spinner;
