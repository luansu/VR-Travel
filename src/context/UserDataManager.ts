interface User {
  username: string;
  email: string;
  password: string;
}

export function fetchUserByUsername(username: string): User | null {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: User) => u.username === username);
    return user || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export function getCurrentUser(): User | null {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}