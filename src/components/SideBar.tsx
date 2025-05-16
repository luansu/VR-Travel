import React, { useState } from "react";
import { UploadSide } from "./UploadSide";
import { ProcessSide } from "./ProcessSide";
import { ModelSide } from "./ModelSide";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("upload");

  const menuItems = [
    { id: "upload", label: "Upload" },
    { id: "process", label: "Process" },
    { id: "model", label: "Model" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-4 rounded-tl-2xl rounded-bl-2xl">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === item.id
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "upload" && <UploadSide />}
        {activeTab === "process" && <ProcessSide />}
        {activeTab === "model" && <ModelSide />}
      </div>
    </div>
  );
};
