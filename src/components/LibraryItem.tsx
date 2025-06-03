import React, { useEffect, useState } from "react";
import { HuggingFaceDatasetManager } from "./../context/HuggingFaceDatasetManager";

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

  useEffect(() => {
    // Get current user's username from localStorage
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const { username } = JSON.parse(currentUser);
      setUsername(username);
      fetchUserFiles(username);
    }
  }, []);

  const fetchFiles = async (foldername: string = "Gaussian") => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = new HuggingFaceDatasetManager(
        "XuanHuy224/GaussianSample"
      );
      const fileList = await manager.ListFolderFile(foldername);

      // Filter for .ply files and construct proper URLs
      const plyFiles = fileList
        .filter((file) => file.path.toLowerCase().endsWith(".ply"))
        .map((file) => ({
          name: file.path,
          url: `https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main/${file.path}`,
        }));

      setFiles(plyFiles);
    } catch (error: unknown) {
      console.error("Error fetching dataset files:", error as Error);
      setError("Failed to load files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserFiles = async (username: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = new HuggingFaceDatasetManager(
        "XuanHuy224/GaussianSample"
      );

      // Try to fetch files from user's folder
      try {
        const userPath = `${username}`;
        const fileList = await manager.ListFolderFile(userPath);

        // Filter for .ply files and construct proper URLs
        const plyFiles = fileList
          .filter((file) => file.path.toLowerCase().endsWith(".ply"))
          .map((file) => ({
            name: file.path,
            url: `https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main/${file.path}`,
          }));

        setUserFiles(plyFiles);
      } catch (error) {
        // If folder doesn't exist, create it
        console.log(`Creating folder for user ${username}`);
        const folderPath = `${username}/.gitkeep`;
        await manager.uploadFile(folderPath, new Blob([""]));
        setUserFiles([]);
      }
    } catch (error) {
      console.error("Error handling user files:", error);
      setError("Failed to handle user files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    onSelectModel(file.url);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-8">
      {/* Sample Library Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Sample Library</h2>
        <div className="text-gray-400 italic">No samples available</div>
      </div>

      {/* User Input Library Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          User Input Library
        </h2>
      </div>
      <div className="space-y-2">
        {userFiles.length === 0 ? (
          <div className="text-gray-400">No user files uploaded</div>
        ) : (
          userFiles.map((file, index) => (
            <div
              key={index}
              onClick={() => handleFileClick(file)}
              className={`text-blue-400 hover:text-blue-300 cursor-pointer px-4 py-2 rounded hover:bg-gray-800 ${
                selectedFile?.name === file.name ? "bg-gray-800" : ""
              }`}
            >
              {file.name.split("/").pop()}
            </div>
          ))
        )}
      </div>

      {/* Owner Library Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Owner Library</h2>
          <button
            onClick={() => fetchFiles("Gaussian")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
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
            <div className="text-gray-400">Loading files...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-gray-400">No files found</div>
          ) : (
            files.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`text-blue-400 hover:text-blue-300 cursor-pointer px-4 py-2 rounded hover:bg-gray-800 ${
                  selectedFile?.name === file.name ? "bg-gray-800" : ""
                }`}
              >
                {file.name.split("/").pop()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryItem;
