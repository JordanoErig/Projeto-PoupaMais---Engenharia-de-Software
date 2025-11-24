import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { sendUpdate } from "../utils/events";
import BackButton from "../components/BackButton";
import "../styles/AdicionarProgresso.css";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function AdicionarProgresso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meta, setMeta] = useState(null);
  const [valor, setValor] = useState("");

  const userEmail = localStorage.getItem("userEmailLogado");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const allMetas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = allMetas.find(
      (m) => String(m.id) === String(id) && m.userEmail === userEmail
    );

    if (!encontrada) {
      alert("Meta não encontrada ou acesso negado!");
      navigate("/metas");
      return;
    }

    setMeta(encontrada);
  }, [id, navigate, userEmail]);

  function salvarProgresso(e) {
    e.preventDefault();
    const valorNumero = Number(String(valor).replace(",", "."));

    if (!userEmail) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    if (!valor || isNaN(valorNumero) || valorNumero <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    const allMetas = JSON.parse(localStorage.getItem("metas")) || [];
    const index = allMetas.findIndex(
      (m) => String(m.id) === String(id) && m.userEmail === userEmail
    );

    if (index === -1) {
      alert("Meta não encontrada ou acesso negado!");
      navigate("/metas");
      return;
    }

    const metaToUpdate = allMetas[index];

    const total = Number(metaToUpdate.valorObjetivo || 0);
    const atual = Number(metaToUpdate.valorAtual || 0);
    const restante = Math.max(0, total - atual);

    if (restante <= 0) {
      alert("Esta meta já foi concluída.");
      navigate(`/metas/${id}`);
      return;
    }

    if (valorNumero > restante) {
      alert(`Valor excede o restante da meta (faltam R$ ${restante.toFixed(2)}).`);
      return;
    }

    // ==========================================================
    // 📌 CALCULAR SALDO DINÂMICO (receitas - gastos)
    // ==========================================================

    const allGastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const allReceitas = JSON.parse(localStorage.getItem("receitas")) || [];

    const userGastos = allGastos.filter((g) => g.userEmail === userEmail);
    const userReceitas = allReceitas.filter((r) => r.userEmail === userEmail);

    const totalReceitas = userReceitas.reduce((s, r) => s + Number(r.valor), 0);
    const totalGastos = userGastos.reduce((s, g) => s + Number(g.valor), 0);

    const saldoAtual = Number((totalReceitas - totalGastos).toFixed(2));

    if (saldoAtual <= 0) {
      alert("Saldo insuficiente para adicionar valor à meta!");
      return;
    }

    if (valorNumero > saldoAtual) {
      alert(`Você só possui R$ ${saldoAtual.toFixed(2)} de saldo disponível.`);
      return;
    }

    // ==========================================================
    //  📌 **CRIA AUTOMATICAMENTE UM GASTO**
    // ==========================================================

    const novoGasto = {
      id: uid(),
      userEmail,
      descricao: `Progresso Meta — ${metaToUpdate.nome}`,
      valor: valorNumero,
      categoriaId: "meta-progress",
      data: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    allGastos.push(novoGasto);
    localStorage.setItem("gastos", JSON.stringify(allGastos));

    // ==========================================================
    // Atualizar meta
    // ==========================================================

    metaToUpdate.valorAtual = Number(
      (Number(metaToUpdate.valorAtual || 0) + valorNumero).toFixed(2)
    );

    if (!Array.isArray(metaToUpdate.historico)) metaToUpdate.historico = [];
    metaToUpdate.historico.push({
      id: uid(),
      valor: Number(valorNumero),
      data: new Date().toISOString(),
    });

    localStorage.setItem("metas", JSON.stringify(allMetas));

    sendUpdate();

    setValor("");
    navigate(`/metas/${id}`);
  }

  if (!meta) return <p>Carregando...</p>;

  const total = Number(meta.valorObjetivo || 0);
  const atual = Number(meta.valorAtual || 0);
  const restante = Math.max(0, total - atual);
  const metaConcluida = total > 0 && atual >= total;

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
          Meta: <strong>R$ {total.toFixed(2)}</strong>
        </p>
        <p className="meta-info">
          Já poupado: <strong>R$ {atual.toFixed(2)}</strong>
        </p>
        <p className="meta-info">
          Faltam: <strong>R$ {restante.toFixed(2)}</strong>
        </p>

        <form onSubmit={salvarProgresso}>
          <label>Valor a adicionar:</label>
          <input
            type="number"
            step="0.01"
            placeholder="Ex: 50.00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={metaConcluida}
          />

          <button className="btn-salvar" type="submit" disabled={metaConcluida}>
            {metaConcluida ? "Meta Concluída" : "Salvar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
