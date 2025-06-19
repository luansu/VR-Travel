const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const uploadFiles = async (
  files: File[],
  folder: string,
  token: string
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("folder", folder);

  const res = await fetch(`${API_BASE_URL}/upload/files/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};

export const uploadVideo = async (
  video: File,
  frames: number,
  folder: string,
  token: string
) => {
  const formData = new FormData();
  formData.append("video", video);
  formData.append("frames", frames.toString());
  formData.append("folder", folder);

  const res = await fetch(`${API_BASE_URL}/upload/video/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};
