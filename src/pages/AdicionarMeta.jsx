import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook de navegação
import { sendUpdate } from "../utils/events";
import "../styles/AdicionarMeta.css"; // Seu arquivo CSS

export default function AdicionarMeta() {
  const navigate = useNavigate(); // Inicia o hook
  
  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  function salvar(e) {
    e.preventDefault(); // Impede recarregamento da página

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
    };

    // Salva no LocalStorage
    const lista = JSON.parse(localStorage.getItem("metas")) || [];
    lista.push(meta);
    localStorage.setItem("metas", JSON.stringify(lista));

    // Atualiza a lista e navega de volta
    sendUpdate();
    navigate("/metas"); // <--- Navegação correta (sem window.location)
  }

  return (
    <div className="addmeta-container">
      
      {/* Cabeçalho */}
      <div className="addmeta-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
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

        {/* Note que aqui usamos a SUA classe do CSS: btn-salvar */}
        <button type="submit" className="btn-salvar">
          Salvar Meta
        </button>

      </form>
    </div>
  );
}