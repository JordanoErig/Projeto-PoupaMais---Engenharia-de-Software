import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { subscribeUpdate } from "../utils/events";
import BackButton from "../components/BackButton";
import "../styles/MetaDetalhes.css";

export default function MetaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);
  const prevConcluida = useRef(false);

  // carrega meta
  function loadMeta() {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = metas.find((m) => String(m.id) === String(id));
    setMeta(encontrada || null);
  }

  useEffect(() => {
    loadMeta();
    const unsub = subscribeUpdate(() => loadMeta());
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // dispara confetti quando atingir 100% (apenas na transição para concluída)
  useEffect(() => {
    if (!meta) return;
    const total = Number(meta.valorObjetivo || 0);
    const atual = Number(meta.valorAtual || 0);
    const concluida = atual >= total && total > 0;

    // se passou de não-concluída para concluída -> confetti
    if (!prevConcluida.current && concluida) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
    prevConcluida.current = concluida;
  }, [meta]);

  if (!meta) {
    return (
      <div className="meta-detalhes-container">
        <BackButton to="/metas" />
        <p className="muted">Meta não encontrada.</p>
      </div>
    );
  }

  const total = Number(meta.valorObjetivo || 0);
  const atual = Number(meta.valorAtual || 0);
  const porcentagem = total === 0 ? 0 : Math.min(100, Math.round((atual / total) * 100));

  return (
    <div className="meta-detalhes-container">
      <div className="md-header">
        <BackButton to="/metas" />
        <h2>{meta.nome}</h2>
      </div>

      {/* Círculo de progresso */}
      <div className="progress-wrapper">
        <div className="progress-circle">
          <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="#e4e4e4" strokeWidth="12" />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#4ebfa2"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 70) - (2 * Math.PI * 70 * (porcentagem / 100)) }}
              transition={{ duration: 0.8 }}
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
          <p className="value red">R$ {(Math.max(0, total - atual)).toFixed(2)}</p>
        </div>
      </div>

      {/* Histórico */}
      <div className="historico-section">
        <h3>Histórico de Adições</h3>

        {(!meta.historico || meta.historico.length === 0) ? (
          <p className="muted">Nenhum valor adicionado ainda.</p>
        ) : (
          <ul className="historico-list">
            {meta.historico.slice().reverse().map((h) => (
              <li key={h.id} className="hist-item">
                <div>
                  <p className="hist-data">{new Date(h.data).toLocaleDateString()}</p>
                </div>
                <p className="hist-valor">+ R$ {Number(h.valor).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botão adicionar progresso: bloqueado se meta concluída */}
      <button
        className="btn-add-progresso"
        onClick={() => navigate(`/metas/${meta.id}/progresso`)}
        disabled={atual >= total && total > 0}
        aria-disabled={atual >= total && total > 0}
      >
        {atual >= total && total > 0 ? "Meta Concluída" : "Adicionar Valor"}
      </button>
    </div>
  );
}
