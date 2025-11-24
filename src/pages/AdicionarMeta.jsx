import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendUpdate } from "../utils/events";
import "../styles/AdicionarMeta.css";
import BackButton from "../components/BackButton";

export default function AdicionarMeta() {
  const navigate = useNavigate();
  // 🚨 NOVO: Obtém o email do usuário logado
  const userEmail = localStorage.getItem("userEmailLogado"); 

  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  function salvar(e) {
    e.preventDefault();

    // 🚨 Validação: Redireciona se não estiver logado (segurança)
    if (!userEmail) {
      alert("Sessão expirada ou inválida. Faça login novamente.");
      navigate("/login");
      return;
    }
    
    // Validações básicas
    if (!nome.trim()) return alert("Nome é obrigatório");
    if (!valorObjetivo) return alert("Valor é obrigatório");
    if (!dataLimite) return alert("Data é obrigatória");

    const meta = {
      id: Date.now(),
      nome,
      valorObjetivo: parseFloat(valorObjetivo),
      valorAtual: 0,
      dataLimite,
      userEmail: userEmail, // 👈 CHAVE CRÍTICA: Associa a meta ao usuário logado
    };

    // Salva no LocalStorage
    const lista = JSON.parse(localStorage.getItem("metas")) || [];
    lista.push(meta);
    localStorage.setItem("metas", JSON.stringify(lista));

    // Atualiza a lista e navega de volta
    sendUpdate();
    navigate("/metas");
  }

  return (
    <div className="addmeta-container">
      {/* 🚨 BackButton não precisa de prop 'to' se o componente já a gerencia */}
      <BackButton/>
      
      {/* Cabeçalho */}
      <div className="addmeta-header">
        <h2 style={{ margin: 0, color: "#4ebfa2" }}>Nova Meta</h2>
      </div>

      {/* Formulário */}
      <form className="form-area" onSubmit={salvar}>
        
        <label>Nome da Meta</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Viagem de Férias"
          required
        />

        <label>Valor Objetivo (R$)</label>
        <input
          type="number"
          value={valorObjetivo}
          onChange={(e) => setValorObjetivo(e.target.value)}
          placeholder="Ex: 5000"
          step="0.01"
          required
        />

        <label>Data Limite</label>
        <input
          type="date"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
          required
        />

        <button type="submit" className="btn-salvar">
          Salvar Meta
        </button>

      </form>
    </div>
  );
}