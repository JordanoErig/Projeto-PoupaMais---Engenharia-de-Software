import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // <--- IMPORTANTE
import { subscribeUpdate } from "../utils/events";
import BackButton from "../components/BackButton";
import "../styles/Meta.css";

export default function Meta() {
  const navigate = useNavigate(); // <--- HOOK DE NAVEGAÇÃO
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
    // Ajusta a hora para comparar apenas a data, evitando falsos vencidos
    hoje.setHours(0, 0, 0, 0); 
    const limite = new Date(meta.dataLimite);
    limite.setHours(0, 0, 0, 0); 
    // Correção: Converter string para número
    const limiteEstrangeiro = new Date(limite.getTime() + 86400000); // Add 1 dia para compensar fuso se necessário

    if (meta.valorAtual >= meta.valorObjetivo) return "Concluída";
    if (hoje > limiteEstrangeiro) return "Vencida";
    return "Em andamento";
  }

  function progresso(meta) {
    if(meta.valorObjetivo === 0) return 0; // Evita divisão por zero
    return Math.min(
      100,
      Math.round((meta.valorAtual / meta.valorObjetivo) * 100)
    );
  }

  // Navegação correta do React
  function navegarAdicionar() {
    navigate("/metas/adicionar");
  }

  return (
    <div className="metas-container">
      {/* Se o seu BackButton já usa useNavigate internamente, está ok. 
          Se não, considere usar navigate(-1) */}
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
        <p className="muted" style={{textAlign: "center", marginTop: "20px"}}>
            Nenhuma meta criada ainda.
        </p>
      )}

      <div className="lista-metas">
        {metas.map((meta) => (
          <motion.div
            key={meta.id}
            className="meta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate(`/metas/${meta.id}`)}
          >
            <div className="meta-top">
              <h3>{meta.nome}</h3>
              {/* Adicionei uma classe lowercase para o CSS funcionar melhor */}
              <span className={`status ${calcularStatus(meta).toLowerCase().replace(" ", "-")}`}>
                {calcularStatus(meta)}
              </span>
            </div>

            <p className="meta-data">
              Prazo: {new Date(meta.dataLimite).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}
            </p>

            <p className="meta-valores">
              R$ {Number(meta.valorAtual).toFixed(2)} / R$ {Number(meta.valorObjetivo).toFixed(2)}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progresso(meta)}%` }}
              ></div>
            </div>

            {/* <p className="progress-text">{progresso(meta)}%</p> */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}