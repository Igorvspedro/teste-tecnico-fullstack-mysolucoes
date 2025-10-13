import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<h1>Register</h1>} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default AppRoutes;
