import React from 'react';
import { FolderIcon, FileIcon, Download, TvMinimalPlay } from 'lucide-react';

const modelList = [
  { name: '4d', type: 'folder', message: 'add splatv examples', time: 'about 1 year ago' },
  { name: 'bicycle', type: 'folder', message: 'Upload bicycle-7k-mini.splat', time: 'about 1 year ago' },
  { name: 'bonsai', type: 'folder', message: 'Upload bonsai-7k-mini.splat', time: 'over 1 year ago' },
  { name: 'counter', type: 'folder', message: 'Delete counter/counter-7k-raw.splat', time: 'over 1 year ago' },
  { name: 'garden', type: 'folder', message: 'Delete garden/garden-7k-raw.splat', time: 'over 1 year ago' },
  { name: 'kitchen', type: 'folder', message: 'Delete kitchen/kitchen-7k-raw.splat', time: 'over 1 year ago' },
  { name: 'luigi', type: 'folder', message: 'Upload luigi.ply', time: 'over 1 year ago' },
  { name: 'playroom', type: 'folder', message: 'Delete playroom/playroom-7k-raw.splat', time: 'over 1 year ago' },
  { name: 'room', type: 'folder', message: 'Delete room/room-7k-raw.splat', time: 'over 1 year ago' },
  { name: 'stump', type: 'folder', message: 'Delete stump/stump-7k-raw.splat', time: 'over 1 year ago' },
  { name: '.gitattributes', type: 'file', message: 'add splatv examples', time: 'about 1 year ago' },
];

export const ModelSide = () => {
  return (
    <div className="w-full h-full bg-gray-900 text-white rounded-lg overflow-hidden shadow">
      <div className="px-4 py-2 border-b border-gray-700 flex items-center">
        <div className="font-semibold text-sm text-amber-300">Processed model</div>
        <span className="ml-auto text-xs text-gray-400">{modelList.length} model</span>
      </div>
      <div>
        {modelList.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-2 border-t border-gray-800 hover:bg-gray-800"
          >
            <div className="w-1/4 flex items-center gap-2 text-blue-400">
              {item.type === 'folder' ? <FolderIcon size={18} /> : <FileIcon size={18} />}
              <span>{item.name}</span>
            </div>
            <div className="w-1/2 text-gray-300 text-sm truncate">{item.message}</div>
            <button className="flex items-center gap-2 px-3 py-2 text-white rounded hover:bg-blue-700 transition"
              title="xem">
              <TvMinimalPlay size={18} />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-white rounded hover:bg-blue-700 transition"
              title="Tải về file">
              <Download size={18} />
            </button>
            <div className="w-1/4 text-right text-gray-500 text-xs">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
