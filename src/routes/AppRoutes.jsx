import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "../pages/TelaInicial";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Dashboard from "../pages/Dashboard";
import RegistrarGasto from "../pages/RegistrarGasto";
import Categorias from "../pages/Categorias";




export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registrar-gasto" element={<RegistrarGasto />} />
        <Route path="/categorias" element={<Categorias />} />


      </Routes>
    </BrowserRouter>
  );
}
