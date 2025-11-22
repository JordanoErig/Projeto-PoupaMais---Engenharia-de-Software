import React from "react";
import "../styles/MenuLateral.css";

export default function MenuLateral({ open, onClose }) {
  return (
    <>
      {/* BACKDROP */}
      {open && <div className="menu-backdrop" onClick={onClose}></div>}

      {/* MENU */}
      <div className={`menu-lateral ${open ? "open" : ""}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="menu-options">

          <button
            className="menu-item"
            onClick={() => (window.location.href = "/registrar-receita")}
          >
            ➕ Registrar Receita
          </button>

          <button
            className="menu-item"
            onClick={() => (window.location.href = "/categorias")}
          >
            🗂️ Gerenciar Categorias
          </button>

          <button
            className="menu-item"
            onClick={() => (window.location.href = "/metas")}
          >
            🎯 Criar Meta
          </button>

          <button
            className="menu-item logout"
            onClick={() => {
              localStorage.removeItem("usuarioLogado");
              window.location.href = "/";
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}
