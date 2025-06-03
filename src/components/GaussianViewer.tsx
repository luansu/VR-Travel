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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-white text-xl font-bold mb-4">Lưu mô hình</h2>
        <p className="text-gray-300 mb-4">Chọn thư viện để lưu mô hình:</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSave("user")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            User Input Library
          </button>
          <button
            onClick={() => onSave("owner")}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Owner Library
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:text-white"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export const GaussianViewer = ({ fileUrl }: GaussianViewerProps) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(new SPLAT.Scene());
  const cameraRef = useRef(new SPLAT.Camera());
  const rendererRef = useRef<SPLAT.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [isVisible, setIsVisible] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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
      // Clean up previous model
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
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-lg bg-black"
      />
      {status !== "success" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-xl font-semibold">
                🚀 Đang tải mô hình...
              </p>
            </div>
          )}
          {status === "idle" && (
            <p className="text-white text-xl font-semibold">
              ⏳ Đang chờ bắt đầu...
            </p>
          )}
          {status === "error" && (
            <p className="text-white text-xl font-semibold">
              ❌ Lỗi khi tải mô hình!
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4">
        <label
          htmlFor="model-upload"
          className="w-32 h-10 rounded-full cursor-pointer
         bg-white hover:opacity-50
         text-black flex items-center justify-center transition duration-200
         border-0 border-black hover:border-white
         text-xs font-bold"
        >
          Load model...
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
            className="w-32 h-10 rounded-full cursor-pointer
           bg-green-500 hover:bg-green-600
           text-white flex items-center justify-center transition duration-200
           text-xs font-bold"
          >
            Save model
          </button>
        )}
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={async (target) => {
          try {
            alert("Đang lưu mô hình...");
            const manager = new HuggingFaceDatasetManager(
              "XuanHuy224/GaussianSample",
              "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"
            );

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
