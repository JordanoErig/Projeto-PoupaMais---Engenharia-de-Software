import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../components/BackButton";
import "../styles/MetaDetalhes.css";

export default function MetaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meta, setMeta] = useState(null);

  // Carregar meta do localStorage
  useEffect(() => {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = metas.find((m) => String(m.id) === String(id));
    setMeta(encontrada || null);
  }, [id]);

  if (!meta) {
    return (
      <div className="meta-detalhes-container">
        <BackButton />
        <h2 className="erro">Meta não encontrada</h2>
      </div>
    );
  }

  // Cálculo de progresso
  const progressoPercentual = Math.min(
    ((meta.valorAtual || 0) / meta.valorObjetivo) * 100,
    100
  );

  const progressoFormatado = progressoPercentual.toFixed(1);

  // Navegar para adicionar progresso
  function handleAdicionarProgresso() {
    navigate(`/meta/${meta.id}/adicionar-progresso`);
  }

  return (
    <motion.div
      className="meta-detalhes-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <BackButton />

      <h2 className="titulo-meta">{meta.nome}</h2>

      {/* CÍRCULO DE PROGRESSO */}
      <div className="progresso-circulo">
        <svg width="180" height="180">
          <circle
            cx="90"
            cy="90"
            r="75"
            stroke="#ccc"
            strokeWidth="12"
            fill="none"
          />

          <motion.circle
            cx="90"
            cy="90"
            r="75"
            stroke="#4CAF50"
            strokeWidth="12"
            fill="none"
            strokeDasharray={2 * Math.PI * 75}
            strokeDashoffset={2 * Math.PI * 75 * (1 - progressoPercentual / 100)}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 2 * Math.PI * 75 }}
            animate={{
              strokeDashoffset:
                2 * Math.PI * 75 * (1 - progressoPercentual / 100),
            }}
            transition={{ duration: 1 }}
          />
        </svg>

        <div className="progresso-texto">
          {progressoFormatado}%  
        </div>
      </div>

      {/* INFORMAÇÕES DA META */}
      <div className="meta-info">
        <p>
          <strong>Valor Objetivo:</strong> R$ {meta.valorObjetivo.toFixed(2)}
        </p>
        <p>
          <strong>Poupado:</strong> R$ {(meta.valorAtual || 0).toFixed(2)}
        </p>
        <p>
          <strong>Restante:</strong>{" "}
          R$ {(meta.valorObjetivo - (meta.valorAtual || 0)).toFixed(2)}
        </p>
        <p>
          <strong>Data Limite:</strong> {meta.dataLimite}
        </p>
      </div>

      {/* BOTÃO ADICIONAR PROGRESSO */}
      <button className="btn-adicionar-progresso" onClick={handleAdicionarProgresso}>
        Adicionar Progresso
      </button>

      {/* HISTÓRICO */}
      <h3 className="titulo-historico">Histórico de Progresso</h3>

      <div className="historico-lista">
        {meta.historico && meta.historico.length > 0 ? (
          meta.historico.map((item, index) => (
            <motion.div
              key={index}
              className="historico-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span>+ R$ {item.valor.toFixed(2)}</span>
              <span className="data">{item.data}</span>
            </motion.div>
          ))
        ) : (
          <p className="sem-historico">Nenhum valor adicionado ainda.</p>
        )}
      </div>
    </motion.div>
  );
}
