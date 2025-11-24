import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subscribeUpdate, emitUpdate } from "../utils/events";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [gastos, setGastos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtroCat, setFiltroCat] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  // Email do usuário logado
  const userEmail = localStorage.getItem("userEmailLogado");

  // SALDO DINÂMICO = receitas – gastos
  const saldo = (() => {
    const totalReceitas = receitas.reduce((s, r) => s + r.valor, 0);
    const totalGastos = gastos.reduce((s, g) => s + g.valor, 0);
    return Number((totalReceitas - totalGastos).toFixed(2));
  })();

  function loadData() {
    if (!userEmail) {
      localStorage.removeItem("isLogged");
      navigate("/login");
      return;
    }

    // Carrega GASTOS do usuário
    const allGastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const userGastos = allGastos
      .filter((g) => g.userEmail === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setGastos(userGastos);

    // Carrega RECEITAS do usuário
    const allReceitas = JSON.parse(localStorage.getItem("receitas")) || [];
    const userReceitas = allReceitas
      .filter((r) => r.userEmail === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setReceitas(userReceitas);

    // Carrega CATEGORIAS do usuário
    const allCategories = JSON.parse(localStorage.getItem("categories")) || [];
    const userCategories = allCategories.filter(
      (c) => c.userEmail === userEmail
    );
    setCategories(userCategories);
  }

  useEffect(() => {
    loadData();
    const unsub = subscribeUpdate(loadData);
    return unsub;
  }, [userEmail]);

  const gastosFiltrados = filtroCat
    ? gastos.filter((g) => g.categoriaId === filtroCat)
    : gastos;

  function excluirGasto(id) {
    if (!window.confirm("Deseja realmente excluir este gasto?")) return;

    const allGastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const novaLista = allGastos.filter(
      (g) => !(g.id === id && g.userEmail === userEmail)
    );

    localStorage.setItem("gastos", JSON.stringify(novaLista));

    emitUpdate();
    loadData();
  }

  return (
    <div className="dashboard-container">
      <button className="menu-btn" onClick={() => setOpenMenu(true)}>
        ☰
      </button>

      <MenuLateral open={openMenu} onClose={() => setOpenMenu(false)} />

      {/* SALDO */}
      <motion.div
        className="saldo-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="saldo-label">Saldo da Conta</p>
        <p className="saldo-valor">R$ {saldo.toFixed(2)}</p>
      </motion.div>

      {/* CATEGORIAS */}
      <div className="categories-scroll">
        <div className="categories-inner">
          {categories.length === 0 && (
            <div className="muted">
              Nenhuma categoria — cadastre em Gerenciar Categorias
            </div>
          )}

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${
                filtroCat === cat.id ? "active" : ""
              }`}
              onClick={() => navigate(`/categoria/${cat.id}`)}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GASTOS */}
      <div className="recent-section">
        <h3>Gastos Recentes</h3>

        {gastosFiltrados.length === 0 ? (
          <p className="muted">Nenhum gasto registrado.</p>
        ) : (
          <ul className="gastos-list">
            {gastosFiltrados.slice(0, 8).map((g) => {
              const cat = categories.find((c) => c.id === g.categoriaId);
              return (
                <li key={g.id} className="gasto-item">
                  <div className="gasto-left">
                    <div className="gasto-emoji">
                      {cat?.emoji || "🏷️"}
                    </div>
                    <div>
                      <div className="gasto-desc">
                        {g.descricao || "Sem descrição"}
                      </div>
                      <div className="gasto-date">
                        {new Date(g.data).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="gasto-right">
                    <div className="gasto-valor">
                      R$ {g.valor.toFixed(2)}
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => excluirGasto(g.id)}
                    >
                      ✖
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* BOTÕES */}
      <div className="dashboard-buttons">
        <button
          className="btn-primary"
          onClick={() => navigate("/registrar-gasto")}
        >
          Registrar Gasto
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate("/categorias")}
        >
          Gerenciar Categorias
        </button>
      </div>
    </div>
  );
}
