import React from 'react';
import { ProcessingBar } from './ProcessingBar';

export const ProcessSide = () => {
  return (
    <div className="w-full h-full bg-amber-50 p-4 flex flex-col gap-5">
      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className=''>Model: 1</div>
        <div className="w-20 border-1 border-b-black my-5"></div>
        {/* Image Processing */}
        <div className='flex items-center justify-between'>
          <div className="bg-gray-50 w-50 p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Image Processing</h2>
          <ProcessingBar progress={100} />
        </div>
        <h1>{"=>"}</h1>
        {/* Colmap Processing */}
        <div className="bg-gray-50 w-50 p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Colmap Processing</h2>
          <ProcessingBar progress={100} />
        </div>
        <h1>{"=>"}</h1>
        {/* Reconstruction */}
        <div className="bg-gray-50 w-50 p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Reconstruction</h2>
          <ProcessingBar progress={50} />
        </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className=''>Model: 2</div>
        <div className="w-20 border-1 border-b-black my-5"></div>
        {/* Image Processing */}
        <div className='flex items-center justify-between'>
          <div className="bg-gray-50 w-50 p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Image Processing</h2>
          <ProcessingBar progress={100} />
        </div>
        <h1>{"=>"}</h1>
        {/* Colmap Processing */}
        <div className="bg-gray-50 w-50 p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Colmap Processing</h2>
          <ProcessingBar progress={100} />
        </div>
        <h1>{"=>"}</h1>
        {/* Reconstruction */}
        <div className="bg-gray-50 w-50 p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Reconstruction</h2>
          <ProcessingBar progress={20} />
        </div>
        </div>
      </div>
    </div>
  );
};
