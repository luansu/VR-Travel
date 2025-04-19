import Background from "../components/background/Background"
import { NavBar } from "../components/navbar/NavBar"
import { GaussianViewer } from "../components/GaussianViewer"


function Home() {

  return (
    <div className="flex flex-col items-center gap-4">
      <Background />
      <NavBar />
      <GaussianViewer />
    </div>
  )
}

export default Home
