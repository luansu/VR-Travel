import { ChangeEvent, useEffect, useRef, useState } from "react";
import * as SPLAT from "gsplat";

type UploadStatus = "idle" | "loading" | "success" | "error";

type GaussianViewerProps = {
  fileUrl?: string;
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

      <div className="flex items-center justify-center mt-4">
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
      </div>
    </div>
  );
};
