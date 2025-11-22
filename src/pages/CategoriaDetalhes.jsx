import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../styles/CategoriaDetalhes.css";

export default function CategoriaDetalhes() {
  const { id } = useParams(); // pega ID da categoria via URL
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const categorias = JSON.parse(localStorage.getItem("categories")) || [];
    const categoriaSel = categorias.find(c => c.id === id);
    setCategoria(categoriaSel);

    const allGastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const filtrados = allGastos.filter(g => g.categoriaId === id);
    setGastos(filtrados);

    const soma = filtrados.reduce((acc, g) => acc + g.valor, 0);
    setTotal(soma);
  }, [id]);

  if (!categoria) return <p>Categoria não encontrada.</p>;

  return (
    <div className="catdet-container">

      {/* Cabeçalho */}
      <div className="catdet-header">
        <BackButton to="/dashboard" />
        <h2>
          {categoria.emoji} {categoria.name}
        </h2>
      </div>

      {/* Total */}
      <div className="catdet-total-card">
        <p className="label">Total gasto</p>
        <p className="total">R$ {total.toFixed(2)}</p>
      </div>

      {/* Lista */}
      <div className="catdet-list-area">
        {gastos.length === 0 ? (
          <p className="muted">Nenhum gasto nessa categoria.</p>
        ) : (
          <ul className="catdet-list">
            {gastos.map(g => (
              <li key={g.id} className="catdet-item">
                <div>
                  <p className="desc">{g.descricao || "Sem descrição"}</p>
                  <p className="data">{new Date(g.data).toLocaleDateString()}</p>
                </div>
                <p className="valor">R$ {g.valor.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
