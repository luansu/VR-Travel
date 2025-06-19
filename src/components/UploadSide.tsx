import { useEffect, useRef, useState } from "react";
import { uploadFiles } from "../api/upload/uploadApi";

export const UploadSide = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState([]);
  const [extractedFrames, setExtractedFrames] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [frameInterval, setFrameInterval] = useState(1); // Khoảng cách giữa các frame (giây)
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [isUploadVideo, setIsUploadVideo] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [reconstructionName, setReconstructionName] = useState('');

  const [imgStatus, setImgStatus] = useState<{ num: number, capacity: number }>({
    num: 0,
    capacity: 0
  });
  const [videoStatus, setVideoStatus] = useState<{ num: number, capacity: number }>({
    num: 0,
    capacity: 0
  });

  useEffect(() => {
    if (videoStatus.num <= 0) {
      setIsUploadVideo(false)
    } else {
      setIsUploadVideo(true)
    }
  }, [videoStatus])

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const handleImageUploadClick = () => {
    if (imageInputRef.current != null) {
      imageInputRef.current.click();
    }
  };

  const handleVideoUploadClick = () => {
    if (videoInputRef.current != null) {
      videoInputRef.current.click();
    }
  };

  const handleCancelImage = () => {
    // Revoke all object URLs before clearing
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setImageUrls([]);
    setImgStatus({ num: 0, capacity: 0 });
  };

  const handleCancelVideo = () => {
    setVideos([]);
    setExtractedFrames([]);
    setVideoStatus({ num: 0, capacity: 0 });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    
    // Revoke the URL for the removed image
    URL.revokeObjectURL(imageUrls[index]);
    
    setImages(newImages);
    setImageUrls(newImageUrls);

    // Cập nhật lại status nếu cần
    if (newImages.length === 0) {
      setImgStatus({ num: 0, capacity: 0 });
    } else {
      // Recalculate total size
      const totalSize = newImages.reduce((sum, file) => sum + file.size, 0);
      setImgStatus({
        num: newImages.length,
        capacity: totalSize
      });
    }
  };

  const removeVideo = (index: any) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);

    const newFrames = extractedFrames.filter((frame) => frame.videoIndex !== index);
    setExtractedFrames(newFrames);

    if (newVideos.length === 0) {
      setVideoStatus({ num: 0, capacity: 0 });
    }
  };

  const removeFrame = (frameIndex: number) => {
    const newFrames = extractedFrames.filter((_, i) => i !== frameIndex);
    setExtractedFrames(newFrames);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageChange = (event: any) => {
    const files = Array.from(event.target.files) as File[];
    
    // Create object URLs for preview
    const urls = files.map(file => URL.createObjectURL(file));
    
    // Tính tổng dung lượng
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    setImages(files);
    setImageUrls(urls);
    setImgStatus({
      num: files.length,
      capacity: totalSize
    });
  };

  const handleVideoChange = (event: any) => {
    const files = Array.from(event.target.files);
    const videoData = files.map((file: any) => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name
    }));

    // Tính tổng dung lượng
    const totalSize = files.reduce((sum, file: any) => sum + file.size, 0);

    setVideos(videoData);
    setVideoStatus({
      num: files.length,
      capacity: totalSize
    });
  };

  // Hàm tách video thành frame
  const extractFramesFromVideo = async (videoData, videoIndex) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frames = [];

      video.src = videoData.url;
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const duration = video.duration;
        const frameCount = Math.floor(duration / frameInterval);
        let currentFrame = 0;

        const extractFrame = () => {
          if (currentFrame >= frameCount) {
            resolve(frames);
            return;
          }

          const time = currentFrame * frameInterval;
          video.currentTime = time;

          video.addEventListener('seeked', function onSeeked() {
            video.removeEventListener('seeked', onSeeked);

            ctx.drawImage(video, 0, 0);
            const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);

            frames.push({
              url: frameDataUrl,
              time: time.toFixed(2),
              videoIndex: videoIndex,
              videoName: videoData.name
            });

            currentFrame++;
            setTimeout(extractFrame, 100); // Delay nhỏ để tránh lag
          });
        };

        extractFrame();
      });
    });
  };

  // Xử lý video - tách thành frame
  const handleProcessVideo = async () => {
    if (videos.length === 0) return;

    setIsProcessingVideo(true);
    const allFrames = [];

    try {
      for (let i = 0; i < videos.length; i++) {
        const frames = await extractFramesFromVideo(videos[i], i);
        allFrames.push(...frames);
      }

      setExtractedFrames(allFrames);
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setIsProcessingVideo(false);
    }
  };

  // Hàm xử lý reconstruction
  const handleReconstruction = async () => {
    setShowNameForm(true);
  };

  const handleNameSubmit = async () => {
    if (!reconstructionName.trim()) {
      alert("Please enter a name for the reconstruction");
      return;
    }

    setIsReconstructing(true);
    setShowNameForm(false);

    try {
      console.log("Starting reconstruction with name:", reconstructionName);
      console.log("Images (File[]):", images);
      console.log("Extracted frames:", extractedFrames);

      const token = localStorage.getItem('token');
      const folder = reconstructionName;

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Now images is File[] array, ready to be passed to API
      const response = await uploadFiles(images, folder, token);
      console.log("Upload response:", response);
      if(response.status === 'success'){
        handleCancelImage()
        handleCancelVideo()
        alert("Upload thành công!");
      } else {
        alert("Upload không thành công!!!");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Reconstruction completed!");
    } catch (error) {
      console.error("Error during reconstruction:", error);
    } finally {
      setIsReconstructing(false);
      setReconstructionName("");
    }
  };

  const handleCancelNameForm = () => {
    setShowNameForm(false);
    setReconstructionName('');
  };

  const shouldShowReconstruction = images.length > 0 || extractedFrames.length > 0;

  return (
    <div className="w-full h-full bg-amber-50 p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

      {/* Frame Interval Setting */}
      {isUploadVideo && (
        <div className="mb-4 p-3 bg-white rounded border">
          <label className="block text-sm font-medium mb-2">
            Frame Extraction Interval (seconds):
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={frameInterval}
            onChange={(e) => setFrameInterval(parseFloat(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
      )}

      {/* Reconstruction Button */}
      {shouldShowReconstruction && (
        <div className="mb-4">
          <button
            onClick={handleReconstruction}
            disabled={isReconstructing}
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:bg-gray-400 font-medium"
          >
            {isReconstructing ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {/* Name Form Modal */}
      {showNameForm && (
        <div className="fixed inset-0 bg-none flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Enter Reconstruction Name</h3>
            <input
              type="text"
              value={reconstructionName}
              onChange={(e) => setReconstructionName(e.target.value)}
              placeholder="Enter name for this reconstruction..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit();
                }
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelNameForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNameSubmit}
                disabled={!reconstructionName.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition disabled:bg-gray-400"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div>
          <div className="w-full border-1 border-b-black my-5"></div>
          <div className="mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">
                Images: {imgStatus.num} ({formatFileSize(imgStatus.capacity)})
              </h3>
            </div>
            <div className="overflow-x-auto max-h-56 border rounded p-2">
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative w-[calc(100%/6-8px)]">
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 z-10 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-300"
                    >
                      ×
                    </button>
                    {/* Show filename */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 truncate">
                      {images[index].name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={handleCancelImage}
              >
                Cancel All Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Previews */}
      {videos.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="w-full border-1 border-b-black my-5"></div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              Videos: {videoStatus.num} ({formatFileSize(videoStatus.capacity)})
            </h3>
            <button
              onClick={handleProcessVideo}
              disabled={isProcessingVideo}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400"
            >
              {isProcessingVideo ? 'Extracting Frames...' : 'Extract Frames'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="relative w-full max-w-sm border rounded overflow-hidden">
                {/* Overlay nút × */}
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-1 right-1 z-10 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  ×
                </button>

                {/* Video thumbnail */}
                <video
                  src={video.url}
                  controls
                  className="w-full max-h-48 rounded border"
                />

                {/* Tên video bên dưới */}
                <span className="block mt-2 text-sm font-medium truncate px-1 pb-1">
                  {video.name}
                </span>
              </div>
            ))}
          </div>

          <div>
            <button
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={handleCancelVideo}
            >
              Cancel All Videos
            </button>
          </div>
        </div>
      )}

      {/* Extracted Frames */}
      {extractedFrames.length > 0 && (
        <div className="mb-4">
          <div className="w-full border-1 border-b-black my-5"></div>
          <h3 className="font-medium mb-2">Extracted Frames: {extractedFrames.length}</h3>
          <div className="overflow-x-auto max-h-80 border rounded p-2 bg-yellow-50">
            <div className="flex flex-wrap gap-2">
              {extractedFrames.map((frame, index) => (
                <div key={index} className="relative w-[calc(100%/8-8px)]">
                  <img
                    src={frame.url}
                    alt={`frame-${index}`}
                    className="w-full h-20 object-cover rounded border"
                  />

                  {/* Nút xóa overlay */}
                  <button
                    onClick={() => removeFrame(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
                  >
                    ×
                  </button>

                  {/* Thời gian overlay đáy ảnh */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 z-10">
                    {frame.time}s
                  </div>
                </div>

              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Buttons */}
      <div className="w-full border-1 border-b-black my-5"></div>
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleImageUploadClick}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Upload Images
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          onClick={handleVideoUploadClick}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Upload Video
        </button>
        <input
          type="file"
          accept="video/*"
          multiple
          ref={videoInputRef}
          onChange={handleVideoChange}
          className="hidden"
        />
      </div>
    </div>
  );
};