const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const startReconstruction = async (folder: string, token: string) => {
  const url = new URL(`${API_BASE_URL}/reconstruction/start`);
  url.searchParams.append("folder", folder);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Lỗi không xác định khi gọi reconstruction");
  }

  return res.json();
};

export const getReconstructionStream = (folder: string, token: string, stream_id: string) => {
  const url = new URL(`${API_BASE_URL}/reconstruction/stream`);
  url.searchParams.append("folder", folder);
  url.searchParams.append("stream_id", stream_id);

  return new EventSource(url.toString(), {
    withCredentials: false,
  });
};

export const getReconstructionSession = async (folder: string, token: string) => {
  const url = new URL(`${API_BASE_URL}/reconstruction/session`);
  url.searchParams.append("folder", folder);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Không lấy được thông tin session");
  }

  return res.json();
};
