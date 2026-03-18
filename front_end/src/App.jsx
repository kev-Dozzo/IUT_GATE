import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Public/Home";
import CampusMap from "./pages/Public/campusMap";
import Courses from "./pages/Public/Courses";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campus-map" element={<CampusMap />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </>
  );
}

export default App;
