import React, { useEffect, useState } from "react";
import { HuggingFaceDatasetManager } from "./../context/HuggingFaceDatasetManager";
import { getCurrentUser } from "../context/UserDataManager";

export interface LibraryItemProps {
  onSelectModel: (url: string) => void;
}

interface File {
  name: string;
  url: string;
}

interface InputFile extends File {
  file?: Blob;
}

export const LibraryItem: React.FC<LibraryItemProps> = ({ onSelectModel }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [userFiles, setUserFiles] = useState<InputFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const manager = React.useMemo(() => new HuggingFaceDatasetManager(), []);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser && mounted) {
          setUsername(currentUser.username);
        }
      } catch (error) {
        if (mounted) {
          console.error("Error loading user:", error);
          setError("Failed to load user information");
        }
      }
    };

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchFiles = async (foldername: string = "Gaussian") => {
    try {
      setIsLoading(true);
      setError(null);
      if (!username) {
        throw new Error("No user logged in");
      }

      const BASE_URL =
        "https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main";

      const constructFileUrl = (folder: string, filename: string) =>
        `${BASE_URL}/${filename}`;

      const processPlyFiles = (
        files: Array<{ path: string }>,
        folder: string
      ) =>
        files
          .filter((file) => file.path.toLowerCase().endsWith(".ply"))
          .map((file) => ({
            name: file.path,
            url: constructFileUrl(folder, file.path),
          }));

      // Fetch and process sample files
      const fileList = await manager.ListFolderFile(foldername);
      const plyFiles = processPlyFiles(fileList, foldername);

      // Fetch and process user files
      const userFileList = await manager.ListFolderFile(username);
      const userPlyFiles = processPlyFiles(userFileList, username);
      const userFiles = userPlyFiles.map((file) => ({
        ...file,
        file: undefined,
      }));
      setUserFiles(userFiles);
      setFiles(plyFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to fetch files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadFiles = async () => {
      if (username && mounted) {
        await fetchFiles();
      }
    };

    loadFiles();
    return () => {
      mounted = false;
    };
  }, [username]);

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    onSelectModel(file.url);
  };

  const FileIcon = () => (
    <svg
      className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center space-x-2 text-gray-400">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>Loading files...</span>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-xl p-8 space-y-10 shadow-2xl">
      {/* Sample Library Section */}
      <div className="bg-gray-800/50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-800/70">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3 flex items-center gap-3">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Sample Library
        </h2>
        <div className="space-y-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : files.length === 0 ? (
            <div className="text-gray-400 italic">No samples available</div>
          ) : (
            files.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`text-blue-400 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
                  flex items-center gap-3 group
                  ${
                    selectedFile?.name === file.name
                      ? "bg-blue-500/20 text-blue-300"
                      : "hover:bg-gray-700/50 hover:text-blue-300"
                  }`}
              >
                <FileIcon />
                <span className="truncate">{file.name.split("/").pop()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Input Library Section */}
      <div className="bg-gray-800/50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-800/70">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3 flex items-center gap-3">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          User Input Library
        </h2>
        <div className="space-y-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : userFiles.length === 0 ? (
            <div className="text-gray-400">No user files uploaded</div>
          ) : (
            userFiles.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`text-blue-400 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
                  flex items-center gap-3 group
                  ${
                    selectedFile?.name === file.name
                      ? "bg-blue-500/20 text-blue-300"
                      : "hover:bg-gray-700/50 hover:text-blue-300"
                  }`}
              >
                <FileIcon />
                <span className="truncate">{file.name.split("/").pop()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Owner Library Section */}
      <div className="bg-gray-800/50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-800/70">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Owner Library
          </h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchFiles("Gaussian");
            }}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2
              transition-all duration-200 shadow-lg
              ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600 hover:shadow-blue-500/20 hover:-translate-y-0.5"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>
        </div>
        <div className="space-y-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-gray-400">No files found</div>
          ) : (
            files.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`text-blue-400 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
                  flex items-center gap-3 group
                  ${
                    selectedFile?.name === file.name
                      ? "bg-blue-500/20 text-blue-300"
                      : "hover:bg-gray-700/50 hover:text-blue-300"
                  }`}
              >
                <FileIcon />
                <span className="truncate">{file.name.split("/").pop()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryItem;
