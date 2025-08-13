import { Button } from "@/components/ui/button"
import { Signin } from "./components/Signin"
import { Route, Routes } from "react-router-dom"
import {Signup} from "./components/Signup"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Routes>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/>
      </Routes>
      
    </div>
  )
}

export default App
