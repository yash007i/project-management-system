import { Route, Routes, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "sonner"
import { Loader } from "lucide-react";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Files from "./pages/Files";

function App() {

  return (
    <>
      <div>
        {/* <Toaster /> */}
        <Toaster richColors position="top-right" closeButton />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={ <Home /> } />
            
            <Route path="/projects" element={<Projects />} />
            <Route path="/files" element={<Files />} />
          </Route>
          <Route path="/projects/:id" element={<Layout />}>
            <Route
              index
              element={ <ProjectDetail /> }
            />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
