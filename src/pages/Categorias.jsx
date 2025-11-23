import React, { useEffect, useState } from "react";
import { sendUpdate } from "../utils/events";
import "../styles/Categorias.css";
import BackButton from "../components/BackButton";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function Categorias() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [emoji, setEmoji] = useState("");

 // Carrega somente uma vez
useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("categories"));
  if (stored && Array.isArray(stored) && stored.length > 0) {
    setCategories(stored);
  }
}, []);

// Só salva se realmente houver categorias
useEffect(() => {
  if (categories && categories.length > 0) {
    localStorage.setItem("categories", JSON.stringify(categories));
  }
}, [categories]);


  const handleAdd = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Informe um nome para a categoria.");
      return;
    }

    const newCat = {
      id: uid(),
      name: nome.trim(),
      emoji: emoji.trim() || "🏷️",
    };

    const next = [newCat, ...categories];
    setCategories(next);

    sendUpdate();

    setNome("");
    setEmoji("");
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remover categoria? Gastos antigos manterão o ID.")) return;

    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);

    sendUpdate();
  };

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <BackButton/>
        <h2>Gerenciar Categorias</h2>

        <button className="btn-primary" onClick={() => setOpenModal(true)}>
          Adicionar Categoria
        </button>
      </div>

      <div className="categorias-list">
        {categories.length === 0 && (
          <p className="muted">Nenhuma categoria criada ainda.</p>
        )}

        {categories.map((c) => (
          <div className="categoria-item" key={c.id}>
            <div className="categoria-info">
              <div className="categoria-emoji">{c.emoji}</div>
              <div className="categoria-nome">{c.name}</div>
            </div>

            <button className="btn-danger" onClick={() => handleDelete(c.id)}>
              Remover
            </button>
          </div>
        ))}
      </div>

      {openModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Nova Categoria</h3>

            <form onSubmit={handleAdd} className="modal-form">
              <label>
                Nome
                <input value={nome} onChange={(e) => setNome(e.target.value)} />
              </label>

              <label>
                Emoji (opcional)
                <input
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="ex: 🍔"
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setOpenModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primary">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
