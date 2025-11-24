import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { subscribeUpdate } from "../utils/events";
import BackButton from "../components/BackButton";
import "../styles/Meta.css";

export default function Meta() {
  const navigate = useNavigate();
  const [metas, setMetas] = useState([]);
  
  // 🚨 NOVO: Obtém o email do usuário logado
  const userEmail = localStorage.getItem("userEmailLogado"); 

  function loadMetas() {
    // 🚨 Ação de Segurança
    if (!userEmail) {
        navigate("/login"); // Redireciona se não houver sessão ativa
        return;
    }
    
    // 1. Pega a lista GLOBAL de metas
    const allMetas = JSON.parse(localStorage.getItem("metas")) || [];
    
    // 2. 🚨 FILTRA: Apenas as metas onde o 'userEmail' corresponde ao usuário logado
    const userMetas = allMetas.filter(meta => meta.userEmail === userEmail);
    
    setMetas(userMetas);
  }

  useEffect(() => {
    loadMetas();
    const unsub = subscribeUpdate(() => {
      loadMetas();
    });
    return unsub;
  }, [userEmail]); // Adicionando userEmail como dependência para carregar se a sessão mudar.

  function calcularStatus(meta) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    const limite = new Date(meta.dataLimite);
    limite.setHours(0, 0, 0, 0); 
    const limiteEstrangeiro = new Date(limite.getTime() + 86400000); 

    if (meta.valorAtual >= meta.valorObjetivo) return "Concluída";
    if (hoje > limiteEstrangeiro) return "Vencida";
    return "Em andamento";
  }

  function progresso(meta) {
    if(meta.valorObjetivo === 0) return 0;
    return Math.min(
      100,
      Math.round((meta.valorAtual / meta.valorObjetivo) * 100)
    );
  }

  function navegarAdicionar() {
    navigate("/metas/adicionar");
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
            // Navega para a página de detalhes da meta
            onClick={() => navigate(`/metas/${meta.id}`)} 
          >
            <div className="meta-top">
              <h3>{meta.nome}</h3>
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
            
          </motion.div>
        ))}
      </div>
    </div>
  );
}