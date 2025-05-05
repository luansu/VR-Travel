import Background from "../components/background/Background"
import { NavBar } from "../components/navbar/NavBar"
import { GaussianViewer } from "../components/GaussianViewer"


function Home() {

  return (
    <div className="flex flex-col justify-center items-center w-3/5 h-2/5 gap-4">
      <GaussianViewer />
    </div>
  )
}

export default Home
