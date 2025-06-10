import React from 'react';
import { ChevronRight } from 'lucide-react';

// ProcessingBar component
const ProcessingBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="text-xs text-gray-600 mt-1 text-center">
        {progress}%
      </div>
    </div>
  );
};

// ProcessingStep component
const ProcessingStep = ({ title, progress, isLast = false }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-gray-50 flex-1 p-4 rounded-lg shadow-sm border">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <ProcessingBar progress={progress} />
      </div>
      {/* {!isLast && (
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )} */}
    </div>
  );
};

// 1Card component
const ModelCard = ({ modelName, steps }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Model: {modelName}</h2>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <ProcessingStep
            key={step.title}
            title={step.title}
            progress={step.progress}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export const ProcessSide = () => {
  const models = [
    {
      id: 1,
      name: "Bonsai",
      steps: [
        // { title: "Image Processing", progress: 100 },
        { title: "Colmap Processing", progress: 20 },
        { title: "Reconstruction", progress: 0 }
      ]
    },
    // {
    //   id: 2,
    //   name: "School",
    //   steps: [
    //     { title: "Image Processing", progress: 100 },
    //     { title: "Colmap Processing", progress: 100 },
    //     { title: "Reconstruction", progress: 20 }
    //   ]
    // },
  ];

  // const token = localStorage.getItem('token');
  // const isInDoor = true;


  // const sse = connectSSE(
  //   token,
  //   folder,
  //   isInDoor,
  //   (data) => {
  //     console.log("SSE message:", data);
  //   },
  //   (err) => {
  //     console.error("SSE error:", err);
  //   }
  // );

  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Dashboard</h1>
          <p className="text-gray-600">Monitor your model reconstruction progress</p>
        </div>

        {models.map((model) => (
          <ModelCard
            key={model.id}
            modelName={model.name}
            steps={model.steps}
          />
        ))}
      </div>
    </div>
  );
};