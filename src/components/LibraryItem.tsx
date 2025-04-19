import React, { useEffect, useState } from "react";

export interface LibraryItemProps {
  onSelectModel: (url: string) => void;
}

interface File {
  name: string;
  url: string;
}

export const LibraryItem: React.FC<LibraryItemProps> = ({ onSelectModel }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "https://huggingface.co/api/datasets/XuanHuy224/GaussianSample/tree/main/Gaussian"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dataset files");
        }

        const data = await response.json();

        // Filter for .ply files and construct proper URLs
        const plyFiles = data
          .filter((file: any) => file.path.toLowerCase().endsWith(".ply"))
          .map((file: any) => ({
            name: file.path,
            url: `https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main/Gaussian/${file.path
              .split("/")
              .pop()}`,
          }));

        setFiles(plyFiles);
      } catch (error) {
        console.error("Error fetching dataset files:", error);
        setError("Failed to load files. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

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
        <div className="text-gray-400 italic">No user files uploaded</div>
      </div>

      {/* Owner Library Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Owner Library</h2>
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
