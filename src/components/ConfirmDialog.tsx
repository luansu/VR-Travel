import React from "react";

interface ConfirmDialogProps {
   message : string, 
   onYes : ()=> void, 
   onNo : () => void
}

export const ConfirmDialog : React.FC<ConfirmDialogProps> = ({ message, onYes, onNo }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
        <p className="mb-4 text-lg font-medium">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onYes}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onNo}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
