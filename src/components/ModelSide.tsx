import React, { useEffect, useState } from 'react';
import {
  FolderIcon, FileText, Download, TvMinimalPlay,
  ChevronRight, ChevronDown
} from 'lucide-react';
import { downloadModel, getModels } from '../api/user/userApi';

type PLYFile = {
  name: string;
  type: 'file';
  extension: '.ply';
  size: string;
  lastModified: string;
  path: string;
};

type ModelFolder = {
  name: string;
  type: 'folder';
  message: string;
  time: string;
  files: PLYFile[];
  isExpanded?: boolean;
};

export const ModelSide = () => {
  const [folderStates, setFolderStates] = useState<ModelFolder[]>([]);
  const [selectedFile, setSelectedFile] = useState<PLYFile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token: ", token)
        if (token) {
          console.log("Token: ", token)
          const res = await getModels(token);
          console.log("Data: ", res)
          if (res.model) {
            const folders: ModelFolder[] = Object.entries(res.model).map(([folderName, path]) => ({
              name: folderName,
              type: 'folder',
              message: 'Complete reconstruction',
              time: 'Just now',
              isExpanded: false,
              files: [
                {
                  name: path as string,
                  type: 'file',
                  extension: '.ply',
                  size: 'Unknown',
                  lastModified: 'Unknown',
                  path: path as string,
                }
              ]
            }));

            setFolderStates(folders);
          }
        } else {
          console.log("Token không tồn tại trong localStorage");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const toggleFolder = (folderIndex: number) => {
    setFolderStates(prev =>
      prev.map((folder, index) =>
        index === folderIndex
          ? { ...folder, isExpanded: !folder.isExpanded }
          : folder
      )
    );
  };

  const handleViewFile = (file: PLYFile) => {
    setSelectedFile(file);
    console.log('Viewing PLY file:', file);
  };

  const handleDownloadFile = async (model: ModelFolder) => {
    const token = localStorage.getItem("token")
    if(token)
      await downloadModel(model.name, token)
  };

  const totalFiles = folderStates.reduce((sum, folder) => sum + folder.files.length, 0);

  return (
    <div className="w-full h-full bg-gray-900 text-white rounded-lg overflow-hidden shadow">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center">
        <div className="font-semibold text-sm text-amber-300">3D Models</div>
        <span className="ml-auto text-xs text-gray-400">
          {folderStates.length} folders • {totalFiles} files
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {folderStates.map((folder, folderIndex) => (
          <div key={folderIndex} className="border-t border-gray-800">
            <div
              className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => toggleFolder(folderIndex)}
            >
              <div className="w-1/3 flex items-center gap-2 text-blue-400">
                <div className="flex items-center">
                  {folder.isExpanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                  <FolderIcon size={18} className="ml-1" />
                </div>
                <span className="font-medium">{folder.name}</span>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                  {folder.files.length}
                </span>
              </div>
              <div className="w-1/3 text-gray-300 text-sm truncate px-2">
                {folder.message}
              </div>
              <div className="w-1/3 text-right text-gray-500 text-xs">
                {folder.time}
              </div>
            </div>

            {folder.isExpanded && (
              <div className="bg-gray-800/50">
                {folder.files.map((file, fileIndex) => (
                  <div
                    key={fileIndex}
                    className="flex items-center px-8 py-2 hover:bg-gray-700/50 transition-colors border-l-2 border-gray-600 ml-4"
                  >
                    <div className="w-1/3 flex items-center gap-2 text-green-400">
                      <FileText size={16} />
                      <span className="text-sm font-mono">{file.name}</span>
                    </div>
                    <div className="w-1/4 text-gray-400 text-xs">{file.size}</div>
                    <div className="w-1/4 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(file);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-blue-400 hover:bg-blue-600/20 rounded transition text-xs"
                        title="Xem file PLY"
                      >
                        <TvMinimalPlay size={14} />
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(folder);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-green-400 hover:bg-green-600/20 rounded transition text-xs"
                        title="Tải về file PLY"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                    <div className="w-1/4 text-right text-gray-500 text-xs">
                      {file.lastModified}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/30">
          <div className="text-xs text-gray-400 mb-1">Selected File:</div>
          <div className="text-sm text-white font-mono">{selectedFile.name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedFile.size} • {selectedFile.lastModified}
          </div>
        </div>
      )}

      {folderStates.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <FolderIcon size={32} className="mb-2 opacity-50" />
          <span className="text-sm">Không có model nào</span>
        </div>
      )}
    </div>
  );
};
