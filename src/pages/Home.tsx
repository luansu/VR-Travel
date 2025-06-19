import { useLocation } from "react-router-dom";
import { GaussianViewer } from "../components/GaussianViewer";

function Home() {
  const location = useLocation();
  const url = location.state?.url || "";

  return (
    <div className="flex flex-col justify-center items-center w-3/5 h-2/5 gap-4">
      <GaussianViewer fileUrl={url} />
    </div>
  );
}

export default Home;
