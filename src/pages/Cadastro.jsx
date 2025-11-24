import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Usaremos o hook correto
import "../styles/Cadastro.css";
import cadastroImg from "../assets/imagens/cadastroImg.jpeg"; 

export default function Cadastro() {
  const navigate = useNavigate(); // Ativa o hook de navegação
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();

    // 1. Cria o objeto do novo usuário
    const novoUsuario = { nome, email, senha };
    
    // 2. Busca a lista de usuários existente (ou inicia uma vazia)
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosCadastrados")) || [];
    
    // 3. Verifica se o e-mail já está em uso
    const emailExiste = listaUsuarios.some(u => u.email === email);
    if (emailExiste) {
      alert("Este e-mail já está cadastrado!");
      return;
    }

    // 4. Adiciona o novo usuário à lista
    listaUsuarios.push(novoUsuario);

    // 5. Salva a lista COMPLETA de volta na nova chave
    localStorage.setItem("usuariosCadastrados", JSON.stringify(listaUsuarios));

    alert("Cadastro realizado com sucesso! Faça login para continuar.");
    
    // 6. Navegação correta do React
    navigate("/login"); 
  };

  return (
    <div className="cadastro-container">

      <button
        onClick={() => navigate("/")} // <--- Usando navigate
        className="back-btn"
        aria-label="Voltar para o início"
      >
        ←
      </button>

      {/* ... restante do JSX ... */}

      <motion.img
        src={cadastroImg}
        alt="Ilustração Cadastro"
        className="cadastro-image"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      /> 

      <form className="form-section" onSubmit={handleCadastro}>
        <h2 className="cadastro-title">Cadastro</h2>

        {/* ... inputs ... */}

        <input 
          type="text" 
          placeholder="Nome" 
          className="input-field"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required 
        />
        
        <input 
          type="email" 
          placeholder="E-mail" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        
        <input 
          type="password" 
          placeholder="Senha" 
          className="input-field"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required 
        />

        <button type="submit" className="submit-btn">
          Cadastrar
        </button>
      </form>

    </div>
  );
}