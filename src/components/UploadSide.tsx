import React, { useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

export const UploadSide = () => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [confirm, setConfirm] = useState(false)

  const handleImageUploadClick = () => {
    if (imageInputRef != null) {
      imageInputRef.current.click();
    }
  };

  const handleVideoUploadClick = () => {
    if (videoInputRef != null) {
      videoInputRef.current.click();
    }
  };

  const handleCancelImage = () => {
    setImages([])
  }

  const handleCanceVideo = () => {
    setVideos([])
  }

  const handleImageChange = (event: any) => {
    const files = Array.from(event.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setImages(imageURLs);
  };

  const handleVideoChange = (event: any) => {
    const files = Array.from(event.target.files);
    const videoURLs = files.map((file) => URL.createObjectURL(file));
    setVideos(videoURLs);
  };

  return (
    <div className="w-full h-full bg-amber-50 p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
      {/* Image Previews */}
      {images.length > 0 && (
        <div>
          <div className="w-full border-1 border-b-black my-5"></div>
          <div className="mb-4 space-y-2">
            <h3 className="font-medium">Images:</h3>
            <div className="overflow-x-auto max-h-56 border rounded p-2">
              <div className="flex flex-wrap gap-2">
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    className="w-[calc(100%/6-8px)] h-24 object-cover rounded border"
                    style={{ flex: "0 0 calc(100% / 6 - 8px)" }}
                  />
                ))}
              </div>
            </div>
            <div>
              <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-amber-700 transition"
                onClick={handleCancelImage}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Previews */}
      {videos.length > 0 && (
        <div className="mb-4 h-60 space-y-2 flex items-center justify-between">
          <div className="w-1/3 grid grid-cols-1 gap-2">
            <h3 className="font-medium">Videos:</h3>
            {videos.map((src, index) => (
              <video
                key={index}
                src={src}
                controls
                className="w-full max-h-48 rounded border"
              />
            ))}
            <div className="">
              <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-amber-700 transition"
                onClick={handleCanceVideo}>
                Cancel
              </button>
            </div>
          </div>

          <div className="">
            <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-amber-700 transition">
              Process
            </button>
          </div>

          <div className="w-1/3 h-full bg-amber-400">
            Prossed Image
          </div>

        </div>
      )}


      {/* Upload Buttons */}
      <div className="w-full border-1 border-b-black my-5"></div>
      <div className="flex items-center justify-between gap-10">
        <button
          onClick={handleImageUploadClick}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Upload Video
        </button>
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          onChange={handleVideoChange}
          className="hidden"
        />
        <button
          onClick={handleVideoUploadClick}
          className="w-1/4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Recontruction
        </button>
      </div>
    </div>
  );
};
