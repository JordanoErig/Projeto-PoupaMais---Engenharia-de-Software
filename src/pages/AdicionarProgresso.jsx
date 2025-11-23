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

  useEffect(() => {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = metas.find((m) => String(m.id) === String(id));

    if (!encontrada) {
      alert("Meta não encontrada!");
      navigate("/metas");
      return;
    }

    setMeta(encontrada);
  }, [id, navigate]);

  function salvarProgresso(e) {
    e.preventDefault();
    const valorNumero = Number(String(valor).replace(",", "."));

    if (!valor || isNaN(valorNumero) || valorNumero <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const index = metas.findIndex((m) => String(m.id) === String(id));
    if (index === -1) return;

    const restante = Math.max(0, Number(metas[index].valorObjetivo || 0) - Number(metas[index].valorAtual || 0));

    if (restante <= 0) {
      alert("Esta meta já foi concluída. Não é possível adicionar mais valores.");
      navigate(`/metas/${id}`);
      return;
    }

    if (valorNumero > restante) {
      // evita ultrapassar: perguntar ou limitar — aqui optamos por avisar e impedir
      alert(`Valor excede o restante da meta (faltam R$ ${restante.toFixed(2)}). Insira um valor menor ou igual.`);
      return;
    }

    // Atualiza meta
    metas[index].valorAtual = Number((Number(metas[index].valorAtual || 0) + valorNumero).toFixed(2));

    if (!Array.isArray(metas[index].historico)) metas[index].historico = [];
    metas[index].historico.push({
      id: uid(),
      valor: Number(valorNumero),
      data: new Date().toISOString(),
    });

    // Salva metas
    localStorage.setItem("metas", JSON.stringify(metas));

    // Recalcula saldo: subtrai o valor adicionado
    const saldoAtual = parseFloat(localStorage.getItem("saldo") || "0");
    const novoSaldo = Number((saldoAtual - valorNumero).toFixed(2));
    localStorage.setItem("saldo", String(novoSaldo));

    // Atualiza o restante da app
    sendUpdate();

    // limpa e volta
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
      <motion.div className="add-progresso-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>Adicionar Progresso</h2>

        <p className="meta-nome">{meta.nome}</p>
        <p className="meta-info">Meta: <strong>R$ {total.toFixed(2)}</strong></p>
        <p className="meta-info">Já poupado: <strong>R$ {atual.toFixed(2)}</strong></p>
        <p className="meta-info">Faltam: <strong>R$ {restante.toFixed(2)}</strong></p>

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
