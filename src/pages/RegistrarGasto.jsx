import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendUpdate } from "../utils/events";
import "../styles/RegistrarGasto.css";
import BackButton from "../components/BackButton";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function RegistrarGasto() {
  const navigate = useNavigate();

  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const now = new Date();
    setData(now.toISOString().slice(0, 10));

    const cats = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(cats);
    if (cats.length > 0) setCategoriaId(cats[0].id);
  }, []);

  const parseNumber = (v) => {
    if (!v) return 0;
    return Number(String(v).replace(",", "."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = parseNumber(valor);

    if (!num || num <= 0) {
      alert("Informe um valor válido maior que 0.");
      return;
    }

    if (!categoriaId) {
      alert("Selecione uma categoria.");
      return;
    }

    const gasto = {
      id: uid(),
      valor: num,
      data,
      categoriaId,
      descricao: descricao.trim(),
      createdAt: new Date().toISOString(),
    };

    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    gastos.unshift(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));

    const saldoAtual = parseFloat(localStorage.getItem("saldo") || "0");
    const novoSaldo = Number((saldoAtual - num).toFixed(2));
    localStorage.setItem("saldo", String(novoSaldo));

    sendUpdate();

    alert("Gasto registrado com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="registrar-container">
      <div className="registrar-header">
        <BackButton to="/dashboard" />

        <h2>Registrar Gasto</h2>
      </div>

      <form className="registrar-form" onSubmit={handleSubmit}>
        <label>
          Valor (R$)
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0.00"
            inputMode="decimal"
          />
        </label>

        <label>
          Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </label>

        <label>
          Categoria
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">-- selecione --</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Descrição (opcional)
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: almoço"
          />
        </label>

        <button type="submit" className="btn-primary">
          Registrar
        </button>
      </form>
    </div>
  );
}