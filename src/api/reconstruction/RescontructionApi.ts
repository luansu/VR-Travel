const API_BASE_URL = import.meta.env.BASE_URL

export const startReconstruction = async (folder: string, token: string) => {
  const url = new URL(`${API_BASE_URL}/reconstruction`);
  url.searchParams.append("folder", folder);

  const res = await fetch(url.toString(), {
    method: "GET",
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
