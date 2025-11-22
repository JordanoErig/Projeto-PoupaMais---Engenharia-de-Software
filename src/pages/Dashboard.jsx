import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subscribeUpdate } from "../utils/events";
import MenuLateral from "../components/MenuLateral";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtroCat, setFiltroCat] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);

  // Carrega tudo centralizado
  function loadData() {
    const s = parseFloat(localStorage.getItem("saldo") || "0");
    setSaldo(s);

    const g = JSON.parse(localStorage.getItem("gastos")) || [];
    setGastos(g);

    const c = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(c);
  }

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeUpdate(() => loadData());
    return unsubscribe;
  }, []);

  const gastosFiltrados = filtroCat
    ? gastos.filter((g) => g.categoriaId === filtroCat)
    : gastos;

  return (
    <div className="dashboard-container">

      {/* BOTÃO MENU (hamburguer no topo esquerdo) */}
      <button className="menu-btn" onClick={() => setOpenMenu(true)}>
        ☰
      </button>

      {/* MENU LATERAL (AGORA FUNCIONANDO DENTRO DO CONTAINER) */}
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
              className={`category-chip ${filtroCat === cat.id ? "active" : ""}`}
              onClick={() => window.location.href = `/categoria/${cat.id}`}

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
                    <div className="gasto-emoji">{cat?.emoji || "🏷️"}</div>
                    <div>
                      <div className="gasto-desc">
                        {g.descricao || "Sem descrição"}
                      </div>
                      <div className="gasto-date">
                        {new Date(g.data).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="gasto-valor">R$ {g.valor.toFixed(2)}</div>
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
          onClick={() => (window.location.href = "/registrar-gasto")}
        >
          Registrar Gasto
        </button>

        <button
          className="btn-secondary"
          onClick={() => (window.location.href = "/categorias")}
        >
          Gerenciar Categorias
        </button>
      </div>
    </div>
  );
}
