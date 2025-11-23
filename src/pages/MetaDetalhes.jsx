import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../components/BackButton";
import "../styles/MetaDetalhes.css";

export default function MetaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate(); // <--- CORREÇÃO
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = metas.find((m) => m.id === parseInt(id));
    setMeta(encontrada);
  }, [id]);

  if (!meta) {
    return (
      <div className="meta-detalhes-container">
        <BackButton />
        <p className="muted">Meta não encontrada.</p>
      </div>
    );
  }

  const total = Number(meta.valorObjetivo);
  const atual = Number(meta.valorAtual) || 0;
  const porcentagem = Math.min(100, Math.round((atual / total) * 100));

  const circleLength = 440; // circunferência para strokeDasharray

  return (
    <div className="meta-detalhes-container">

      {/* Cabeçalho */}
      <div className="md-header">
        <BackButton to="/metas" />
        <h2>{meta.nome}</h2>
      </div>

      {/* Círculo de progresso */}
      <div className="progress-wrapper">
        <div className="progress-circle">
  <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
    
    <circle
      cx="80"
      cy="80"
      r="70"
      fill="none"
      stroke="#e4e4e4"
      strokeWidth="12"
    />

    <motion.circle
      cx="80"
      cy="80"
      r="70"
      fill="none"
      stroke="#4ebfa2"
      strokeWidth="12"
      strokeLinecap="round"
      strokeDasharray="440"
      initial={{ strokeDashoffset: 440 }}
      animate={{ strokeDashoffset: 440 - (440 * porcentagem) / 100 }}
      transition={{ duration: 1 }}
    />
  </svg>

  <div className="progress-text">{porcentagem}%</div>
</div>



      </div>

      {/* Resumo */}
      <div className="meta-info">
        <div className="info-box">
          <p className="label">Meta Total</p>
          <p className="value">R$ {total.toFixed(2)}</p>
        </div>

        <div className="info-box">
          <p className="label">Poupado</p>
          <p className="value green">R$ {atual.toFixed(2)}</p>
        </div>

        <div className="info-box">
          <p className="label">Faltam</p>
          <p className="value red">
            R$ {(total - atual).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Histórico */}
      <div className="historico-section">
        <h3>Histórico de Adições</h3>

        {(!meta.historico || meta.historico.length === 0) && (
          <p className="muted">Nenhum valor adicionado ainda.</p>
        )}

        <ul className="historico-list">
          {meta.historico?.map((h) => (
            <li key={h.id} className="hist-item">
              <div>
                <p className="hist-data">
                  {new Date(h.data).toLocaleDateString()}
                </p>
              </div>

              <p className="hist-valor">+ R$ {h.valor.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Botão adicionar progresso */}
      <button
        className="btn-add-progresso"
        onClick={() => navigate(`/metas/${meta.id}/progresso`)}
      >
        Adicionar Valor
      </button>

    </div>
  );
}
