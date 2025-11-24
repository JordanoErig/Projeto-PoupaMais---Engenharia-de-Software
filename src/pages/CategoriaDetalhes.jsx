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

  // 🚨 CHAVE DE USUÁRIO: Obtém o email do usuário logado
  const userEmail = localStorage.getItem("userEmailLogado"); 

  useEffect(() => {
    // 🚨 SEGURANÇA: Verifica se o usuário está logado
    if (!userEmail) {
        navigate("/login");
        return;
    }
    
    // 1. CARREGAR E FILTRAR CATEGORIA
    const categorias = JSON.parse(localStorage.getItem("categories")) || [];
    
    // 🚨 FILTRO CRÍTICO 1: Busca a categoria que corresponde ao ID E ao usuário logado
    const categoriaSel = categorias.find(c => c.id === id && c.userEmail === userEmail);
    setCategoria(categoriaSel);
    
    // 2. CARREGAR E FILTRAR GASTOS
    if (categoriaSel) {
        const allGastos = JSON.parse(localStorage.getItem("gastos")) || [];
        
        // 🚨 FILTRO CRÍTICO 2: Filtra os gastos que pertencem a essa categoria E ao usuário logado
        const filtrados = allGastos.filter(
            g => g.categoriaId === id && g.userEmail === userEmail
        );
        
        setGastos(filtrados);

        // 3. CALCULAR TOTAL
        const soma = filtrados.reduce((acc, g) => acc + g.valor, 0);
        setTotal(soma);
    } else {
        // Se a categoria não foi encontrada/acesso negado, limpa os estados
        setGastos([]);
        setTotal(0);
    }

  }, [id, userEmail, navigate]); // Adicionado userEmail e navigate como dependências

  if (!categoria) return (
    <div className="catdet-container">
        <BackButton to="/dashboard" />
        <p className="muted" style={{marginTop: '20px'}}>
            Categoria não encontrada ou acesso negado.
        </p>
    </div>
  );

  return (
    <div className="catdet-container">
      <BackButton to="/dashboard" />

      {/* Cabeçalho */}
      <div className="catdet-header">
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