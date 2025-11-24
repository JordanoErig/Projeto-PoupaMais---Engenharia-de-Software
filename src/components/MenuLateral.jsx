import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MenuLateral.css";

export default function MenuLateral({ open, onClose }) {

  const navigate = useNavigate(); 

  function goTo(path) {
    onClose();
    navigate(path); 
  }

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
            onClick={() => goTo("/registrar-receita")}>
            ➕ Registrar Receita
          </button>

          <button
            className="menu-item"
            onClick={() => goTo("/categorias")}>
            🗂️ Gerenciar Categorias
          </button>

          <button
            className="menu-item"
            onClick={() => goTo("/metas")}>
            🎯 Criar Meta
          </button>

          {/* 🚨 CORREÇÃO DO LOGOUT */}
          <button
            className="menu-item logout"
            onClick={() => {
              // Simplesmente navegamos para a rota /logout
              // O componente Logout.jsx fará a limpeza da chave 'userEmailLogado'
              goTo("/logout"); 
            }}
          >
            🚪 Logout
          </button>

        </div>
      </div>
    </>
  );
}