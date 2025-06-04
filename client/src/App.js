import { Routes, Route } from "react-router-dom"
import './App.css';
import Log from "./pages/Log";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Vote from "./pages/Vote";

function App() {
  return (
    <Routes>
      <Route path="/log" element={<Log />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Home />} />
      <Route path="/vote" element={<Vote />} />
    </Routes>
  );
}

export default App;
