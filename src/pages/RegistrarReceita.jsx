import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subscribeUpdate, emitUpdate } from "../utils/events";
import "../styles/RegistrarReceita.css";

export default function RegistrarReceita() {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [receitas, setReceitas] = useState([]);

  // Carrega receitas
  function loadReceitas() {
    const r = JSON.parse(localStorage.getItem("receitas")) || [];
    setReceitas(r);
  }

  useEffect(() => {
    loadReceitas();

    const unsub = subscribeUpdate(() => {
      loadReceitas();
    });

    return unsub;
  }, []);

  function registrar() {
    if (!valor || !descricao || !data) {
      alert("Preencha todos os campos!");
      return;
    }

    const nova = {
      id: Date.now(),
      valor: parseFloat(valor),
      descricao,
      data,
    };

    // Salva a receita
    const lista = [...receitas, nova];
    localStorage.setItem("receitas", JSON.stringify(lista));
    setReceitas(lista);

    // ---- Atualiza saldo ----
    const saldoAtual = parseFloat(localStorage.getItem("saldo") || "0");
    const novoSaldo = saldoAtual + parseFloat(valor);
    localStorage.setItem("saldo", novoSaldo);

    // Atualiza dashboard
    emitUpdate();

    // Limpa campos
    setValor("");
    setDescricao("");
    setData("");
  }

  function voltar() {
    window.history.back();
  }

  return (
    <div className="receita-container">

      <motion.div
        className="receita-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="back-btn" onClick={voltar}>←</button>
        <h2>Registrar Receita</h2>
      </motion.div>

      <div className="form-area">

        <label>Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label>Valor (R$)</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <label>Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <button className="btn-registrar" onClick={registrar}>
          Salvar Receita
        </button>
      </div>

      <div className="lista-receitas">
        <h3>Receitas Registradas</h3>

        {receitas.length === 0 && (
          <p className="muted">Nenhuma receita registrada.</p>
        )}

        <ul>
          {receitas.map((r) => (
            <li key={r.id} className="receita-item">
              <div>
                <p className="desc">{r.descricao}</p>
                <p className="data">
                  {new Date(r.data).toLocaleDateString()}
                </p>
              </div>

              <p className="valor">R$ {r.valor.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
