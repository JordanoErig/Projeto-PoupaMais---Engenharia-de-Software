import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { sendUpdate } from "../utils/events";
import BackButton from "../components/BackButton";
import "../styles/AdicionarProgresso.css";

export default function AdicionarProgresso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meta, setMeta] = useState(null);
  const [valor, setValor] = useState("");

  useEffect(() => {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = metas.find((m) => m.id === Number(id));

    if (!encontrada) {
      alert("Meta não encontrada!");
      navigate("/metas");
      return;
    }

    setMeta(encontrada);
  }, [id, navigate]);

  function salvarProgresso(e) {
    e.preventDefault();

    const valorNumero = Number(valor);

    if (!valor || valorNumero <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const index = metas.findIndex((m) => m.id === Number(id));

    if (index === -1) return;

    // Soma valor ao total
    metas[index].valorAtual += valorNumero;

    // Cria histórico se não existir
    if (!Array.isArray(metas[index].historico)) {
      metas[index].historico = [];
    }

    // Registra histórico
    metas[index].historico.push({
      valor: valorNumero,
      data: new Date().toISOString(),
    });

    // Salva tudo
    localStorage.setItem("metas", JSON.stringify(metas));

    // Atualiza outras telas
    sendUpdate();

    // Volta para os detalhes
    navigate(`/metas/${id}`);
  }

  if (!meta) return <p>Carregando...</p>;

  return (
    <div className="add-progresso-container">
      <BackButton to={`/metas/${id}`} />

      <motion.div
        className="add-progresso-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Adicionar Progresso</h2>

        <p className="meta-nome">{meta.nome}</p>
        <p className="meta-info">
          Meta: <strong>R$ {meta.valorObjetivo.toFixed(2)}</strong>
        </p>
        <p className="meta-info">
          Já poupado: <strong>R$ {meta.valorAtual.toFixed(2)}</strong>
        </p>

        <form onSubmit={salvarProgresso}>
          <label>Valor a adicionar:</label>
          <input
            type="number"
            step="0.01"
            placeholder="Ex: 50.00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <button className="btn-salvar" type="submit">
            Salvar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
