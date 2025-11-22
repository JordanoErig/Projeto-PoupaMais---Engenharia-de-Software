import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendUpdate } from "../utils/events";
import "../styles/AdicionarProgresso.css";

export default function AdicionarProgresso() {
  const { id } = useParams();
  const [meta, setMeta] = useState(null);

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const encontrada = metas.find((m) => m.id === Number(id));

    if (!encontrada) {
      alert("Meta não encontrada.");
      window.location.href = "/metas";
      return;
    }

    setMeta(encontrada);
  }, [id]);

  function salvarProgresso() {
    if (!valor || Number(valor) <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    if (!data) {
      alert("Informe uma data.");
      return;
    }

    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const index = metas.findIndex((m) => m.id === Number(id));

    const novoProgresso = {
      id: Date.now(),
      valor: Number(valor),
      descricao: descricao || "Depósito",
      data,
    };

    // Atualiza lista de progressos
    metas[index].progressos = metas[index].progressos || [];
    metas[index].progressos.push(novoProgresso);

    // Atualiza valor atual da meta
    metas[index].valorAtual += Number(valor);

    // Salva no localStorage
    localStorage.setItem("metas", JSON.stringify(metas));

    // Atualiza dashboards/listas via evento
    sendUpdate();

    // Volta para a tela de detalhes
    window.location.href = `/meta/${id}`;
  }

  function voltar() {
    window.history.back();
  }

  return (
    <div className="add-progresso-container">
      <button className="back-btn" onClick={voltar}>←</button>
      <h2>Adicionar Progresso</h2>

      {meta && (
        <p className="meta-label">
          Meta: <strong>{meta.nome}</strong>
        </p>
      )}

      <div className="form-group">
        <label>Valor</label>
        <input
          type="number"
          placeholder="Ex: 50.00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Descrição (opcional)</label>
        <input
          type="text"
          placeholder="Ex: depósito extra"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      <button className="btn-salvar" onClick={salvarProgresso}>
        Salvar Progresso
      </button>
    </div>
  );
}
