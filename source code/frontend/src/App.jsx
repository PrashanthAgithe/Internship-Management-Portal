import { Button } from "@/components/ui/button"
import { Signin } from "./pages/Signin"
import { Route, Routes } from "react-router-dom"
import {Signup} from "./pages/Signup"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/>
      </Routes>
      
    </div>
  )
}

export default App
