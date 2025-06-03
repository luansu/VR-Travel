import React, { useState } from "react";
import { LibraryItem } from "../components/LibraryItem";
import { GaussianViewer } from "../components/GaussianViewer";

export const Library = () => {
  const [selectedModelUrl, setSelectedModelUrl] = useState<
    string | undefined
  >();

  const handleModelSelect = (url: string) => {
    setSelectedModelUrl(url);
  };

  return (
    <div className="w-screen h-full">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left side - Library Item */}
        <div className="w-1/3 p-6 overflow-y-auto">
          <LibraryItem onSelectModel={handleModelSelect} />
        </div>

        {/* Right side - Gaussian Viewer */}
        <div className="w-2/3 h-4/5 p-6">
          <div className="bg-gray-900 rounded-lg p-6 h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Model Viewer</h2>
            <div className="h-[calc(100%-6rem)] relative">
              <GaussianViewer fileUrl={selectedModelUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
