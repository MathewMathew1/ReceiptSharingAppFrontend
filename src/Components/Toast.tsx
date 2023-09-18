import React, { useState } from 'react';
import { severityColors } from '../types/Toast';
import { AiFillCloseCircle } from "react-icons/ai"

interface ToastProps {
  variant: severityColors;
  message: string;
  handleClose: () => void
  bottom: number
}

const Toast: React.FC<ToastProps> = ({ variant, message, handleClose, bottom }) => {
    console.log(bottom)
    return (
    <div style={{bottom: `${bottom}px`}} className={`fixed right-[2rem] w-[280px]`}>
        <div className={`max-w-xs ${variant} text-sm text-white rounded-md shadow-lg`} role="alert">
            <div className="flex p-4">
                {message}
                <div className="ml-3">
                    <button onClick={() => handleClose()} type="button" className="p-0 bg-transparent border-none bg-white">
                        <AiFillCloseCircle fill={"black"} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Toast;