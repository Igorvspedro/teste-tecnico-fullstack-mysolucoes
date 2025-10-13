import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default AppRoutes;
