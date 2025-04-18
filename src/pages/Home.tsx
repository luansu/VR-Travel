import Background from "../components/Background"
import { GaussianViewer } from "../components/GaussianViewer"


function Home() {

  return (
    <div className="flex flex-col items-center gap-4">
      <Background />
      <GaussianViewer />
    </div>
  )
}

export default Home
