import React, { useEffect, useState } from "react";
import { sendUpdate } from "../utils/events";
import { useNavigate } from "react-router-dom"; // 👈 Adiciona o hook de navegação
import "../styles/Categorias.css";
import BackButton from "../components/BackButton";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function Categorias() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [emoji, setEmoji] = useState("");

  // 🚨 CHAVE DE USUÁRIO: Obtém o email do usuário logado
  const userEmail = localStorage.getItem("userEmailLogado"); 

  // Função para carregar e filtrar as categorias
  function loadCategories() {
    // 🚨 SEGURANÇA: Verifica se o usuário está logado
    if (!userEmail) {
        navigate("/login");
        return [];
    }
    
    // 1. Pega a lista GLOBAL de categorias
    const allStored = JSON.parse(localStorage.getItem("categories")) || [];
    
    // 2. 🚨 FILTRA: Apenas categorias onde o 'userEmail' corresponde ao usuário logado
    const userCategories = allStored.filter(c => c.userEmail === userEmail);
    
    setCategories(userCategories);
    return allStored; // Retorna a lista global para uso no `handleDelete`
  }

  // Carrega somente uma vez e se inscreve em updates
  useEffect(() => {
    loadCategories();
    // Você pode querer se inscrever em updates se outra parte do app mudar categorias
    // const unsub = subscribeUpdate(() => loadCategories());
    // return unsub;
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, navigate]);

  // Função auxiliar para salvar a lista completa de volta no localStorage
  function saveAllCategories(list) {
      localStorage.setItem("categories", JSON.stringify(list));
      sendUpdate();
  }

  const handleAdd = (e) => {
    e.preventDefault();
    
    if (!userEmail) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }
    
    if (!nome.trim()) {
      alert("Informe um nome para a categoria.");
      return;
    }

    const newCat = {
      id: uid(),
      name: nome.trim(),
      emoji: emoji.trim() || "🏷️",
      userEmail: userEmail, // 👈 CHAVE CRÍTICA: Associa a categoria ao usuário
    };

    // 1. Pega a lista GLOBAL
    const allCategories = JSON.parse(localStorage.getItem("categories")) || [];
    
    // 2. Adiciona a nova categoria (lista global)
    allCategories.unshift(newCat);
    saveAllCategories(allCategories);
    
    // 3. Atualiza o estado local (que é filtrado)
    setCategories(prev => [newCat, ...prev]);

    setNome("");
    setEmoji("");
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remover categoria? Gastos antigos manterão o ID.")) return;

    // 1. Pega a lista GLOBAL
    const allCategories = JSON.parse(localStorage.getItem("categories")) || [];
    
    // 2. 🚨 Remove APENAS o item com o ID específico, de toda a lista
    const updatedGlobal = allCategories.filter((c) => c.id !== id);
    
    // 3. Salva a lista GLOBAL atualizada
    saveAllCategories(updatedGlobal);
    
    // 4. Atualiza o estado local (que já é filtrado por usuário)
    const updatedUserList = categories.filter((c) => c.id !== id);
    setCategories(updatedUserList);
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

        {/* Exibe apenas as categorias do usuário logado */}
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