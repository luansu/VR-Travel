import React from "react";

interface ProcessBarProps {
    progress: Number
}

export const ProcessingBar: React.FC<ProcessBarProps> = ({ progress }) => {
    // progress: số từ 0 đến 100
    return (
        <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
            <div
                className="bg-green-500 h-6 rounded-full transition-all duration-500 flex justify-center items-center"
                style={{ width: `${progress}%` }}
            >{progress.toString()}%</div>
        </div>
    );
};
