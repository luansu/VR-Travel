import { ChangeEvent, useEffect, useRef, useState } from "react";
import * as SPLAT from "gsplat";
import { HuggingFaceDatasetManager } from "../context/HuggingFaceDatasetManager";

type UploadStatus = "idle" | "loading" | "success" | "error";
type SaveTarget = "user" | "owner";

type GaussianViewerProps = {
  fileUrl?: string;
};

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: SaveTarget) => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-gray-800/90 rounded-xl p-8 w-96 shadow-2xl border border-gray-700/50">
        <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Lưu mô hình
        </h2>
        <p className="text-gray-300 mb-6">Chọn thư viện để lưu mô hình:</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSave("user")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg
              hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200
              flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/20 text-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            User Input Library
          </button>
          <button
            onClick={() => onSave("owner")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg
              hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200
              flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/20 text-lg"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-gray-400 hover:text-white transition-colors duration-200 w-full flex items-center justify-center gap-2 text-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Hủy
        </button>
      </div>
    </div>
  );
};

export const GaussianViewer = ({ fileUrl }: GaussianViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(new SPLAT.Scene());
  const cameraRef = useRef(new SPLAT.Camera());
  const rendererRef = useRef<SPLAT.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [isVisible, setIsVisible] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    rendererRef.current = new SPLAT.WebGLRenderer(canvasRef.current);
    controlsRef.current = new SPLAT.OrbitControls(
      cameraRef.current,
      rendererRef.current.canvas
    );

    const animate = () => {
      if (isVisible && controlsRef.current) {
        controlsRef.current.update();
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
      }
      requestAnimationFrame(animate);
    };

    let animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
    };
  }, [isVisible]);

  // Load model when file or fileUrl changes
  useEffect(() => {
    const loadModel = async () => {
      setStatus("loading");
      sceneRef.current.reset();
      if (rendererRef.current) {
        rendererRef.current.gl.clear(
          rendererRef.current.gl.COLOR_BUFFER_BIT |
            rendererRef.current.gl.DEPTH_BUFFER_BIT
        );
      }

      try {
        if (file) {
          if (file.name.endsWith(".splat")) {
            await SPLAT.Loader.LoadFromFileAsync(
              file,
              sceneRef.current,
              () => {}
            );
          } else if (file.name.endsWith(".ply")) {
            await SPLAT.PLYLoader.LoadFromFileAsync(
              file,
              sceneRef.current,
              () => {}
            );
          } else {
            throw new Error("Unsupported file format");
          }
        } else if (fileUrl) {
          if (fileUrl.toLowerCase().endsWith(".ply")) {
            await SPLAT.PLYLoader.LoadAsync(
              fileUrl,
              sceneRef.current,
              () => {}
            );
          } else {
            await SPLAT.Loader.LoadAsync(fileUrl, sceneRef.current, () => {});
          }
        } else {
          const defaultUrl =
            "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bicycle/bicycle-7k-mini.splat";
          await SPLAT.Loader.LoadAsync(defaultUrl, sceneRef.current, () => {});
        }

        setStatus("success");
      } catch (error) {
        console.error("Error loading model:", error);
        setStatus("error");
      }
    };

    loadModel();
  }, [file, fileUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-black"
          : "w-full h-[700px] bg-gradient-to-b from-gray-900 to-black p-4 rounded-xl shadow-2xl"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-xl bg-black/50 border border-gray-800/50"
      />

      {status !== "success" && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/60 rounded-xl z-10">
          <div className="bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50 max-w-md text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 relative">
                  <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin absolute top-2 left-2"></div>
                </div>
                <p className="text-white text-2xl font-semibold flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Đang tải mô hình...
                </p>
              </div>
            )}
            {status === "idle" && (
              <p className="text-white text-2xl font-semibold flex items-center gap-3 justify-center">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Đang chờ bắt đầu...
              </p>
            )}
            {status === "error" && (
              <div className="space-y-4">
                <svg
                  className="w-20 h-20 text-red-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-white text-2xl font-semibold">
                  Lỗi khi tải mô hình!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute ${
          isFullscreen ? "bottom-8" : "bottom-4"
        } left-1/2 transform -translate-x-1/2 
        flex items-center gap-6 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/50`}
      >
        <label
          htmlFor="model-upload"
          className="h-12 px-6 rounded-lg cursor-pointer
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            text-white flex items-center gap-3 
            transition-all duration-200 shadow-lg 
            hover:shadow-blue-500/20 hover:-translate-y-0.5
            text-lg font-semibold"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Load model
          <input
            type="file"
            id="model-upload"
            accept=".splat,.ply"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {status === "success" && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="h-12 px-6 rounded-lg cursor-pointer
              bg-gradient-to-r from-green-500 to-green-600
              hover:from-green-600 hover:to-green-700
              text-white flex items-center gap-3
              transition-all duration-200 shadow-lg
              hover:shadow-green-500/20 hover:-translate-y-0.5
              text-lg font-semibold"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save model
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="h-12 w-12 rounded-lg flex items-center justify-center
            bg-gray-800 hover:bg-gray-700
            text-gray-300 hover:text-white
            transition-all duration-200 shadow-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          )}
        </button>
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={async (target) => {
          try {
            alert("Đang lưu mô hình...");
            const manager = new HuggingFaceDatasetManager();

            const currentUser = localStorage.getItem("user");
            if (!currentUser && target === "user") {
              alert("Lỗi: Bạn cần đăng nhập để lưu vào User Input Library");
              return;
            }

            const { username } = JSON.parse(currentUser || "{}");
            const modelData =
              file ||
              (fileUrl ? await fetch(fileUrl).then((r) => r.blob()) : null);

            if (!modelData) {
              alert("Lỗi: Không tìm thấy dữ liệu mô hình");
              return;
            }

            const fileName =
              file?.name || fileUrl?.split("/").pop() || "model.ply";
            const path =
              target === "user"
                ? `${username}/${fileName}`
                : `Gaussian/${fileName}`;

            await manager.uploadFile(path, modelData);
            alert("Đã lưu mô hình thành công!");
            setShowSaveDialog(false);
          } catch (error) {
            console.error("Error saving model:", error);
            alert("Lỗi khi lưu mô hình!");
          }
        }}
      />
    </div>
  );
};
