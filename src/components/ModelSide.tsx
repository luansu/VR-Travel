import React, { useEffect, useState } from "react";
import {
  FolderIcon, FileText, Download, TvMinimalPlay,
  ChevronRight, ChevronDown, RefreshCcw
} from "lucide-react";
import { HuggingFaceDatasetManager } from "../context/HuggingFaceDatasetManager";
import { getCurrentUser } from "../context/UserDataManager";
import { useNavigate } from "react-router-dom";

type PLYFile = {
  name: string;
  type: "file";
  extension: ".ply";
  size: string;
  lastModified: string;
  path: string;
};

type ModelFolder = {
  name: string;
  type: "folder";
  message: string;
  time: string;
  files: PLYFile[];
  isExpanded?: boolean;
};

export const ModelSide = () => {
  const navigate = useNavigate();
  const [folderStates, setFolderStates] = useState<ModelFolder[]>([]);
  const [selectedFile, setSelectedFile] = useState<PLYFile | null>(null);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = React.useMemo(() => new HuggingFaceDatasetManager(), []);

  const loadUser = async () => {
    try {
      const user = getCurrentUser();
      if (user) setUsername(user.username);
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Failed to load user");
    }
  };

  const BASE_URL =
    "https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main";

  const constructFileUrl = (folder: string, filename: string) =>
    `${BASE_URL}/${filename}`;

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const folders: ModelFolder[] = [];

      // Folder riêng user
      if (username) {
        const userList = await manager.ListFolderFile(username);
        folders.push({
          name: username,
          type: "folder",
          message: "Your uploaded models",
          time: "Now",
          isExpanded: true,
          files: userList
            .filter((file) => file.path.toLowerCase().endsWith(".ply"))
            .map((file) => ({
              name: file.path,
              type: "file",
              extension: ".ply",
              size: "Unknown",
              lastModified: "Unknown",
              path: constructFileUrl(username, file.path),
            })),
        });
      }

      setFolderStates(folders);
    } catch (err) {
      console.error("Fetch model error:", err);
      setError("Failed to fetch models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (username) fetchModels();
  }, [username]);

  const toggleFolder = (folderIndex: number) => {
    setFolderStates((prev) =>
      prev.map((folder, index) =>
        index === folderIndex
          ? { ...folder, isExpanded: !folder.isExpanded }
          : folder
      )
    );
  };

  const handleDownloadFile = (file: PLYFile) => {
    const link = document.createElement("a");
    link.href = file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (file: PLYFile) => {
    const path = file.path
    navigate('/', {
      state: { url: path }
    });
  };

  const totalFiles = folderStates.reduce((sum, folder) => sum + folder.files.length, 0);

  return (
    <div className="w-full h-full bg-gray-900 text-white rounded-lg overflow-hidden shadow relative">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
        <div className="font-semibold text-sm text-amber-300">3D Models</div>
        <span className="ml-auto text-xs text-gray-400">
          {folderStates.length} folders • {totalFiles} files
        </span>
        <button
          onClick={fetchModels}
          className="ml-2 p-1 rounded hover:bg-gray-800 transition text-gray-400 hover:text-white"
          disabled={loading}
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-6 text-gray-400 text-sm">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex justify-center py-6 text-red-400 text-sm">{error}</div>
        )}
        {!loading && folderStates.length === 0 && (
          <div className="flex justify-center py-6 text-gray-500 text-sm">
            No models found
          </div>
        )}

        {folderStates.map((folder, folderIndex) => (
          <div key={folderIndex} className="border-t border-gray-800">
            <div
              className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer"
              onClick={() => toggleFolder(folderIndex)}
            >
              <div className="w-1/3 flex items-center gap-2 text-blue-400">
                {folder.isExpanded ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
                <FolderIcon size={18} className="ml-1" />
                <span className="font-medium">{folder.name}</span>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                  {folder.files.length}
                </span>
              </div>
              <div className="w-1/3 text-gray-300 text-sm truncate px-2">{folder.message}</div>
              <div className="w-1/3 text-right text-gray-500 text-xs">{folder.time}</div>
            </div>

            {folder.isExpanded && (
              <>
                {folder.files.map((file: PLYFile, fileIndex: number) => (
                  <div
                    key={fileIndex}
                    className="flex items-center px-8 py-2 hover:bg-gray-700/50 transition-colors border-l-2 border-gray-600 ml-4"
                  >
                    <div className="w-1/3 flex items-center gap-2 text-green-400">
                      <FileText size={16} />
                      <span className="text-sm font-mono truncate">{file.name}</span>
                    </div>

                    {/* 2 Nút actions */}
                    <div className="w-2/3 flex justify-end gap-2">

                      {/* Nút View */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(file);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-blue-400 hover:bg-blue-600/20 rounded transition text-xs"
                      >
                        <TvMinimalPlay size={14} />
                        View
                      </button>

                      {/* Nút Download */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(file);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-green-400 hover:bg-green-600/20 rounded transition text-xs"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/30">
          <div className="text-xs text-gray-400 mb-1">Selected File:</div>
          <div className="text-sm text-white font-mono">{selectedFile.name}</div>
        </div>
      )}
    </div>
  );
};
