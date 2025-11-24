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

  // 🚨 CHAVE DE USUÁRIO: Obtém o email do usuário logado
  const userEmail = localStorage.getItem("userEmailLogado"); 

  useEffect(() => {
    // 🚨 SEGURANÇA: Verifica se o usuário está logado
    if (!userEmail) {
        navigate("/login");
        return;
    }

    const now = new Date();
    setData(now.toISOString().slice(0, 10));

    // 🚨 FILTRAGEM DE CATEGORIAS POR USUÁRIO
    const allCats = JSON.parse(localStorage.getItem("categories")) || [];
    const userCats = allCats.filter(c => c.userEmail === userEmail); // Assume que categorias têm userEmail
    
    setCategories(userCats);
    if (userCats.length > 0) setCategoriaId(userCats[0].id);
  }, [userEmail, navigate]); // Adicionado userEmail e navigate como dependências

  const parseNumber = (v) => {
    if (!v) return 0;
    return Number(String(v).replace(",", "."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

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
      userEmail: userEmail, // 👈 CHAVE CRÍTICA: Associa o gasto ao usuário
    };

    // 1. Salva o Gasto (Lista Global)
    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    gastos.unshift(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));

    // 2. 🚨 ATUALIZA SALDO DO USUÁRIO
    // Lendo e salvando na chave ESPECÍFICA do usuário (`saldo_${userEmail}`)
    const saldoKey = `saldo_${userEmail}`;
    const saldoAtual = parseFloat(localStorage.getItem(saldoKey) || "0");
    
    const novoSaldo = Number((saldoAtual - num).toFixed(2));
    localStorage.setItem(saldoKey, String(novoSaldo));

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
            type="number" // Use type="number" para melhor experiência em mobile/navegadores
            step="0.01"
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