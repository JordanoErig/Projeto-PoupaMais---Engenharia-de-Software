import React, { useState } from "react";
import { motion } from "framer-motion";
import { sendUpdate } from "../utils/events";
import "../styles/AdicionarMeta.css";

export default function AdicionarMeta() {
  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  function voltar() {
    window.history.back();
  }

  function salvar() {
    if (!nome.trim()) {
      alert("O nome da meta é obrigatório.");
      return;
    }

    const valorNum = parseFloat(valorObjetivo);
    if (!valorNum || valorNum <= 0) {
      alert("Informe um valor válido e maior que zero.");
      return;
    }

    if (!dataLimite) {
      alert("Selecione uma data limite.");
      return;
    }

    const hoje = new Date();
    const limite = new Date(dataLimite);

    if (limite <= hoje) {
      alert("A data limite deve ser futura.");
      return;
    }

    const meta = {
      id: Date.now(),
      nome,
      valorObjetivo: valorNum,
      valorAtual: 0,   // O usuário ainda não acumulou nada
      dataLimite,
    };

    const lista = JSON.parse(localStorage.getItem("metas")) || [];
    lista.push(meta);

    localStorage.setItem("metas", JSON.stringify(lista));

    sendUpdate();

    window.location.href = "/metas";
  }

  return (
    <div className="addmeta-container">

      <motion.div
        className="addmeta-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="back-btn" onClick={voltar}>←</button>
        <h2>Nova Meta</h2>
      </motion.div>

      <div className="form-area">

        <label>Nome da Meta</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Comprar um notebook"
        />

        <label>Valor Objetivo (R$)</label>
        <input
          type="number"
          value={valorObjetivo}
          onChange={(e) => setValorObjetivo(e.target.value)}
          placeholder="Ex: 3500"
        />

        <label>Data Limite</label>
        <input
          type="date"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
        />

        <button className="btn-salvar" onClick={salvar}>
          Salvar Meta
        </button>

      </div>

    </div>
  );
}
