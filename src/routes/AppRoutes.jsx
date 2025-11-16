import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "../pages/TelaInicial";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

      </Routes>
    </BrowserRouter>
  );
}
