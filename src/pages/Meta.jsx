import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subscribeUpdate } from "../utils/events";
import BackButton from "../components/BackButton";
import "../styles/Metas.css";

export default function Meta() {
  const [metas, setMetas] = useState([]);

  function loadMetas() {
    const m = JSON.parse(localStorage.getItem("metas")) || [];
    setMetas(m);
  }

  useEffect(() => {
    loadMetas();

    const unsub = subscribeUpdate(() => {
      loadMetas();
    });

    return unsub;
  }, []);

  function calcularStatus(meta) {
    const hoje = new Date();
    const limite = new Date(meta.dataLimite);

    if (meta.valorAtual >= meta.valorObjetivo) {
      return "Concluída";
    }

    if (hoje > limite) {
      return "Vencida";
    }

    return "Em andamento";
  }

  function progresso(meta) {
    return Math.min(
      100,
      Math.round((meta.valorAtual / meta.valorObjetivo) * 100)
    );
  }

  function navegarAdicionar() {
    window.location.href = "/adicionar-meta";
  }

  return (
    <div className="metas-container">
        <BackButton to="/dashboard" />

      <motion.div
        className="metas-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Metas Financeiras</h2>
        <button className="btn-add" onClick={navegarAdicionar}>
          + Nova Meta
        </button>
      </motion.div>

      {metas.length === 0 && (
        <p className="muted">Nenhuma meta criada ainda.</p>
      )}

      <div className="lista-metas">
        {metas.map((meta) => (
          <motion.div
            key={meta.id}
            className="meta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="meta-top">
              <h3>{meta.nome}</h3>
              <span className={`status ${calcularStatus(meta)}`}>
                {calcularStatus(meta)}
              </span>
            </div>

            <p className="meta-data">
              Prazo: {new Date(meta.dataLimite).toLocaleDateString()}
            </p>

            <p className="meta-valores">
              R$ {meta.valorAtual.toFixed(2)} / R$ {meta.valorObjetivo.toFixed(2)}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progresso(meta)}%` }}
              ></div>
            </div>

            <p className="progress-text">{progresso(meta)}%</p>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
