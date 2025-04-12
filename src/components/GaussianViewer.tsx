import { ChangeEvent, useEffect, useRef, useState } from "react";
import * as SPLAT from "gsplat";

type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

export const GaussianViewer = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(new SPLAT.Scene());
  const cameraRef = useRef(new SPLAT.Camera());
  const rendererRef = useRef<SPLAT.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');

  useEffect(() => {
    if (!canvasRef.current) return;

    rendererRef.current = new SPLAT.WebGLRenderer(canvasRef.current);
    controlsRef.current = new SPLAT.OrbitControls(cameraRef.current, rendererRef.current.canvas);

    const animate = () => {
      controlsRef.current.update();
      rendererRef.current?.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Load mô hình khi file thay đổi
  useEffect(() => {
    const loadModel = async () => {
      setStatus('loading');
      sceneRef.current.reset();

      try {
        if (!file) {
          // Load mặc định từ URL
          const url =
            "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat";
          await SPLAT.Loader.LoadAsync(url, sceneRef.current, () => { });
        } else {
          // Load file người dùng chọn
          if (file.name.endsWith(".splat")) {
            await SPLAT.Loader.LoadFromFileAsync(file, sceneRef.current, () => { });
          } else if (file.name.endsWith(".ply")) {
            await SPLAT.PLYLoader.LoadFromFileAsync(file, sceneRef.current, () => { });
          } else {
            throw new Error("Định dạng không hỗ trợ");
          }
        }

        setStatus('success');
      } catch (error) {
        console.error("Lỗi khi load mô hình:", error);
        setStatus('error');
      }
    };

    loadModel();
  }, [file]);

  // Xử lý chọn file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="relative w-3/5 h-2/5">
      <canvas ref={canvasRef} className="w-full h-full block border-4 border-gray-800" />
      {status !== "success" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-xl font-semibold">🚀 Đang tải mô hình...</p>
            </div>
          )}
          {status === "idle" && (
            <p className="text-white text-xl font-semibold">⏳ Đang chờ bắt đầu...</p>
          )}
          {status === "error" && (
            <p className="text-white text-xl font-semibold">❌ Lỗi khi tải mô hình!</p>
          )}
        </div>
      )}

      <div className='flex items-center justify-center mt-4'>
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
