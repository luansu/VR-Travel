const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
}

export const checkStatus = async () => {
  const res = await fetch(`${API_BASE_URL}/users/`);
  return res.json();
};

export const getModels = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/model`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning" : "true",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
  }
  return await res.json();
};


export const registerUser = async (user: UserCreate) => {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return res.json();
};

export const loginUser = async (user: UserLogin) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const updateUser = async (user: UserUpdate, token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  return res.json();
};

export const downloadModel = async (filename: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/download/${filename}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "ngrok-skip-browser-warning": "true",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error downloading file:", errorText);
    throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
  }
  
  console.log("Start download: ", res)

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};
