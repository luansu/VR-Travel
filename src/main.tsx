import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home.tsx";
import Library from "./pages/Library.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Library />
  </StrictMode>
);
