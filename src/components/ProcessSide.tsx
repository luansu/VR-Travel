import React, { useEffect, useState } from "react";
import { getModels } from "../api/user/userApi";
import { startReconstruction } from "../api/reconstruction/rescontructionApi";

export const ProcessSide = () => {
  const [models, setModels] = useState([]);
  const token = localStorage.getItem("token");

  const ProcessingBar = ({ progress } : any) => (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-orange-500 h-3 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  const handleStartReconstruction = async (modelName : string) => {
    console.log(`Start reconstruction for model: ${modelName}`);
    if(!token) return
    const res = await startReconstruction(modelName, token)
    if(res.stream_id){
      window.location.reload();
    }
    console.log("Start: ", res)
  };

  const ProcessingStep = ({ title, progress, status, modelName } : any) => (
    <div className="flex items-center gap-4">
      <div className="bg-gray-50 flex-1 p-4 rounded-lg shadow-sm border">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <ProcessingBar progress={progress} />
        <div className="flex justify-between text-xs text-gray-500 mt-1 mb-2">
          <span>Status: {status}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>

        {status === "uploaded" && (
          <button
            onClick={() => handleStartReconstruction(modelName)}
            className="mt-2 px-3 py-1 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Start Reconstruction
          </button>
        )}
      </div>
    </div>
  );

  const ModelCard = ({ modelName, steps } : any) => (
    <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Model: {modelName}</h2>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      <div className="space-y-4">
        {steps.map((step) => (
          <ProcessingStep
            key={step.title}
            title={step.title}
            progress={step.progress}
            status={step.status}
            modelName={modelName}
          />
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await getModels(token);
        const modelEntries = Object.entries(response.model);

        const modelsData = modelEntries.map(([name, info], index) => ({
          id: index + 1,
          name,
          folder: name,
          steps: [
            {
              title: "Overall Progress",
              progress: info.progress || 0,
              status: info.status || "unknown",
            },
          ],
        }));

        setModels(modelsData);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModels();
  }, [token]);

  return (
    <div className="w-full h-full p-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Processing Dashboard</h1>
        <p className="text-gray-600 text-center mb-8">Monitor your model reconstruction progress</p>

        {models.length === 0 ? (
          <p className="text-center text-gray-500">No models available.</p>
        ) : (
          models.map((model) => (
            <ModelCard key={model.id} modelName={model.name} steps={model.steps} />
          ))
        )}
      </div>
    </div>
  );
};
