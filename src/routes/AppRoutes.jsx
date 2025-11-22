import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "../pages/TelaInicial";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Dashboard from "../pages/Dashboard";
import RegistrarGasto from "../pages/RegistrarGasto";
import Categorias from "../pages/Categorias";
import RegistrarReceita from "../pages/RegistrarReceita";
import CategoriaDetalhes from "../pages/CategoriaDetalhes";
import Meta from "../pages/Meta";
import AdicionarMeta from "../pages/AdicionarMeta";
import MetaDetalhes from "../pages/MetaDetalhes";
import AdicionarProgresso from "../pages/AdicionarProgresso";





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
        <Route path="/registrar-receita" element={<RegistrarReceita />} />
        <Route path="/categoria/:id" element={<CategoriaDetalhes />} />
        <Route path="/metas" element={<Meta />} />
        <Route path="/metas/adicionar" element={<AdicionarMeta />} />
        <Route path="/metas/:id" element={<MetaDetalhes />} />
        <Route path="/metas/:id/progresso" element={<AdicionarProgresso />} />
 
      </Routes>
    </BrowserRouter>
  );
}
